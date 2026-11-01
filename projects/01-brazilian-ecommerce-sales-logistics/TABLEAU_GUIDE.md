# 📘 Panduan Tableau dari Nol: Dashboard Olist E-Commerce

Panduan ini membawa kamu dari **belum pernah pakai Tableau** sampai punya **dashboard interaktif** dari file `ecommerce_master_clean.csv`.

> ⏱️ Estimasi: 1,5–2 jam untuk pertama kali. Ikuti urut, jangan lompat.

---

## Daftar Isi
0. [Gambaran Alur Kerja](#0-gambaran-alur-kerja)
1. [Install Tableau Public (Gratis)](#1-install-tableau-public-gratis)
2. [Siapkan Data dengan Python](#2-siapkan-data-dengan-python)
3. [Connect Data ke Tableau](#3-connect-data-ke-tableau)
4. [Kenalan dengan Tampilan Tableau](#4-kenalan-dengan-tampilan-tableau)
5. [Buat Calculated Field (Rumus)](#5-buat-calculated-field-rumus)
6. [Sheet 1–4: KPI Cards](#6-sheet-14-kpi-cards)
7. [Sheet 5: Line Chart Tren Revenue](#7-sheet-5-line-chart-tren-revenue)
8. [Sheet 6: Bar Chart Top 10 Kategori](#8-sheet-6-bar-chart-top-10-kategori)
9. [Sheet 7: Peta Revenue per State](#9-sheet-7-peta-revenue-per-state)
10. [Sheet 8: Keterlambatan vs Review](#10-sheet-8-keterlambatan-vs-review)
11. [Sheet 9: Pie Chart Metode Pembayaran](#11-sheet-9-pie-chart-metode-pembayaran)
12. [Rakit Dashboard](#12-rakit-dashboard)
13. [Simpan & Publish](#13-simpan--publish)
14. [Update Data Harian Otomatis](#14-update-data-harian-otomatis)
15. [Troubleshooting](#15-troubleshooting)

---

## 0. Gambaran Alur Kerja

```
CSV mentah (9 file)
   │  python data_pipeline.py
   ▼
TAHAP 1  Ambil & Bersihin   → hapus data kosong, duplikat, rapihin format
TAHAP 2  Analisis           → rata-rata, tren, perbandingan
TAHAP 3  Visualisasi        → line / bar / pie (Matplotlib + Seaborn)
TAHAP 4  Laporan Otomatis   → output/laporan_penjualan.xlsx + .pdf
   │
   ▼
ecommerce_master_clean.csv  ──►  TABLEAU (dashboard interaktif)
```

**Python** = dapur (bersihin & olah data). **Tableau** = etalase (dashboard interaktif yang bisa diklik dan difilter).

---

## 1. Install Tableau Public (Gratis)

1. Buka **https://public.tableau.com** lalu klik **Sign Up** untuk membuat akun gratis.
2. Setelah login, cari menu **Create → Download the App** (atau buka https://www.tableau.com/products/public/download).
3. Isi email, download installer **Tableau Public** untuk Windows, lalu install seperti biasa.
4. Buka aplikasi **Tableau Public**.

> [!IMPORTANT]
> Tableau Public **tidak bisa menyimpan file di komputer**. Semua hasil disimpan ke profil online kamu dan **bisa dilihat publik**. Untuk dataset Olist ini aman karena memang data publik dari Kaggle. Kalau nanti perlu data rahasia kantor, pakai **Tableau Desktop** (berbayar, ada trial 14 hari, atau gratis 1 tahun lewat program *Tableau for Students*).

---

## 2. Siapkan Data dengan Python

Di folder proyek, jalankan:

```powershell
python data_pipeline.py
```

Hasilnya:

| File | Fungsi |
|---|---|
| `ecommerce_master_clean.csv` | **Sumber data Tableau** (109.872 baris, 1 baris = 1 item dalam order) |
| `output/laporan_penjualan.xlsx` | Laporan Excel (KPI, tren, kategori, wilayah, dll.) |
| `output/laporan_penjualan.pdf` | Laporan PDF siap kirim |
| `output/charts/*.png` | Grafik line, bar, pie |

### Kolom penting di CSV

| Kolom | Arti |
|---|---|
| `order_id` | ID order (1 order bisa punya beberapa item) |
| `order_item_id` | Nomor urut item di dalam order (1, 2, 3, …) |
| `order_purchase_month` | Bulan pembelian |
| `customer_state_name` | Nama state Brasil (dipakai untuk peta) |
| `product_category` | Kategori produk (English) |
| `item_total_revenue` | Harga + ongkir per item |
| `review_score` | Rating 1–5 (sama untuk semua item dalam 1 order) |
| `delivery_status` | `On-Time` / `Late Delivery` |
| `delay_bucket` | Kelompok keterlambatan: On-Time, 1-3 hari, 4-7 hari, 8-14 hari, >14 hari |
| `payment_type` | Metode bayar utama |

---

## 3. Connect Data ke Tableau

1. Di halaman awal Tableau, panel kiri **Connect → To a File → Text file**.
2. Pilih `E:\Brazilian E-Commerce\ecommerce_master_clean.csv`.
3. Kamu masuk ke tab **Data Source**. Di bawah terlihat preview tabel.

### Cek tipe data (penting!)

Setiap kolom punya ikon di atas namanya:

| Ikon | Tipe |
|---|---|
| `Abc` | Teks (String) |
| `#` | Angka |
| 📅 | Tanggal |
| 🌐 | Geografis |

Pastikan:
- **Order Purchase Month** = 📅 Date. Kalau masih `Abc`, klik ikonnya lalu pilih **Date**.
- **Order Purchase Timestamp** = 📅 Date & Time.
- **Order Item Id** = `#` Number (whole).
- **Customer State Name**: klik ikonnya → **Geographic Role → State/Province**. Ikon berubah jadi 🌐.

> 💡 Tableau otomatis mengubah `order_purchase_month` jadi **Order Purchase Month** (underscore jadi spasi). Itu normal.

4. Klik **Sheet 1** di kiri bawah (ada tanda oranye) untuk mulai membuat grafik.

---

## 4. Kenalan dengan Tampilan Tableau

```
┌────────────┬───────────────────────────────────────────────┐
│ DATA PANE  │  Columns: [                    ]  ← kolom/sumbu X
│            │  Rows:    [                    ]  ← baris/sumbu Y
│ (daftar    ├────────┬──────────────────────────────────────┤
│  kolom)    │Filters │                                      │
│            │Marks   │          AREA GRAFIK (VIEW)          │
│ Biru  =    │ Color  │                                      │
│ Dimensi    │ Size   │                                      │
│ Hijau =    │ Label  │                                      │
│ Measure    │ ...    │                                      │
└────────────┴────────┴──────────────────────────────────────┘
  [Data Source] [Sheet 1] [+]                    [Show Me ▸]
```

| Istilah | Arti sederhana |
|---|---|
| **Dimension (biru)** | Kategori untuk mengelompokkan: kategori produk, state, bulan |
| **Measure (hijau)** | Angka yang dihitung: revenue, review |
| **Columns / Rows** | Taruh field di sini untuk membentuk sumbu grafik |
| **Marks card** | Atur warna, ukuran, label, tooltip |
| **Filters** | Saring data |
| **Show Me** | Menu cepat pilih jenis grafik |

Cara kerja utamanya: **drag (seret) field dari Data Pane ke Columns/Rows/Marks.**

---

## 5. Buat Calculated Field (Rumus)

> [!WARNING]
> **Kenapa perlu rumus khusus?** Data kita 1 baris = 1 **item**. Order berisi 3 item muncul 3 kali. Kalau langsung pakai `AVG(Review Score)`, order itu terhitung 3 kali sehingga hasilnya bias. Trik yang kita pakai: ambil hanya baris dengan `Order Item Id = 1` (setiap order pasti punya item nomor 1), jadi **1 order = 1 hitungan**.

Cara membuat: menu **Analysis → Create Calculated Field…**, ketik nama dan rumus, lalu klik **OK**. Buat 6 field ini:

| Nama Field | Rumus |
|---|---|
| `Total Revenue` | `SUM([Item Total Revenue])` |
| `Total Orders` | `COUNTD([Order Id])` |
| `AOV` | `SUM([Item Total Revenue]) / COUNTD([Order Id])` |
| `Avg Review` | `AVG(IF [Order Item Id] = 1 THEN [Review Score] END)` |
| `Avg Delivery Days` | `AVG(IF [Order Item Id] = 1 THEN [Actual Delivery Days] END)` |
| `Late %` | `COUNTD(IF [Delivery Status] = "Late Delivery" THEN [Order Id] END) / COUNTD([Order Id])` |

`COUNTD` = hitung jumlah yang **unik** (distinct), jadi 1 order dihitung sekali.

### Format angka
Klik kanan field di Data Pane → **Default Properties → Number Format…**
- `Total Revenue` dan `AOV` → **Currency (Custom)**, Prefix: `R$ `, Decimal: 0 (untuk Total Revenue pilih *Display Units: Millions (M)*).
- `Avg Review` dan `Avg Delivery Days` → **Number (Custom)**, 2 desimal.
- `Late %` → **Percentage**, 1 desimal.

### ✅ Checkpoint (harus sama dengan hasil Python)

| Metrik | Nilai yang benar |
|---|---|
| Total Revenue | R$ 15.371.741 |
| Total Orders | 96.203 |
| AOV | R$ 159,78 |
| Avg Review | 4,16 |
| Avg Delivery Days | 12,5 |
| Late % | 8,1% |

Kalau angkamu beda, cek lagi rumusnya.

---

## 6. Sheet 1–4: KPI Cards

1. Klik kanan tab **Sheet 1** → **Rename** jadi `KPI Revenue`.
2. Drag **Total Revenue** ke kotak **Text** di Marks card.
3. Klik **Text** → klik tombol `…` → edit teks jadi:
   ```
   Total Revenue
   <AGG(Total Revenue)>
   ```
   Blok baris pertama dan beri ukuran 12 warna abu. Blok baris kedua dan beri ukuran 28, **Bold**.
4. Di toolbar atas, ubah **Standard** jadi **Entire View**.
5. Klik kanan tab sheet → **Duplicate**. Di sheet hasil duplikat, ganti measure-nya dengan **Total Orders**, lalu rename jadi `KPI Orders`.
6. Ulangi untuk **AOV** (`KPI AOV`) dan **Avg Review** (`KPI Review`).

---

## 7. Sheet 5: Line Chart Tren Revenue

1. Klik ikon **New Worksheet** (tanda + di samping tab). Rename jadi `Tren Revenue`.
2. Drag **Order Purchase Month** ke **Columns**.
3. Klik panah kecil pada pill tersebut lalu pilih **Month** versi kedua (contoh tampilannya *May 2015*). Pill berubah jadi **hijau** (continuous), artinya garis waktu bersambung.
4. Drag **Total Revenue** ke **Rows**. Grafik garis langsung muncul.
5. Supaya lebih menarik:
   - Klik **Color** di Marks lalu pilih warna teal. Di bagian **Markers**, pilih opsi bertitik.
   - Drag **Total Orders** ke **Tooltip** supaya saat hover terlihat jumlah ordernya.
6. Klik kanan judul → **Edit Title** → `Tren Revenue Bulanan`.

💡 **Insight:** revenue naik konsisten sepanjang 2017. Puncaknya **November 2017** (Black Friday), lalu stabil di kisaran R$ 1 juta/bulan pada 2018.

---

## 8. Sheet 6: Bar Chart Top 10 Kategori

1. Buat New Worksheet dan rename jadi `Top Kategori`.
2. Drag **Product Category** ke **Rows**, lalu **Total Revenue** ke **Columns**.
3. Klik ikon **Sort Descending** di toolbar.
4. Filter ke Top 10:
   - Drag **Product Category** ke **Filters**.
   - Buka tab **Top**, pilih **By field: Top 10 by Total Revenue**, lalu **OK**.
5. Drag **Total Revenue** ke **Color** (makin besar makin pekat), lalu ke **Label** (angka tampil di ujung bar).

💡 **Insight:** **Health Beauty** adalah kategori dengan revenue terbesar.

---

## 9. Sheet 7: Peta Revenue per State

1. Buat New Worksheet dan rename jadi `Peta State`.
2. **Double-click** **Customer State Name** (ikon 🌐). Peta otomatis muncul.
3. Kalau muncul tulisan **"xx unknown"** di kanan bawah, klik tulisan itu → **Edit Locations** → isi **Country/Region: Brazil**.
4. Di Marks, ganti dropdown **Automatic** jadi **Map** (filled map).
5. Drag **Total Revenue** ke **Color**.
6. Drag **Total Orders** dan **Avg Delivery Days** ke **Tooltip**.

💡 **Insight:** **São Paulo (SP)** mendominasi revenue. State di utara (jauh dari SP) punya durasi pengiriman lebih lama.

---

## 10. Sheet 8: Keterlambatan vs Review

Sheet ini menjawab **Business Question #2**.

1. Buat New Worksheet dan rename jadi `Delay vs Review`.
2. Drag **Delay Bucket** ke **Columns**, lalu **Avg Review** ke **Rows**.
3. Urutkan manual: klik panah pada pill **Delay Bucket** → **Sort…** → **Manual**, lalu susun:
   `On-Time → 1-3 hari → 4-7 hari → 8-14 hari → >14 hari`.
4. Drag **Avg Review** ke **Color** → **Edit Colors** → palette **Red-Green Diverging**.
5. Drag **Avg Review** ke **Label**.

💡 **Insight utama:**

| Keterlambatan | Avg Review |
|---|---|
| On-Time | **4,30** |
| 1-3 hari | 3,75 |
| 4-7 hari | 2,30 |
| 8-14 hari | 1,74 |
| >14 hari | **1,71** |

Terlambat lebih dari 3 hari membuat rating anjlok drastis. **Ketepatan pengiriman sangat menentukan kepuasan pelanggan.**

---

## 11. Sheet 9: Pie Chart Metode Pembayaran

1. Buat New Worksheet dan rename jadi `Metode Bayar`.
2. Di Marks, ganti dropdown jadi **Pie**.
3. Drag **Payment Type** ke **Color**, lalu **Total Orders** ke **Angle**.
4. Drag **Total Orders** ke **Label**. Klik kanan pill label tersebut → **Quick Table Calculation → Percent of Total**.
5. Drag **Payment Type** ke **Label** juga, supaya nama metode ikut tampil.
6. Ubah **Standard** jadi **Entire View** agar pie lebih besar.

💡 **Insight:** sekitar 75% order dibayar dengan **Credit Card**, disusul **Boleto** sekitar 20%.

---

## 12. Rakit Dashboard

1. Klik ikon **New Dashboard** (ikon kotak-kotak di samping tab sheet).
2. Di panel kiri, **Size** → pilih **Fixed size → 1366 x 900** (atau *Automatic*).
3. Susun dengan drag sheet dari panel kiri ke kanvas:

```
┌──────────────────────────────────────────────────────────┐
│  JUDUL: Olist E-Commerce Sales & Delivery Dashboard       │
├─────────────┬─────────────┬─────────────┬────────────────┤
│ KPI Revenue │ KPI Orders  │  KPI AOV    │  KPI Review    │
├─────────────┴─────────────┴──────┬──────┴────────────────┤
│       Tren Revenue (line)        │   Peta State (map)    │
├──────────────────────────────────┼───────────────────────┤
│   Top Kategori (bar)             │ Delay vs Review (bar) │
│                                  │ Metode Bayar (pie)    │
└──────────────────────────────────┴───────────────────────┘
```

   Tips: drag **Horizontal** container dulu dari panel *Objects*, lalu masukkan 4 KPI ke dalamnya supaya sejajar.

4. **Judul:** centang **Show dashboard title** di kiri bawah, double-click untuk mengedit.
5. **Bikin interaktif (klik peta untuk memfilter semua grafik):**
   - Klik sheet **Peta State** di dashboard, lalu klik ikon **corong (Use as Filter)** di pojok kanannya.
   - Lakukan hal yang sama di **Top Kategori**.
   - Sekarang klik state *SP* di peta, dan semua grafik lain langsung menyesuaikan.
6. **Tambah filter tahun:** buka sheet *Tren Revenue*, klik kanan **Order Purchase Month** di Data Pane → drag ke **Filters** → pilih **Years** → All → OK. Klik kanan pill filter → **Show Filter**. Lalu di dashboard, klik panah sheet *Tren Revenue* → **Filters → Year of Order Purchase Month**. Klik panah filter → **Apply to Worksheets → All Using This Data Source**.
7. Tambah **Text** object di bawah judul untuk 2–3 kalimat insight (lihat insight di bagian 7–11).

---

## 13. Simpan & Publish

1. **File → Save to Tableau Public As…**
2. Login akun Tableau Public, beri nama `Olist E-Commerce Dashboard`.
3. Browser terbuka menampilkan dashboard online kamu. Link ini bisa ditaruh di **CV / LinkedIn / portofolio**.
4. Untuk membuka lagi nanti: **File → Open from Tableau Public**.
5. Untuk gambar: **Dashboard → Export Image…** (PNG untuk laporan/presentasi).

---

## 14. Update Data Harian Otomatis

### a. Jalankan pipeline otomatis tiap hari (Windows Task Scheduler)

1. Tekan **Win**, ketik **Task Scheduler**, lalu buka.
2. Klik **Create Basic Task…** dan beri nama `Olist Daily Report`.
3. Trigger **Daily**, lalu atur jam (misal 07:00).
4. Action **Start a program**, Program/script:
   ```
   E:\Brazilian E-Commerce\run_daily_report.bat
   ```
   Start in: `E:\Brazilian E-Commerce`
5. Klik **Finish**. Setiap pagi, file CSV, Excel, dan PDF diperbarui otomatis. Log tiap run ada di `output\run_log.txt`.

### b. Refresh di Tableau
Setelah CSV diperbarui, buka workbook → menu **Data → ecommerce_master_clean → Refresh** (atau **Extract → Refresh**), lalu **Save to Tableau Public** lagi.

> 💡 Dataset Olist sendiri statis (2016–2018). Fitur otomatis ini berguna saat source CSV diganti dengan data baru, misalnya export harian dari sistem kantor dengan struktur kolom yang sama.

---

## 15. Troubleshooting

| Masalah | Solusi |
|---|---|
| Peta kosong / "unknown" | Pastikan Geographic Role **State/Province** diset di **Customer State Name** (bukan Customer State). Lalu Edit Locations → Country: Brazil |
| Garis tren putus-putus / jadi bar | Pill bulan harus **hijau** (Month continuous), bukan biru |
| Avg Review beda dari 4,16 | Pakai calculated field `Avg Review` (dengan `Order Item Id = 1`), jangan `AVG(Review Score)` langsung |
| Total Orders terlalu besar (~109 ribu) | Pakai `COUNTD([Order Id])`, bukan `COUNT` |
| Huruf aksen rusak (São Paulo jadi SÃ£o) | Di Data Source, klik panah koneksi → **Text File Properties → Character Set: UTF-8** |
| Grafik terlalu kecil di dashboard | Ubah sheet dari **Standard** ke **Entire View** |
| Lupa langkah | **Ctrl+Z** untuk undo. Tableau punya undo tanpa batas |

---

🎉 **Selesai!** Kamu sekarang punya pipeline Python lengkap (bersihin → analisis → visualisasi → laporan otomatis) dan dashboard Tableau interaktif untuk portofolio.
