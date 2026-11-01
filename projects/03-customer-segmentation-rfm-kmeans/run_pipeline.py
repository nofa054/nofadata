import os
import sqlite3
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

warnings.filterwarnings("ignore")

# Buat seluruh direktori output
os.makedirs("data/clean", exist_ok=True)
os.makedirs("data/sql_exports", exist_ok=True)
os.makedirs("reports", exist_ok=True)

print("==========================================================")
print("TAHAP 1: AMBIL & BERSIHKAN DATA")
print("==========================================================")

FILE_PATH = "online_retail_II.csv"
df_raw = pd.read_csv(FILE_PATH)

print(f"Total baris awal: {len(df_raw):,}")
print("Nama kolom asli (df.columns):", df_raw.columns.tolist())
print("\nMissing values awal per kolom:")
print(df_raw.isnull().sum())

# Copy & standarisasi nama kolom
df = df_raw.copy()
df.columns = df.columns.str.strip()

audit_steps = []
n0 = len(df)
audit_steps.append(("0. Data Awal (Mentah)", n0, 0))

# Step 1: Hapus duplikat identik
df = df.drop_duplicates()
n1 = len(df)
audit_steps.append(("1. Hapus Duplikat Identik", n1, n0 - n1))

# Step 2: Hapus Customer ID kosong
df = df.dropna(subset=["Customer ID"])
n2 = len(df)
audit_steps.append(("2. Hapus Customer ID Kosong (NaN)", n2, n1 - n2))

# Step 3: Buang invoice batal (awalan 'C')
df["Invoice"] = df["Invoice"].astype(str).str.strip()
df = df[~df["Invoice"].str.upper().str.startswith("C")]
n3 = len(df)
audit_steps.append(("3. Buang Invoice Batal (Awalan 'C')", n3, n2 - n3))

# Step 4: Buang Quantity <= 0 atau Price <= 0
df = df[(df["Quantity"] > 0) & (df["Price"] > 0)]
n4 = len(df)
audit_steps.append(("4. Buang Quantity <= 0 atau Price <= 0", n4, n3 - n4))

# Step 5: Rapikan tipe data & rename Customer ID -> CustomerID
df["CustomerID"] = df["Customer ID"].astype(float).astype(int).astype(str)
df = df.drop(columns=["Customer ID"])
df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
df["Quantity"] = df["Quantity"].astype(int)
df["Price"] = df["Price"].astype(float)

# Step 6: Buat kolom Revenue
df["Revenue"] = (df["Quantity"] * df["Price"]).round(2)

# Urutkan kolom agar rapi
df = df[["Invoice", "StockCode", "Description", "Quantity", "InvoiceDate", "Price", "CustomerID", "Country", "Revenue"]]

audit_df = pd.DataFrame(audit_steps, columns=["Tahap", "Sisa_Baris", "Baris_Terbuang"])
audit_df["Pct_Terbuang_Dari_Awal"] = (audit_df["Baris_Terbuang"] / n0 * 100).round(2)
print("\n--- REKAP BARIS TERBUANG PER LANGKAH ---")
print(audit_df.to_string(index=False))
print(f"Total baris terbuang keseluruhan: {n0 - n4:,} ({(n0 - n4)/n0*100:.2f}%)")
print(f"Total baris bersih tersisa: {n4:,} ({n4/n0*100:.2f}%)")
print(f"Rentang tanggal transaksi bersih: {df['InvoiceDate'].min()} s.d. {df['InvoiceDate'].max()}")

clean_csv_path = "data/clean/retail_clean.csv"
df.to_csv(clean_csv_path, index=False)
audit_df.to_csv("reports/cleaning_audit_log.csv", index=False)
print(f"\nData bersih disimpan ke: {clean_csv_path}")

print("\n==========================================================")
print("TAHAP 2: SQL (SQLite + CTE Queries)")
print("==========================================================")

db_path = "data/retail.db"
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
df.to_sql("transactions", conn, if_exists="replace", index=False)

# Buat index untuk mempercepat query SQL
conn.execute("CREATE INDEX idx_cust ON transactions(CustomerID);")
conn.execute("CREATE INDEX idx_date ON transactions(InvoiceDate);")
conn.execute("CREATE INDEX idx_country ON transactions(Country);")

# Query 1: CTE Recency, Frequency, Monetary per Customer
query_rfm = """
WITH ref_date AS (
    SELECT DATE(MAX(InvoiceDate), '+1 day') AS snapshot_date
    FROM transactions
),
cust_country AS (
    SELECT
        CustomerID,
        Country,
        ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY COUNT(*) DESC) AS rn
    FROM transactions
    GROUP BY CustomerID, Country
),
rfm_calc AS (
    SELECT
        t.CustomerID,
        CAST(JULIANDAY((SELECT snapshot_date FROM ref_date)) - JULIANDAY(MAX(DATE(t.InvoiceDate))) AS INTEGER) AS Recency,
        COUNT(DISTINCT t.Invoice) AS Frequency,
        ROUND(SUM(t.Revenue), 2) AS Monetary
    FROM transactions t
    GROUP BY t.CustomerID
)
SELECT
    r.CustomerID,
    c.Country,
    r.Recency,
    r.Frequency,
    r.Monetary
FROM rfm_calc r
LEFT JOIN cust_country c
    ON r.CustomerID = c.CustomerID AND c.rn = 1
ORDER BY r.Monetary DESC;
"""

df_rfm_sql = pd.read_sql_query(query_rfm, conn)
df_rfm_sql.to_csv("data/sql_exports/rfm_per_customer.csv", index=False)
print(f"[SQL 1] RFM per Customer diekspor: {len(df_rfm_sql):,} unique customers.")
print(df_rfm_sql.head(5).to_string(index=False))

# Query 2: CTE Revenue per Negara
query_country = """
WITH country_agg AS (
    SELECT
        Country,
        COUNT(DISTINCT CustomerID) AS Total_Customers,
        COUNT(DISTINCT Invoice) AS Total_Orders,
        ROUND(SUM(Revenue), 2) AS Total_Revenue
    FROM transactions
    GROUP BY Country
)
SELECT
    Country,
    Total_Customers,
    Total_Orders,
    Total_Revenue,
    ROUND(Total_Revenue * 100.0 / SUM(Total_Revenue) OVER (), 2) AS Revenue_Share_Pct
FROM country_agg
ORDER BY Total_Revenue DESC;
"""

df_country_sql = pd.read_sql_query(query_country, conn)
df_country_sql.to_csv("data/sql_exports/revenue_by_country.csv", index=False)
print(f"\n[SQL 2] Revenue per Negara diekspor: {len(df_country_sql)} negara. Top 10:")
print(df_country_sql.head(10).to_string(index=False))

# Query 3: CTE Tren Customer Baru vs Repeat per Bulan
query_monthly = """
WITH first_purchase AS (
    SELECT
        CustomerID,
        STRFTIME('%Y-%m', MIN(InvoiceDate)) AS Cohort_Month
    FROM transactions
    GROUP BY CustomerID
),
monthly_tx AS (
    SELECT
        STRFTIME('%Y-%m', t.InvoiceDate) AS YearMonth,
        t.CustomerID,
        f.Cohort_Month,
        t.Invoice,
        t.Revenue
    FROM transactions t
    JOIN first_purchase f ON t.CustomerID = f.CustomerID
)
SELECT
    YearMonth,
    COUNT(DISTINCT CASE WHEN YearMonth = Cohort_Month THEN CustomerID END) AS New_Customers,
    COUNT(DISTINCT CASE WHEN YearMonth > Cohort_Month THEN CustomerID END) AS Repeat_Customers,
    COUNT(DISTINCT CustomerID) AS Total_Active_Customers,
    ROUND(SUM(CASE WHEN YearMonth = Cohort_Month THEN Revenue ELSE 0 END), 2) AS New_Revenue,
    ROUND(SUM(CASE WHEN YearMonth > Cohort_Month THEN Revenue ELSE 0 END), 2) AS Repeat_Revenue,
    ROUND(SUM(Revenue), 2) AS Total_Revenue
FROM monthly_tx
GROUP BY YearMonth
ORDER BY YearMonth;
"""

df_monthly_sql = pd.read_sql_query(query_monthly, conn)
df_monthly_sql.to_csv("data/sql_exports/monthly_new_vs_repeat.csv", index=False)
print(f"\n[SQL 3] Tren Bulanan Customer Baru vs Repeat diekspor ({len(df_monthly_sql)} bulan):")
print(df_monthly_sql.to_string(index=False))

conn.close()

print("\n==========================================================")
print("TAHAP 3: ANALISIS RFM, K-MEANS (ELBOW & SILHOUETTE) & PARETO")
print("==========================================================")

rfm = df_rfm_sql.copy()

# RFM Scoring 1-5
rfm["R_Score"] = pd.qcut(rfm["Recency"].rank(method="first"), q=5, labels=[5, 4, 3, 2, 1]).astype(int)
rfm["F_Score"] = pd.qcut(rfm["Frequency"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
rfm["M_Score"] = pd.qcut(rfm["Monetary"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
rfm["RFM_Score"] = rfm["R_Score"].astype(str) + rfm["F_Score"].astype(str) + rfm["M_Score"].astype(str)
rfm["RFM_Total"] = rfm["R_Score"] + rfm["F_Score"] + rfm["M_Score"]

# Log transform + StandardScaler untuk K-Means
rfm_log = np.log1p(rfm[["Recency", "Frequency", "Monetary"]])
scaler = StandardScaler()
X_scaled = scaler.fit_transform(rfm_log)

K_range = list(range(2, 9))
inertias = []
silhouettes = []

print("Evaluasi K-Means untuk K = 2 s.d. 8:")
for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    sil = silhouette_score(X_scaled, labels)
    silhouettes.append(sil)
    print(f"  K = {k} | Inertia = {km.inertia_:,.2f} | Silhouette Score = {sil:.4f}")

# Simpan grafik Elbow & Silhouette
plt.style.use("dark_background")
fig, ax = plt.subplots(1, 2, figsize=(13, 5), facecolor="#0F172A")
for a in ax:
    a.set_facecolor("#1E293B")
    a.spines[["top", "right"]].set_visible(False)
    a.grid(True, color="#334155", alpha=0.5, linestyle="--")

ax[0].plot(K_range, inertias, marker="o", linewidth=2.5, color="#38BDF8", markersize=7)
ax[0].set_title("Elbow Method (Inertia vs K)", fontsize=13, fontweight="bold", pad=12)
ax[0].set_xlabel("Jumlah Cluster (K)")
ax[0].set_ylabel("Inertia (Within-Cluster Sum of Squares)")

ax[1].plot(K_range, silhouettes, marker="s", linewidth=2.5, color="#8B5CF6", markersize=7)
ax[1].set_title("Silhouette Score vs K", fontsize=13, fontweight="bold", pad=12)
ax[1].set_xlabel("Jumlah Cluster (K)")
ax[1].set_ylabel("Silhouette Score")

plt.tight_layout()
plt.savefig("reports/elbow_silhouette_evaluation.png", dpi=300, facecolor=fig.get_facecolor())
plt.close()

# Tampilkan profil untuk K=4 (elbow bisnis standar) dan K=3 agar kita bisa lihat keduanya dengan jelas
for k_eval in [3, 4, 5]:
    km_temp = KMeans(n_clusters=k_eval, random_state=42, n_init=10)
    lbl = km_temp.fit_predict(X_scaled)
    rfm_temp = rfm.copy()
    rfm_temp["Cluster"] = lbl
    order = rfm_temp.groupby("Cluster")["Monetary"].mean().sort_values(ascending=False).index
    rfm_temp["Cluster"] = rfm_temp["Cluster"].map({old: new for new, old in enumerate(order)})
    prof = rfm_temp.groupby("Cluster").agg(
        Customer_Count=("CustomerID", "count"),
        Avg_Recency=("Recency", "mean"),
        Avg_Frequency=("Frequency", "mean"),
        Avg_Monetary=("Monetary", "mean"),
        Total_Revenue=("Monetary", "sum"),
        Avg_R_Score=("R_Score", "mean"),
        Avg_F_Score=("F_Score", "mean"),
        Avg_M_Score=("M_Score", "mean"),
    ).reset_index()
    prof["Customer_Share_Pct"] = (prof["Customer_Count"] / prof["Customer_Count"].sum() * 100).round(2)
    prof["Revenue_Share_Pct"] = (prof["Total_Revenue"] / prof["Total_Revenue"].sum() * 100).round(2)
    prof = prof.round(2)
    print(f"\n--- PROFIL CLUSTER UNTUK K = {k_eval} ---")
    print(prof.to_string(index=False))

# Pareto / Konsentrasi Revenue
rfm_sorted = rfm.sort_values(by="Monetary", ascending=False).reset_index(drop=True)
rfm_sorted["Cum_Cust_Pct"] = ((rfm_sorted.index + 1) / len(rfm_sorted) * 100)
rfm_sorted["Cum_Rev_Pct"] = (rfm_sorted["Monetary"].cumsum() / rfm_sorted["Monetary"].sum() * 100)

cust_for_50_rev = rfm_sorted.loc[rfm_sorted["Cum_Rev_Pct"] >= 50, "Cum_Cust_Pct"].iloc[0]
cust_for_80_rev = rfm_sorted.loc[rfm_sorted["Cum_Rev_Pct"] >= 80, "Cum_Cust_Pct"].iloc[0]
n_cust_80_rev = int(rfm_sorted.loc[rfm_sorted["Cum_Rev_Pct"] >= 80].index[0] + 1)
top_1_pct_rev = rfm_sorted.loc[rfm_sorted["Cum_Cust_Pct"] <= 1, "Cum_Rev_Pct"].iloc[-1]
top_5_pct_rev = rfm_sorted.loc[rfm_sorted["Cum_Cust_Pct"] <= 5, "Cum_Rev_Pct"].iloc[-1]
top_10_pct_rev = rfm_sorted.loc[rfm_sorted["Cum_Cust_Pct"] <= 10, "Cum_Rev_Pct"].iloc[-1]
top_20_pct_rev = rfm_sorted.loc[rfm_sorted["Cum_Cust_Pct"] <= 20, "Cum_Rev_Pct"].iloc[-1]

print("\n--- KONSENTRASI REVENUE (PARETO ANALYSIS) ---")
print(f"Total Unique Customers : {len(rfm_sorted):,}")
print(f"Total Revenue Bersih   : £{rfm_sorted['Monetary'].sum():,.2f}")
print(f"50% Revenue disumbang oleh : {cust_for_50_rev:.2f}% customer teratas")
print(f"80% Revenue disumbang oleh : {cust_for_80_rev:.2f}% customer teratas ({n_cust_80_rev:,} customer)")
print(f"Top 1% Customer menyumbang  : {top_1_pct_rev:.2f}% dari Total Revenue")
print(f"Top 5% Customer menyumbang  : {top_5_pct_rev:.2f}% dari Total Revenue")
print(f"Top 10% Customer menyumbang : {top_10_pct_rev:.2f}% dari Total Revenue")
print(f"Top 20% Customer menyumbang : {top_20_pct_rev:.2f}% dari Total Revenue")

