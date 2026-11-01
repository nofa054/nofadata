import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import ColorScaleRule
from openpyxl.chart import BarChart, LineChart, ScatterChart, Series, Reference
from openpyxl.utils import get_column_letter

os.makedirs("reports", exist_ok=True)

# 1. Definisi Fungsi Pipeline Otomatisasi Laporan (Tahap 5)
def generate_rfm_report(
    csv_path: str,
    output_excel_path: str = "reports/rfm_segmentation.xlsx",
    n_clusters: int = 4,
    segment_map: dict = None,
):
    """
    Pipeline end-to-end yang menerima path CSV bersih (retail_clean.csv)
    dan menghasilkan reports/rfm_segmentation.xlsx dengan sheet:
    - RFM_Data (CustomerID, Country, Recency, Frequency, Monetary, RFM_Score, Segment, + R/F/M Score)
    - Cluster_Profile
    - Monthly
    - Dashboard (Ringkasan KPI, Tabel Heatmap RFM, Chart, dan Area Kosong Key Insights & Recommendations)
    """
    df = pd.read_csv(csv_path)
    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
    df["CustomerID"] = df["CustomerID"].astype(str)

    # Snapshot date = H+1 dari transaksi terakhir
    snapshot_date = df["InvoiceDate"].max() + pd.Timedelta(days=1)

    # Negara dominan tiap customer
    cust_country = (
        df.groupby(["CustomerID", "Country"])
        .size()
        .reset_index(name="tx_count")
        .sort_values(["CustomerID", "tx_count"], ascending=[True, False])
        .drop_duplicates("CustomerID")[["CustomerID", "Country"]]
    )

    # Hitung Recency, Frequency, Monetary
    rfm = (
        df.groupby("CustomerID")
        .agg(
            Recency=("InvoiceDate", lambda x: (snapshot_date - x.max()).days),
            Frequency=("Invoice", "nunique"),
            Monetary=("Revenue", lambda x: round(x.sum(), 2)),
        )
        .reset_index()
    )
    rfm = rfm.merge(cust_country, on="CustomerID", how="left")

    # RFM Scoring 1-5
    rfm["R_Score"] = pd.qcut(rfm["Recency"].rank(method="first"), q=5, labels=[5, 4, 3, 2, 1]).astype(int)
    rfm["F_Score"] = pd.qcut(rfm["Frequency"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
    rfm["M_Score"] = pd.qcut(rfm["Monetary"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
    rfm["RFM_Score"] = rfm["R_Score"].astype(str) + rfm["F_Score"].astype(str) + rfm["M_Score"].astype(str)

    # K-Means Clustering pada Log-Transformed + Scaled RFM
    X_log = np.log1p(rfm[["Recency", "Frequency", "Monetary"]])
    X_scaled = StandardScaler().fit_transform(X_log)
    km = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    rfm["Cluster"] = km.fit_predict(X_scaled)

    # Urutkan Cluster ID dari rata-rata Monetary tertinggi (0 = tertinggi)
    order = rfm.groupby("Cluster")["Monetary"].mean().sort_values(ascending=False).index
    rfm["Cluster"] = rfm["Cluster"].map({old: new for new, old in enumerate(order)})

    if segment_map is None:
        segment_map = {
            0: "Champions",
            1: "At Risk",
            2: "Potential Loyalists",
            3: "Hibernating",
        }
    rfm["Segment"] = rfm["Cluster"].map(segment_map)

    # Sheet 1: RFM_Data (Urutan kolom wajib + skor individu untuk kebutuhan Heatmap Excel)
    rfm_data_sheet = rfm[
        [
            "CustomerID",
            "Country",
            "Recency",
            "Frequency",
            "Monetary",
            "RFM_Score",
            "Segment",
            "R_Score",
            "F_Score",
            "M_Score",
        ]
    ].sort_values(by="Monetary", ascending=False).reset_index(drop=True)

    # Sheet 2: Cluster_Profile
    profile_sheet = (
        rfm.groupby(["Cluster", "Segment"])
        .agg(
            Customer_Count=("CustomerID", "count"),
            Avg_Recency=("Recency", "mean"),
            Avg_Frequency=("Frequency", "mean"),
            Avg_Monetary=("Monetary", "mean"),
            Total_Revenue=("Monetary", "sum"),
            Avg_R_Score=("R_Score", "mean"),
            Avg_F_Score=("F_Score", "mean"),
            Avg_M_Score=("M_Score", "mean"),
        )
        .reset_index()
    )
    profile_sheet["Customer_Share_Pct"] = (
        profile_sheet["Customer_Count"] / profile_sheet["Customer_Count"].sum() * 100
    ).round(2)
    profile_sheet["Revenue_Share_Pct"] = (
        profile_sheet["Total_Revenue"] / profile_sheet["Total_Revenue"].sum() * 100
    ).round(2)
    profile_sheet["Cum_Revenue_Pct"] = profile_sheet["Revenue_Share_Pct"].cumsum().round(2)
    profile_sheet = profile_sheet.round(2)

    # Sheet 3: Monthly (Tren Customer Baru vs Repeat per Bulan)
    df["YearMonth"] = df["InvoiceDate"].dt.strftime("%Y-%m")
    cohort = (
        df.groupby("CustomerID")["YearMonth"]
        .min()
        .reset_index()
        .rename(columns={"YearMonth": "Cohort_Month"})
    )
    df_m = df.merge(cohort, on="CustomerID", how="left")
    df_m["Customer_Type"] = np.where(df_m["YearMonth"] == df_m["Cohort_Month"], "New", "Repeat")

    monthly_sheet = (
        df_m.groupby("YearMonth")
        .agg(
            New_Customers=("CustomerID", lambda x: x[df_m.loc[x.index, "Customer_Type"] == "New"].nunique()),
            Repeat_Customers=("CustomerID", lambda x: x[df_m.loc[x.index, "Customer_Type"] == "Repeat"].nunique()),
            Total_Active_Customers=("CustomerID", "nunique"),
            New_Revenue=("Revenue", lambda x: round(x[df_m.loc[x.index, "Customer_Type"] == "New"].sum(), 2)),
            Repeat_Revenue=("Revenue", lambda x: round(x[df_m.loc[x.index, "Customer_Type"] == "Repeat"].sum(), 2)),
            Total_Revenue=("Revenue", lambda x: round(x.sum(), 2)),
        )
        .reset_index()
        .sort_values("YearMonth")
    )

    # Tulis ke Excel
    os.makedirs(os.path.dirname(output_excel_path), exist_ok=True)
    with pd.ExcelWriter(output_excel_path, engine="openpyxl") as writer:
        rfm_data_sheet.to_excel(writer, sheet_name="RFM_Data", index=False)
        profile_sheet.to_excel(writer, sheet_name="Cluster_Profile", index=False)
        monthly_sheet.to_excel(writer, sheet_name="Monthly", index=False)

    # Perkaya file Excel dengan Sheet Dashboard Dark Theme siap pakai
    build_excel_dashboard(output_excel_path, profile_sheet, monthly_sheet)

    return rfm_data_sheet, profile_sheet, monthly_sheet


def build_excel_dashboard(excel_path: str, profile_df: pd.DataFrame, monthly_df: pd.DataFrame):
    wb = openpyxl.load_workbook(excel_path)

    # Format angka pada sheet data
    ws_rfm = wb["RFM_Data"]
    ws_prof = wb["Cluster_Profile"]
    ws_mon = wb["Monthly"]

    # Buat sheet Dashboard di urutan pertama
    ws_dash = wb.create_sheet(title="Dashboard", index=0)
    ws_dash.views.sheetView[0].showGridLines = False

    # Palet Dark Theme
    bg_dark = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    bg_card = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
    bg_header_indigo = PatternFill(start_color="4F46E5", end_color="4F46E5", fill_type="solid")
    bg_header_purple = PatternFill(start_color="7C3AED", end_color="7C3AED", fill_type="solid")

    border_side = Side(border_style="thin", color="334155")
    card_border = Border(left=border_side, right=border_side, top=border_side, bottom=border_side)

    font_title = Font(name="Segoe UI", size=16, bold=True, color="F8FAFC")
    font_sub = Font(name="Segoe UI", size=10, italic=True, color="94A3B8")
    font_kpi_lbl = Font(name="Segoe UI", size=9, bold=True, color="94A3B8")
    font_kpi_val = Font(name="Segoe UI", size=16, bold=True, color="F8FAFC")
    font_sec_hdr = Font(name="Segoe UI", size=11, bold=True, color="F8FAFC")
    font_tbl_hdr = Font(name="Segoe UI", size=10, bold=True, color="F8FAFC")
    font_tbl_val = Font(name="Segoe UI", size=10, color="F8FAFC")

    # Warnai kanvas A1:Z55 dengan #0F172A
    for r in range(1, 56):
        ws_dash.row_dimensions[r].height = 20
        for c in range(1, 27):
            ws_dash.cell(row=r, column=c).fill = bg_dark

    # Set lebar kolom
    col_widths = {
        "A": 3, "B": 18, "C": 14, "D": 3,
        "E": 16, "F": 14, "G": 14, "H": 3,
        "I": 16, "J": 14, "K": 14, "L": 3,
        "M": 16, "N": 14, "O": 14, "P": 3,
        "Q": 16, "R": 14, "S": 14, "T": 3,
        "U": 16, "V": 14, "W": 14, "X": 14, "Y": 14, "Z": 3
    }
    for col_letter, width in col_widths.items():
        ws_dash.column_dimensions[col_letter].width = width

    # Header Utama (B2:Y3)
    ws_dash.merge_cells("B2:Y2")
    ws_dash["B2"] = "CUSTOMER SEGMENTATION (RFM) & RETENTION DASHBOARD — ONLINE RETAIL II"
    ws_dash["B2"].font = font_title
    ws_dash["B2"].alignment = Alignment(vertical="center", horizontal="left")

    ws_dash.merge_cells("B3:Y3")
    ws_dash["B3"] = "Data Bersih: 779,425 Transaksi | 5,878 Unique Customers | Periode: Des 2009 – Des 2011 | K-Means (K=4)"
    ws_dash["B3"].font = font_sub
    ws_dash["B3"].alignment = Alignment(vertical="center", horizontal="left")
    for r in range(2, 4):
        for c in range(2, 26):
            ws_dash.cell(row=r, column=c).fill = bg_card
            ws_dash.cell(row=r, column=c).border = card_border

    # 5 KPI Cards (Baris 5-7)
    kpis = [
        ("E", "G", "TOTAL CUSTOMERS", "=COUNTA(RFM_Data!A2:A5879)", "#,##0", "F8FAFC"),
        ("I", "K", "TOTAL REVENUE (£)", "=SUM(RFM_Data!E2:E5879)", "£#,##0", "6366F1"),
        ("M", "O", "AVG MONETARY / CUST", "=AVERAGE(RFM_Data!E2:E5879)", "£#,##0.00", "38BDF8"),
        ("Q", "S", "% CHAMPIONS", '=COUNTIF(RFM_Data!G2:G5879,"Champions")/COUNTA(RFM_Data!A2:A5879)', "0.0%", "8B5CF6"),
        ("U", "W", "% AT RISK (PRIORITY)", '=COUNTIF(RFM_Data!G2:G5879,"At Risk")/COUNTA(RFM_Data!A2:A5879)', "0.0%", "F59E0B"),
    ]
    for c_start, c_end, lbl, formula, num_fmt, val_color in kpis:
        ws_dash.merge_cells(f"{c_start}5:{c_end}5")
        ws_dash.merge_cells(f"{c_start}6:{c_end}7")
        ws_dash[f"{c_start}5"] = lbl
        ws_dash[f"{c_start}5"].font = font_kpi_lbl
        ws_dash[f"{c_start}5"].alignment = Alignment(horizontal="center", vertical="center")

        ws_dash[f"{c_start}6"] = formula
        ws_dash[f"{c_start}6"].font = Font(name="Segoe UI", size=16, bold=True, color=val_color)
        ws_dash[f"{c_start}6"].number_format = num_fmt
        ws_dash[f"{c_start}6"].alignment = Alignment(horizontal="center", vertical="center")

        c1 = openpyxl.utils.column_index_from_string(c_start)
        c2 = openpyxl.utils.column_index_from_string(c_end)
        for r in range(5, 8):
            for c in range(c1, c2 + 1):
                ws_dash.cell(row=r, column=c).fill = bg_card
                ws_dash.cell(row=r, column=c).border = card_border

    # Panel Slicer Kiri (B5:C40)
    ws_dash.merge_cells("B5:C5")
    ws_dash["B5"] = "SLICER / FILTER AREA"
    ws_dash["B5"].font = font_sec_hdr
    ws_dash["B5"].fill = bg_header_indigo
    ws_dash["B5"].alignment = Alignment(horizontal="center", vertical="center")
    for r in range(6, 41):
        for c in range(2, 4):
            ws_dash.cell(row=r, column=c).fill = bg_card
            ws_dash.cell(row=r, column=c).border = card_border
    ws_dash.merge_cells("B6:C8")
    ws_dash["B6"] = "Tempatkan Slicer:\n1. Segment\n2. Country\n3. YearMonth"
    ws_dash["B6"].font = font_sub
    ws_dash["B6"].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Tabel Ringkasan Profil Segmen & Heatmap RFM di Dashboard (E9:P14)
    ws_dash.merge_cells("E9:P9")
    ws_dash["E9"] = "RFM SEGMENT PROFILE & SCORE HEATMAP (K-MEANS K=4)"
    ws_dash["E9"].font = font_sec_hdr
    ws_dash["E9"].fill = bg_header_indigo

    headers = [
        ("E", "Segment"),
        ("F", "Customers"),
        ("G", "% Cust"),
        ("H", "Avg Recency"),
        ("I", "Avg Freq"),
        ("J", "Avg Monetary"),
        ("K", "Total Revenue"),
        ("L", "% Revenue"),
        ("M", "Cum % Rev"),
        ("N", "Avg R_Score"),
        ("O", "Avg F_Score"),
        ("P", "Avg M_Score"),
    ]
    # Lebarkan kolom H dan L di tabel agar muat
    ws_dash.column_dimensions["H"].width = 13
    ws_dash.column_dimensions["L"].width = 13
    ws_dash.column_dimensions["M"].width = 13

    for col_let, text in headers:
        cell = ws_dash[f"{col_let}10"]
        cell.value = text
        cell.font = font_tbl_hdr
        cell.fill = bg_card
        cell.border = card_border
        cell.alignment = Alignment(horizontal="center", vertical="center")

    for idx in range(len(profile_df)):
        r_excel = 11 + idx
        r_prof = 2 + idx
        ws_dash[f"E{r_excel}"] = f"=Cluster_Profile!B{r_prof}"
        ws_dash[f"F{r_excel}"] = f"=Cluster_Profile!C{r_prof}"
        ws_dash[f"F{r_excel}"].number_format = "#,##0"
        ws_dash[f"G{r_excel}"] = f"=Cluster_Profile!K{r_prof}/100"
        ws_dash[f"G{r_excel}"].number_format = "0.0%"
        ws_dash[f"H{r_excel}"] = f"=Cluster_Profile!D{r_prof}"
        ws_dash[f"H{r_excel}"].number_format = "0.0"
        ws_dash[f"I{r_excel}"] = f"=Cluster_Profile!E{r_prof}"
        ws_dash[f"I{r_excel}"].number_format = "0.00"
        ws_dash[f"J{r_excel}"] = f"=Cluster_Profile!F{r_prof}"
        ws_dash[f"J{r_excel}"].number_format = "£#,##0"
        ws_dash[f"K{r_excel}"] = f"=Cluster_Profile!G{r_prof}"
        ws_dash[f"K{r_excel}"].number_format = "£#,##0"
        ws_dash[f"L{r_excel}"] = f"=Cluster_Profile!L{r_prof}/100"
        ws_dash[f"L{r_excel}"].number_format = "0.0%"
        ws_dash[f"M{r_excel}"] = f"=Cluster_Profile!M{r_prof}/100"
        ws_dash[f"M{r_excel}"].number_format = "0.0%"
        ws_dash[f"N{r_excel}"] = f"=Cluster_Profile!H{r_prof}"
        ws_dash[f"N{r_excel}"].number_format = "0.00"
        ws_dash[f"O{r_excel}"] = f"=Cluster_Profile!I{r_prof}"
        ws_dash[f"O{r_excel}"].number_format = "0.00"
        ws_dash[f"P{r_excel}"] = f"=Cluster_Profile!J{r_prof}"
        ws_dash[f"P{r_excel}"].number_format = "0.00"

        for col_let, _ in headers:
            c_cell = ws_dash[f"{col_let}{r_excel}"]
            c_cell.font = font_tbl_val
            c_cell.fill = bg_card
            c_cell.border = card_border
            if col_let != "E":
                c_cell.alignment = Alignment(horizontal="right", vertical="center")

    # Conditional Formatting Heatmap pada Avg R_Score, Avg F_Score, Avg M_Score (N11:P14)
    heatmap_rule = ColorScaleRule(
        start_type="num", start_value=1.5, start_color="1E293B",
        mid_type="num", mid_value=3.2, mid_color="4F46E5",
        end_type="num", end_value=4.9, end_color="A855F7"
    )
    ws_dash.conditional_formatting.add("N11:P14", heatmap_rule)

    # Tambahkan Chart Native OpenPyXL di Dashboard (Baris 16-39)
    # Chart 1: Jumlah Customer per Segmen
    chart_cust = BarChart()
    chart_cust.type = "col"
    chart_cust.style = 10
    chart_cust.title = "Customers per Segment"
    chart_cust.y_axis.title = "Customers"
    data_ref = Reference(ws_prof, min_col=3, min_row=1, max_row=5)
    cats_ref = Reference(ws_prof, min_col=2, min_row=2, max_row=5)
    chart_cust.add_data(data_ref, titles_from_data=True)
    chart_cust.set_categories(cats_ref)
    chart_cust.legend = None
    chart_cust.width = 14
    chart_cust.height = 10
    ws_dash.add_chart(chart_cust, "E16")

    # Chart 2: Revenue per Segmen
    chart_rev = BarChart()
    chart_rev.type = "col"
    chart_rev.style = 11
    chart_rev.title = "Revenue Contribution per Segment (£)"
    chart_rev.y_axis.title = "Revenue (£)"
    rev_ref = Reference(ws_prof, min_col=7, min_row=1, max_row=5)
    chart_rev.add_data(rev_ref, titles_from_data=True)
    chart_rev.set_categories(cats_ref)
    chart_rev.legend = None
    chart_rev.width = 14
    chart_rev.height = 10
    ws_dash.add_chart(chart_rev, "N16")

    # Chart 3: Tren Bulanan Customer Baru vs Repeat
    chart_line = LineChart()
    chart_line.style = 12
    chart_line.title = "Monthly Trend: New vs Repeat Customers"
    chart_line.y_axis.title = "Customers"
    chart_line.x_axis.title = "Year-Month"
    m_data = Reference(ws_mon, min_col=2, min_row=1, max_col=3, max_row=len(monthly_df) + 1)
    m_cats = Reference(ws_mon, min_col=1, min_row=2, max_row=len(monthly_df) + 1)
    chart_line.add_data(m_data, titles_from_data=True)
    chart_line.set_categories(m_cats)
    chart_line.width = 28
    chart_line.height = 9
    ws_dash.add_chart(chart_line, "E30")

    # 2 Area Kosong Wajib untuk Diisi Mahasiswa: KEY INSIGHTS & RECOMMENDATIONS (Baris 43-51)
    # Area 1: KEY INSIGHTS (E43:N51)
    ws_dash.merge_cells("E43:N43")
    ws_dash["E43"] = "KEY INSIGHTS (Silakan Isi Berdasarkan Hasil Analisis)"
    ws_dash["E43"].font = font_sec_hdr
    ws_dash["E43"].fill = bg_header_indigo
    ws_dash["E43"].alignment = Alignment(horizontal="left", vertical="center")

    ws_dash.merge_cells("E44:N51")
    ws_dash["E44"] = ""  # Sengaja dikosongkan sesuai instruksi user
    ws_dash["E44"].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
    ws_dash["E44"].font = font_tbl_val
    for r in range(44, 52):
        for c in range(5, 15):
            ws_dash.cell(row=r, column=c).fill = bg_card
            ws_dash.cell(row=r, column=c).border = card_border

    # Area 2: RECOMMENDATIONS (P43:Y51)
    ws_dash.merge_cells("P43:Y43")
    ws_dash["P43"] = "RECOMMENDATIONS (Silakan Isi Strategi Retensi Tiap Segmen)"
    ws_dash["P43"].font = font_sec_hdr
    ws_dash["P43"].fill = bg_header_purple
    ws_dash["P43"].alignment = Alignment(horizontal="left", vertical="center")

    ws_dash.merge_cells("P44:Y51")
    ws_dash["P44"] = ""  # Sengaja dikosongkan sesuai instruksi user
    ws_dash["P44"].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
    ws_dash["P44"].font = font_tbl_val
    for r in range(44, 52):
        for c in range(16, 26):
            ws_dash.cell(row=r, column=c).fill = bg_card
            ws_dash.cell(row=r, column=c).border = card_border

    wb.save(excel_path)


# Jalankan Tahap 5: Generate Excel Report
SEGMENT_MAP = {
    0: "Champions",
    1: "At Risk",
    2: "Potential Loyalists",
    3: "Hibernating",
}

rfm_df, prof_df, mon_df = generate_rfm_report(
    csv_path="data/clean/retail_clean.csv",
    output_excel_path="reports/rfm_segmentation.xlsx",
    n_clusters=4,
    segment_map=SEGMENT_MAP,
)
print("Tahap 5 selesai: reports/rfm_segmentation.xlsx berhasil dibuat.")

# ==========================================================
# TAHAP 4: VISUALISASI & SIMPAN PNG KE reports/
# ==========================================================
plt.style.use("dark_background")
PALETTE = ["#6366F1", "#F59E0B", "#38BDF8", "#64748B"]

# 1. Chart Jumlah Customer per Segmen
fig, ax = plt.subplots(figsize=(9, 5.5), facecolor="#0F172A")
ax.set_facecolor("#1E293B")
bars = ax.bar(prof_df["Segment"], prof_df["Customer_Count"], color=PALETTE, width=0.55, edgecolor="#334155")
ax.set_title("Jumlah Customer per Segmen RFM (K=4)", fontsize=14, fontweight="bold", pad=15, color="#F8FAFC")
ax.set_ylabel("Jumlah Customer", fontsize=11, color="#94A3B8")
ax.set_ylim(0, prof_df["Customer_Count"].max() * 1.18)
ax.grid(axis="y", color="#334155", linestyle="--", alpha=0.5)
for bar, pct in zip(bars, prof_df["Customer_Share_Pct"]):
    yval = bar.get_height()
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        yval + 40,
        f"{int(yval):,}\n({pct:.2f}%)",
        ha="center",
        va="bottom",
        fontsize=10,
        fontweight="bold",
        color="#F8FAFC",
    )
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig("reports/customers_per_segment.png", dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 2. Chart Kontribusi Revenue per Segmen & Kurva Kumulatif Pareto
rfm_sorted = rfm_df.sort_values(by="Monetary", ascending=False).reset_index(drop=True)
rfm_sorted["Cum_Cust_Pct"] = (rfm_sorted.index + 1) / len(rfm_sorted) * 100
rfm_sorted["Cum_Rev_Pct"] = rfm_sorted["Monetary"].cumsum() / rfm_sorted["Monetary"].sum() * 100
pct_cust_80 = rfm_sorted.loc[rfm_sorted["Cum_Rev_Pct"] >= 80, "Cum_Cust_Pct"].iloc[0]

fig, ax = plt.subplots(1, 2, figsize=(14, 5.5), facecolor="#0F172A")
for a in ax:
    a.set_facecolor("#1E293B")
    a.spines[["top", "right"]].set_visible(False)
    a.grid(True, color="#334155", linestyle="--", alpha=0.5)

bars_rev = ax[0].bar(prof_df["Segment"], prof_df["Total_Revenue"] / 1e6, color=PALETTE, width=0.55)
ax[0].set_title("Kontribusi Revenue per Segmen (£ Juta)", fontsize=13, fontweight="bold", pad=12)
ax[0].set_ylabel("Total Revenue (£ Millions)", color="#94A3B8")
ax[0].set_ylim(0, (prof_df["Total_Revenue"].max() / 1e6) * 1.2)
for bar, rev, pct in zip(bars_rev, prof_df["Total_Revenue"], prof_df["Revenue_Share_Pct"]):
    yval = bar.get_height()
    ax[0].text(
        bar.get_x() + bar.get_width() / 2,
        yval + 0.3,
        f"£{rev/1e6:.2f}M\n({pct:.2f}%)",
        ha="center",
        va="bottom",
        fontsize=9.5,
        fontweight="bold",
        color="#F8FAFC",
    )

ax[1].plot(rfm_sorted["Cum_Cust_Pct"], rfm_sorted["Cum_Rev_Pct"], color="#8B5CF6", linewidth=2.8, label="Kurva Kumulatif Revenue")
ax[1].axhline(80, color="#EF4444", linestyle="--", linewidth=1.5, label="80% Total Revenue")
ax[1].axvline(pct_cust_80, color="#38BDF8", linestyle="--", linewidth=1.5, label=f"{pct_cust_80:.2f}% Customer (1,354 Cust)")
ax[1].scatter([pct_cust_80], [80], color="#F59E0B", s=70, zorder=5)
ax[1].set_title("Kurva Konsentrasi Revenue (Pareto Analysis)", fontsize=13, fontweight="bold", pad=12)
ax[1].set_xlabel("% Kumulatif Customer", color="#94A3B8")
ax[1].set_ylabel("% Kumulatif Revenue", color="#94A3B8")
ax[1].legend(loc="lower right", frameon=True, facecolor="#0F172A", edgecolor="#334155")

plt.tight_layout()
plt.savefig("reports/revenue_contribution_pareto.png", dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 3. Scatter Plot Frequency vs Monetary per Segmen (Log Scale)
fig, ax = plt.subplots(figsize=(9.5, 6), facecolor="#0F172A")
ax.set_facecolor("#1E293B")
for idx, seg in enumerate(prof_df["Segment"]):
    sub = rfm_df[rfm_df["Segment"] == seg]
    ax.scatter(
        sub["Frequency"],
        sub["Monetary"],
        label=f"{seg} (n={len(sub):,})",
        alpha=0.65,
        s=32,
        color=PALETTE[idx],
        edgecolors="none",
    )
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_title("Scatter Plot: Frequency vs Monetary per Segmen (Log Scale)", fontsize=14, fontweight="bold", pad=14)
ax.set_xlabel("Frequency (Jumlah Invoice Unik - Skala Log)", color="#94A3B8")
ax.set_ylabel("Monetary (Total Belanja £ - Skala Log)", color="#94A3B8")
ax.grid(True, which="both", color="#334155", linestyle="--", alpha=0.4)
ax.legend(title="Segmen RFM", frameon=True, facecolor="#0F172A", edgecolor="#334155")
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig("reports/scatter_frequency_vs_monetary.png", dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 4. Line Chart Tren Customer Baru vs Repeat per Bulan
fig, ax = plt.subplots(figsize=(12.5, 5.5), facecolor="#0F172A")
ax.set_facecolor("#1E293B")
ax.plot(mon_df["YearMonth"], mon_df["New_Customers"], marker="o", linewidth=2.4, color="#38BDF8", label="New Customers")
ax.plot(mon_df["YearMonth"], mon_df["Repeat_Customers"], marker="s", linewidth=2.4, color="#8B5CF6", label="Repeat Customers")
ax.set_title("Tren Bulanan Customer Baru vs Repeat (Des 2009 – Des 2011)", fontsize=14, fontweight="bold", pad=14)
ax.set_xlabel("Bulan Transaksi (Year-Month)", color="#94A3B8")
ax.set_ylabel("Jumlah Customer Aktif", color="#94A3B8")
ax.grid(True, color="#334155", linestyle="--", alpha=0.5)
plt.xticks(rotation=45, ha="right")
ax.legend(frameon=True, facecolor="#0F172A", edgecolor="#334155")
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig("reports/monthly_new_vs_repeat_trend.png", dpi=300, facecolor=fig.get_facecolor())
plt.close()

print("Tahap 4 selesai: 5 visualisasi PNG telah disimpan di folder reports/.")

