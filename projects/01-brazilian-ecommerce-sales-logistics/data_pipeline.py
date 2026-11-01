"""
================================================================================
BRAZILIAN E-COMMERCE (OLIST) - DATA PIPELINE & LAPORAN OTOMATIS
================================================================================
Target Tool : Kaggle Notebook / Lokal VS Code  ->  Tableau Dashboard
Output      : ecommerce_master_clean.csv          (sumber data Tableau)
              output/laporan_penjualan.xlsx       (laporan Excel otomatis)
              output/laporan_penjualan.pdf        (laporan PDF otomatis)
              output/charts/*.png                 (grafik line / bar / pie)

Alur kerja (mengikuti 4 tugas utama Data Analyst dengan Python):
  TAHAP 1. AMBIL & BERSIHIN DATA
           - Baca CSV
           - Hapus data kosong & duplikat
           - Rapihin format (tanggal, teks kategori, nama wilayah)
  TAHAP 2. ANALISIS DATA
           - Hitung rata-rata (AOV, review, durasi kirim)
           - Cari tren (revenue bulanan + pertumbuhan MoM)
           - Bandingin data (kategori, wilayah, tepat waktu vs terlambat)
  TAHAP 3. VISUALISASI DATA (Matplotlib / Seaborn)
           - Grafik line, bar chart, pie chart
  TAHAP 4. OTOMATISASI LAPORAN
           - Export ke Excel & PDF + CSV untuk Tableau
           - Bisa dijadwalkan harian (lihat run_daily_report.bat)

Cara pakai:  python data_pipeline.py
================================================================================
"""

import os
import sys
import sqlite3
from datetime import datetime

import numpy as np
import pandas as pd
import matplotlib

matplotlib.use("Agg")  # render grafik tanpa membuka jendela (aman untuk jadwal otomatis)
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.backends.backend_pdf import PdfPages

# Konsol Windows default-nya cp1252 -> paksa UTF-8 agar simbol ✓ / • tidak error
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# ==============================================================================
# KONFIGURASI
# ==============================================================================
# Periode analisis: data 2016 & Sep-Okt 2018 hanya berisi segelintir order
# (1-324 order/bulan vs ribuan di bulan normal) sehingga akan merusak tren.
PERIOD_START = "2017-01-01"
PERIOD_END = "2018-08-31 23:59:59"

OUTPUT_DIR = "output"
CHART_DIR = os.path.join(OUTPUT_DIR, "charts")
MASTER_CSV = "ecommerce_master_clean.csv"

# Nama lengkap state Brasil -> supaya Tableau bisa otomatis memetakan (geocoding)
BRAZIL_STATES = {
    "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas", "BA": "Bahia",
    "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo", "GO": "Goiás",
    "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná",
    "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte", "RS": "Rio Grande do Sul", "RO": "Rondônia",
    "RR": "Roraima", "SC": "Santa Catarina", "SP": "São Paulo", "SE": "Sergipe",
    "TO": "Tocantins",
}

RAW_FILES = {
    "orders": "olist_orders_dataset.csv",
    "order_items": "olist_order_items_dataset.csv",
    "customers": "olist_customers_dataset.csv",
    "payments": "olist_order_payments_dataset.csv",
    "reviews": "olist_order_reviews_dataset.csv",
    "products": "olist_products_dataset.csv",
    "sellers": "olist_sellers_dataset.csv",
    "translation": "product_category_name_translation.csv",
}


def get_data_directory():
    """Mendeteksi direktori dataset secara otomatis baik di Kaggle maupun lokal."""
    for path in ["/kaggle/input/brazilian-ecommerce", "../input/brazilian-ecommerce",
                 "/kaggle/input/olist-ecommerce", "../input/olist-ecommerce"]:
        if os.path.exists(path):
            print(f"[*] Environment Kaggle terdeteksi: '{path}'")
            return path
    print("[*] Environment Lokal terdeteksi (Current Working Directory)")
    return "."


def get_output_root():
    """Di Kaggle hasil harus disimpan di /kaggle/working."""
    return "/kaggle/working" if os.path.exists("/kaggle/working") else "."


# ==============================================================================
# TAHAP 1. AMBIL & BERSIHIN DATA
# ==============================================================================
def load_raw_data(data_dir):
    """1a. Baca semua file CSV."""
    print("\n[TAHAP 1] AMBIL & BERSIHIN DATA")
    print("  1a. Membaca file CSV...")
    data = {}
    for key, filename in RAW_FILES.items():
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            filepath = filename
        data[key] = pd.read_csv(filepath)
        print(f"      ✓ {filename:<40}: {data[key].shape[0]:>7,} baris")
    return data


def missing_value_report(data):
    """Ringkasan jumlah data kosong (null) per kolom untuk setiap tabel."""
    rows = []
    for name, df in data.items():
        for col, n in df.isnull().sum().items():
            if n > 0:
                rows.append({"tabel": name, "kolom": col, "jumlah_kosong": int(n),
                             "persen": round(n / len(df) * 100, 2)})
    return pd.DataFrame(rows, columns=["tabel", "kolom", "jumlah_kosong", "persen"])


def clean_tables(data):
    """
    1b. Hapus data kosong & duplikat, 1c. rapihin format.

    Keputusan cleaning (penting dipahami):
    - Hanya order berstatus 'delivered' yang dihitung sebagai penjualan
      (canceled/unavailable/processing belum/tidak menghasilkan revenue).
    - Order delivered tanpa tanggal terima DIHAPUS karena metrik pengiriman
      tidak bisa dihitung.
    - Kategori produk kosong TIDAK dihapus (revenue-nya tetap nyata),
      tapi diisi 'Unknown' supaya tetap terhitung.
    - Kolom komentar review yang kosong diabaikan (tidak dipakai).
    """
    print("  1b. Menghapus duplikat & data kosong...")
    log = []

    # Hapus baris duplikat persis di semua tabel
    for name in data:
        before = len(data[name])
        data[name] = data[name].drop_duplicates()
        if before != len(data[name]):
            log.append(f"{name}: {before - len(data[name]):,} duplikat dihapus")

    # --- Orders: rapihin format tanggal ---
    orders = data["orders"].copy()
    for col in ["order_purchase_timestamp", "order_approved_at",
                "order_delivered_carrier_date", "order_delivered_customer_date",
                "order_estimated_delivery_date"]:
        orders[col] = pd.to_datetime(orders[col], errors="coerce")

    n0 = len(orders)
    orders = orders[orders["order_status"] == "delivered"]
    log.append(f"orders: {n0 - len(orders):,} order non-delivered dihapus")

    n1 = len(orders)
    orders = orders.dropna(subset=["order_delivered_customer_date",
                                   "order_estimated_delivery_date"])
    log.append(f"orders: {n1 - len(orders):,} order tanpa tanggal terima dihapus")

    n2 = len(orders)
    orders = orders[orders["order_delivered_customer_date"] >= orders["order_purchase_timestamp"]]
    log.append(f"orders: {n2 - len(orders):,} order dengan tanggal tidak logis dihapus")

    n3 = len(orders)
    orders = orders[orders["order_purchase_timestamp"].between(PERIOD_START, PERIOD_END)]
    log.append(f"orders: {n3 - len(orders):,} order di luar periode "
               f"{PERIOD_START[:7]} s/d {PERIOD_END[:7]} dihapus")

    # --- Products: kategori kosong & terjemahan ---
    print("  1c. Merapikan format data...")
    products = data["products"].merge(data["translation"], on="product_category_name", how="left")
    products["product_category"] = (
        products["product_category_name_english"]
        .fillna(products["product_category_name"])  # kategori tanpa terjemahan -> nama asli
        .fillna("unknown")                           # kategori kosong -> 'unknown'
        .str.replace("_", " ").str.strip().str.title()
    )
    log.append(f"products: {data['products']['product_category_name'].isnull().sum():,} "
               f"kategori kosong diisi 'Unknown'")

    # --- Customers & Sellers: rapihin teks wilayah ---
    customers = data["customers"].copy()
    customers["customer_city"] = customers["customer_city"].str.strip().str.title()
    customers["customer_state"] = customers["customer_state"].str.strip().str.upper()
    customers["customer_state_name"] = customers["customer_state"].map(BRAZIL_STATES)
    sellers = data["sellers"].copy()
    sellers["seller_state"] = sellers["seller_state"].str.strip().str.upper()

    # --- Payments: 1 baris per order (anti duplikasi saat JOIN) ---
    pay = data["payments"].sort_values(["order_id", "payment_value"], ascending=[True, False])
    primary = pay.groupby("order_id").first().reset_index()[
        ["order_id", "payment_type", "payment_installments"]]
    total = pay.groupby("order_id")["payment_value"].sum().reset_index()
    payments = primary.merge(total, on="order_id", how="left")
    payments["payment_type"] = payments["payment_type"].str.replace("_", " ").str.title()

    # --- Reviews: 1 baris per order (rata-rata jika ada >1 review) ---
    reviews = data["reviews"].groupby("order_id", as_index=False)["review_score"].mean()
    reviews["review_score"] = reviews["review_score"].round(1)

    for line in log:
        print(f"      - {line}")

    return {
        "orders": orders, "order_items": data["order_items"], "customers": customers,
        "products": products, "sellers": sellers, "payments": payments, "reviews": reviews,
    }, log


def join_tables(t):
    """1d. Gabungkan 7 tabel dengan SQL JOIN (SQLite in-memory)."""
    print("  1d. Menggabungkan tabel dengan SQL JOIN...")
    conn = sqlite3.connect(":memory:")
    for name, df in t.items():
        df.to_sql(name, conn, index=False)

    query = """
    SELECT
        o.order_id,
        c.customer_unique_id,
        o.order_purchase_timestamp,
        strftime('%Y-%m-01', o.order_purchase_timestamp) AS order_purchase_month,
        o.order_delivered_customer_date,
        o.order_estimated_delivery_date,
        c.customer_city,
        c.customer_state,
        c.customer_state_name,
        oi.order_item_id,
        oi.product_id,
        p.product_category,
        oi.price,
        oi.freight_value,
        (oi.price + oi.freight_value) AS item_total_revenue,
        oi.seller_id,
        s.seller_state,
        COALESCE(pm.payment_type, 'Not Defined') AS payment_type,
        COALESCE(pm.payment_installments, 1)     AS payment_installments,
        r.review_score
    FROM orders o
    JOIN customers c        ON o.customer_id = c.customer_id
    JOIN order_items oi     ON o.order_id    = oi.order_id
    LEFT JOIN products p    ON oi.product_id = p.product_id
    LEFT JOIN sellers s     ON oi.seller_id  = s.seller_id
    LEFT JOIN payments pm   ON o.order_id    = pm.order_id
    LEFT JOIN reviews r     ON o.order_id    = r.order_id
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    print(f"      ✓ Hasil JOIN: {len(df):,} baris (1 baris = 1 item dalam order)")
    return df


def add_delivery_features(df):
    """1e. Tambah kolom turunan: durasi kirim, keterlambatan, status pengiriman."""
    for col in ["order_purchase_timestamp", "order_delivered_customer_date",
                "order_estimated_delivery_date", "order_purchase_month"]:
        df[col] = pd.to_datetime(df[col])

    day = pd.Timedelta(days=1)
    df["actual_delivery_days"] = ((df["order_delivered_customer_date"] - df["order_purchase_timestamp"]) / day).round(1)
    df["estimated_delivery_days"] = ((df["order_estimated_delivery_date"] - df["order_purchase_timestamp"]) / day).round(1)
    df["delivery_delay_days"] = ((df["order_delivered_customer_date"] - df["order_estimated_delivery_date"]) / day).round(1)

    df["delivery_status"] = np.where(df["delivery_delay_days"] > 0, "Late Delivery", "On-Time")
    df["delay_bucket"] = pd.cut(
        df["delivery_delay_days"],
        bins=[-np.inf, 0, 3, 7, 14, np.inf],
        labels=["On-Time", "1-3 hari", "4-7 hari", "8-14 hari", ">14 hari"],
    ).astype(str)
    return df


# ==============================================================================
# TAHAP 2. ANALISIS DATA
# ==============================================================================
def to_order_level(df):
    """
    Master data berlevel ITEM. Untuk metrik per-order (review, AOV, delay)
    data harus diringkas ke level ORDER agar order dengan banyak item
    tidak dihitung berkali-kali.
    """
    return df.groupby("order_id").agg(
        order_month=("order_purchase_month", "first"),
        customer_state=("customer_state", "first"),
        revenue=("item_total_revenue", "sum"),
        items=("order_item_id", "count"),
        review_score=("review_score", "first"),
        actual_delivery_days=("actual_delivery_days", "first"),
        delivery_delay_days=("delivery_delay_days", "first"),
        delivery_status=("delivery_status", "first"),
        delay_bucket=("delay_bucket", "first"),
        payment_type=("payment_type", "first"),
    ).reset_index()


def analyze(df):
    print("\n[TAHAP 2] ANALISIS DATA")
    orders = to_order_level(df)
    res = {}

    # 2a. Hitung rata-rata
    res["kpi"] = pd.DataFrame([
        ("Total Revenue (R$)", round(df["item_total_revenue"].sum(), 2)),
        ("Total Order", orders["order_id"].nunique()),
        ("Total Pelanggan Unik", df["customer_unique_id"].nunique()),
        ("Average Order Value / AOV (R$)", round(orders["revenue"].mean(), 2)),
        ("Rata-rata Item per Order", round(orders["items"].mean(), 2)),
        ("Rata-rata Review Score (1-5)", round(orders["review_score"].mean(), 2)),
        ("Rata-rata Durasi Pengiriman (hari)", round(orders["actual_delivery_days"].mean(), 1)),
        ("Persentase Order Terlambat (%)", round((orders["delivery_status"] == "Late Delivery").mean() * 100, 2)),
    ], columns=["Metrik", "Nilai"], dtype=object)
    print("  2a. Rata-rata:")
    for _, r in res["kpi"].iterrows():
        print(f"      • {r['Metrik']:<38}: {r['Nilai']:,}")

    # 2b. Cari tren bulanan
    trend = orders.groupby("order_month").agg(
        revenue=("revenue", "sum"), total_order=("order_id", "count"),
        avg_review=("review_score", "mean")).reset_index()
    trend["mom_growth_pct"] = (trend["revenue"].pct_change() * 100).round(1)
    trend["revenue"] = trend["revenue"].round(2)
    trend["avg_review"] = trend["avg_review"].round(2)
    trend["order_month"] = trend["order_month"].dt.strftime("%Y-%m")
    res["trend"] = trend
    best = trend.loc[trend["revenue"].idxmax()]
    print(f"  2b. Tren: bulan revenue tertinggi = {best['order_month']} (R$ {best['revenue']:,.0f})")

    # 2c. Bandingin data
    res["category"] = (df.groupby("product_category")
                       .agg(revenue=("item_total_revenue", "sum"), items_sold=("order_item_id", "count"))
                       .sort_values("revenue", ascending=False).round(2).reset_index())
    res["state"] = (orders.groupby("customer_state")
                    .agg(revenue=("revenue", "sum"), total_order=("order_id", "count"),
                         avg_delivery_days=("actual_delivery_days", "mean"))
                    .sort_values("revenue", ascending=False).round(2).reset_index())
    bucket_order = ["On-Time", "1-3 hari", "4-7 hari", "8-14 hari", ">14 hari"]
    res["delay_vs_review"] = (orders.groupby("delay_bucket")
                              .agg(total_order=("order_id", "count"), avg_review=("review_score", "mean"))
                              .reindex(bucket_order).round(2).reset_index())
    res["payment"] = (orders["payment_type"].value_counts().rename_axis("payment_type")
                      .reset_index(name="total_order"))
    res["payment"]["share_pct"] = (res["payment"]["total_order"] / len(orders) * 100).round(2)

    on_time = res["delay_vs_review"].iloc[0]["avg_review"]
    worst = res["delay_vs_review"].iloc[-1]["avg_review"]
    print(f"  2c. Bandingin: review On-Time = {on_time} vs terlambat >14 hari = {worst}")
    print(f"      Top kategori: {res['category'].iloc[0]['product_category']} | "
          f"Top state: {res['state'].iloc[0]['customer_state']}")
    return res


# ==============================================================================
# TAHAP 3. VISUALISASI DATA (Matplotlib / Seaborn)
# ==============================================================================
def visualize(res):
    print("\n[TAHAP 3] VISUALISASI DATA")
    os.makedirs(CHART_DIR, exist_ok=True)
    sns.set_theme(style="whitegrid", palette="viridis")
    figs = {}

    # 3a. Grafik LINE - tren revenue bulanan
    fig, ax = plt.subplots(figsize=(11, 5))
    t = res["trend"]
    sns.lineplot(data=t, x="order_month", y="revenue", marker="o", color="#2a9d8f", ax=ax)
    ax.set_title("Tren Revenue Bulanan (R$)", fontsize=14, weight="bold")
    ax.set_xlabel("Bulan"); ax.set_ylabel("Revenue (R$)")
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v/1e3:,.0f}K"))
    ax.tick_params(axis="x", rotation=45)
    fig.tight_layout(); figs["1_line_tren_revenue"] = fig

    # 3b. BAR chart - top 10 kategori
    fig, ax = plt.subplots(figsize=(11, 5.5))
    top = res["category"].head(10)
    sns.barplot(data=top, y="product_category", x="revenue", hue="product_category",
                palette="viridis", legend=False, ax=ax)
    ax.set_title("Top 10 Kategori Produk berdasarkan Revenue", fontsize=14, weight="bold")
    ax.set_xlabel("Revenue (R$)"); ax.set_ylabel("")
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v/1e3:,.0f}K"))
    fig.tight_layout(); figs["2_bar_top_kategori"] = fig

    # 3c. BAR chart - keterlambatan vs review
    fig, ax = plt.subplots(figsize=(10, 5))
    d = res["delay_vs_review"]
    sns.barplot(data=d, x="delay_bucket", y="avg_review", hue="delay_bucket",
                palette="RdYlGn_r", legend=False, ax=ax)
    for i, v in enumerate(d["avg_review"]):
        ax.text(i, v + 0.05, f"{v:.2f}", ha="center", weight="bold")
    ax.set_ylim(0, 5)
    ax.set_title("Rata-rata Review Score berdasarkan Keterlambatan", fontsize=14, weight="bold")
    ax.set_xlabel("Keterlambatan dari estimasi"); ax.set_ylabel("Rata-rata Review (1-5)")
    fig.tight_layout(); figs["3_bar_delay_vs_review"] = fig

    # 3d. PIE chart - metode pembayaran
    fig, ax = plt.subplots(figsize=(7, 7))
    p = res["payment"]
    main = p[p["share_pct"] >= 1]
    others = p[p["share_pct"] < 1]["total_order"].sum()
    labels = list(main["payment_type"]) + (["Lainnya"] if others else [])
    values = list(main["total_order"]) + ([others] if others else [])
    total = sum(values)
    ax.pie(values, autopct=lambda pct: f"{pct:.1f}%" if pct >= 3 else "", startangle=90,
           pctdistance=0.75, colors=sns.color_palette("viridis", len(values)),
           textprops={"color": "white", "weight": "bold", "fontsize": 12},
           wedgeprops={"edgecolor": "white", "linewidth": 2})
    ax.legend([f"{l} ({v / total * 100:.1f}%)" for l, v in zip(labels, values)],
              loc="center left", bbox_to_anchor=(1, 0.5), frameon=False)
    ax.set_title("Proporsi Metode Pembayaran (per Order)", fontsize=14, weight="bold")
    fig.tight_layout(); figs["4_pie_payment"] = fig

    for name, fig in figs.items():
        path = os.path.join(CHART_DIR, f"{name}.png")
        fig.savefig(path, dpi=120)
        print(f"      ✓ {path}")
    return figs


# ==============================================================================
# TAHAP 4. OTOMATISASI LAPORAN (Excel / PDF / CSV Tableau)
# ==============================================================================
def export_reports(master, res, figs, missing_before, cleaning_log):
    print("\n[TAHAP 4] OTOMATISASI LAPORAN")
    run_time = datetime.now().strftime("%Y-%m-%d %H:%M")

    # 4a. CSV master untuk Tableau
    out = master.copy()
    for col in ["order_purchase_timestamp", "order_delivered_customer_date", "order_estimated_delivery_date"]:
        out[col] = out[col].dt.strftime("%Y-%m-%d %H:%M:%S")
    out["order_purchase_month"] = out["order_purchase_month"].dt.strftime("%Y-%m-%d")
    csv_path = os.path.join(get_output_root(), MASTER_CSV)
    out.to_csv(csv_path, index=False, encoding="utf-8")
    print(f"      ✓ CSV Tableau : {csv_path}")

    # 4b. Excel multi-sheet
    xlsx_path = os.path.join(OUTPUT_DIR, "laporan_penjualan.xlsx")
    sheets = {
        "Ringkasan KPI": res["kpi"],
        "Tren Bulanan": res["trend"],
        "Kategori Produk": res["category"],
        "Wilayah (State)": res["state"],
        "Delay vs Review": res["delay_vs_review"],
        "Metode Bayar": res["payment"],
        "Data Kosong (Raw)": missing_before,
        "Log Cleaning": pd.DataFrame({"langkah": cleaning_log}),
    }
    with pd.ExcelWriter(xlsx_path, engine="openpyxl") as writer:
        for name, sdf in sheets.items():
            sdf.to_excel(writer, sheet_name=name, index=False)
            ws = writer.sheets[name]
            for col_cells in ws.columns:  # auto lebar kolom
                width = max(len(str(c.value)) if c.value is not None else 0 for c in col_cells)
                ws.column_dimensions[col_cells[0].column_letter].width = min(width + 2, 60)
        writer.sheets["Ringkasan KPI"].cell(row=len(res["kpi"]) + 3, column=1,
                                            value=f"Dibuat otomatis: {run_time}")
    print(f"      ✓ Excel      : {xlsx_path}")

    # 4c. PDF (halaman ringkasan + semua grafik)
    pdf_path = os.path.join(OUTPUT_DIR, "laporan_penjualan.pdf")
    with PdfPages(pdf_path) as pdf:
        cover, ax = plt.subplots(figsize=(11, 6)); ax.axis("off")
        ax.text(0.5, 0.92, "Laporan Penjualan Olist E-Commerce", ha="center",
                fontsize=20, weight="bold")
        ax.text(0.5, 0.84, f"Periode {PERIOD_START[:7]} s/d {PERIOD_END[:7]}  |  Dibuat: {run_time}",
                ha="center", fontsize=11, color="gray")
        for i, r in res["kpi"].iterrows():
            val = f"{r['Nilai']:,.2f}" if isinstance(r["Nilai"], float) else f"{r['Nilai']:,}"
            ax.text(0.2, 0.70 - i * 0.08, r["Metrik"], fontsize=12)
            ax.text(0.8, 0.70 - i * 0.08, val, fontsize=12, ha="right", weight="bold")
        pdf.savefig(cover); plt.close(cover)
        for fig in figs.values():
            pdf.savefig(fig); plt.close(fig)
    print(f"      ✓ PDF        : {pdf_path}")


# ==============================================================================
# MAIN
# ==============================================================================
def main():
    start = datetime.now()
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    raw = load_raw_data(get_data_directory())
    missing_before = missing_value_report(raw)
    tables, cleaning_log = clean_tables(raw)
    master = add_delivery_features(join_tables(tables))
    print(f"      ✓ Sisa data kosong di master: review_score = "
          f"{master['review_score'].isnull().sum():,} baris (order tanpa review, dibiarkan)")

    results = analyze(master)
    figs = visualize(results)
    export_reports(master, results, figs, missing_before, cleaning_log)

    print(f"\n✓ Selesai dalam {(datetime.now() - start).seconds} detik. Data siap dipakai di Tableau!")


if __name__ == "__main__":
    main()
