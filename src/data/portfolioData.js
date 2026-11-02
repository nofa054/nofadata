import project1Img from '../assets/project-1-olist-sales-logistics.jpg';
import project2Img from '../assets/project-2-marketing-funnel.jpg';
import project3Img from '../assets/project-3-rfm-segmentation.jpg';

export const personalInfo = {
  name: "Nofa Amandasari",
  shortName: "Nofa",
  fullName: "Nofa Amandasari",
  degree: "S.Kom. (S1 Informatika)",
  university: "Universitas Muhammadiyah Semarang",
  role: "Data Analyst Enthusiast • Fresh Graduate S1 Informatika",
  tagline: "Real Data, Useful insight, Better decisions",
  location: "Semarang, Indonesia (Open to Remote & Relocation)",
  bio: "Lulusan baru (Fresh Graduate) S1 Informatika dari Universitas Muhammadiyah Semarang yang memiliki ketertarikan tinggi pada bidang Data Analysis dan Business Intelligence. Berfokus pada pengolahan data menggunakan SQL, Python (Pandas & Scikit-Learn), dan Microsoft Excel untuk mengubah data mentah menjadi visualisasi dashboard interaktif serta insight yang membantu pengambilan keputusan bisnis.",
  shortBio: "Fresh Graduate S1 Informatika Universitas Muhammadiyah Semarang dengan fokus pada Data Analytics, SQL, Python, dan Interactive Dashboarding.",
  status: "Fresh Graduate • Open to Work",
  email: "nofaamanda749@gmail.com",
  linkedin: "https://www.linkedin.com/in/nofa-amandasari-47643a312",
  github: "https://github.com/nofa054",
  tableauPublic: "https://public.tableau.com",
  kaggle: "https://kaggle.com",
  resumeUrl: "#contact"
};

export const stats = [
  { value: "112K+", label: "Baris Data Dianalisis", desc: "Dataset Olist & UCI Online Retail II" },
  { value: "3", label: "Portofolio Studi Kasus", desc: "Sales, Marketing Funnel & RFM" },
  { value: "S1", label: "Informatika UNIMUS", desc: "Universitas Muhammadiyah Semarang" },
  { value: "SQL & Py", label: "Core Data Stack", desc: "SQLite, Pandas, K-Means & Excel" }
];

export const skillsCategories = [
  {
    category: "Data Analysis & Programming",
    description: "Ekstraksi, pembersihan data (data cleaning), dan pemodelan",
    skills: [
      { name: "SQL (SQLite / PostgreSQL / MySQL)", level: "Advanced", icon: "Database", desc: "JOINs, Aggregation, CTE, Window Functions, Data Filtering" },
      { name: "Python for Data Analysis", level: "Advanced", icon: "Code", desc: "Pandas, NumPy, Data Wrangling, Exploratory Data Analysis" },
      { name: "Machine Learning (Scikit-Learn)", level: "Intermediate", icon: "Activity", desc: "K-Means Clustering (RFM), Log Transformation, Segmentation" },
      { name: "Data Hygiene & Preprocessing", level: "Advanced", icon: "CheckCircle2", desc: "Handling missing values, deduplikasi, deteksi anomali data" }
    ]
  },
  {
    category: "Data Visualization & Reporting",
    description: "Merancang visualisasi interaktif & pelaporan metrik bisnis",
    skills: [
      { name: "Microsoft Excel / Spreadsheets", level: "Advanced", icon: "FileSpreadsheet", desc: "Pivot Tables, XLOOKUP/VLOOKUP, Conditional Formatting, Charts" },
      { name: "Interactive BI Dashboarding", level: "Advanced", icon: "BarChart3", desc: "KPI Design, Executive Summary, Multi-filter Visuals" },
      { name: "Power BI / Looker Studio", level: "Intermediate", icon: "PieChart", desc: "Data Modeling, Visual Storytelling, Funnel & Retention Charts" },
      { name: "Python Visualization", level: "Intermediate", icon: "TrendingUp", desc: "Matplotlib & Seaborn untuk distribusi, korelasi, dan scatter plot" }
    ]
  },
  {
    category: "Analytical Frameworks",
    description: "Pendekatan analitis untuk menjawab permasalahan bisnis",
    skills: [
      { name: "Exploratory Data Analysis (EDA)", level: "Advanced", icon: "Search", desc: "Melihat tren penjualan, musiman, dan distribusi geografis" },
      { name: "Customer Segmentation (RFM)", level: "Advanced", icon: "Users", desc: "Recency, Frequency, Monetary & Pareto 80/20 Rule" },
      { name: "Marketing Funnel Analysis", level: "Advanced", icon: "TrendingUp", desc: "MQL-to-Won Conversion Rate & Sales Cycle Duration" },
      { name: "Operations & SLA Evaluation", level: "Intermediate", icon: "Repeat", desc: "Analisis ketepatan waktu pengiriman terhadap kepuasan pelanggan" }
    ]
  }
];

export const analyticsWorkflow = [
  {
    step: "01",
    title: "Business Understanding",
    desc: "Memahami konteks masalah bisnis, menentukan metrik utama (KPI), dan menyusun pertanyaan analisis yang tepat."
  },
  {
    step: "02",
    title: "Data Cleaning & Preparation",
    desc: "Mengekstrak data menggunakan SQL/Python, membersihkan nilai kosong atau duplikat, dan memvalidasi kualitas data."
  },
  {
    step: "03",
    title: "Exploratory Analysis & Modeling",
    desc: "Menganalisis pola tren, segmentasi pelanggan (RFM & K-Means), analisis Pareto 80/20, serta konversi funnel."
  },
  {
    step: "04",
    title: "Dashboard Visualization",
    desc: "Menyajikan hasil temuan ke dalam dashboard yang terstruktur, mudah dipahami, dan informatif."
  },
  {
    step: "05",
    title: "Actionable Recommendations",
    desc: "Merumuskan kesimpulan dan saran berbasis data untuk mendukung pengambilan keputusan tim."
  }
];

export const projects = [
  {
    id: "01",
    number: "01",
    category: "E-Commerce & Logistics",
    badge: "Olist Public Dataset (100k Orders)",
    displayTitle: "01 - Brazilian E-Commerce Sales & Logistics Analysis",
    title: "Executive Dashboard • Brazilian E-Commerce Public Dataset by Olist (100k Orders)",
    image: project1Img,
    highlightDesc: "Menganalisis **98,666 pesanan selesai** dengan total nilai transaksi **R$ 15.84M** dari **95,420 pelanggan aktif** untuk memetakan **tren penjualan 2017–2018**, **kategori produk & state terbesar**, serta **dampak keterlambatan pengiriman terhadap Review Score**.",
    fullDescription: "Analisis komprehensif performa penjualan dan keandalan logistik pada ekosistem e-commerce Olist di Brasil. Mengintegrasikan metrik nilai transaksi (Price + Freight Value), konsentrasi pasar per wilayah (State), preferensi metode pembayaran, serta evaluasi durasi pengiriman Aktual vs Estimasi terhadap kepuasan pembeli.",
    tools: ["SQL", "Python", "Pandas", "Executive BI Dashboard", "Logistics SLA Analysis", "Data Cleaning"],
    metrics: [
      { label: "Total Revenue", value: "R$ 15.84M" },
      { label: "Total Orders", value: "98,666" },
      { label: "Avg Order Value", value: "R$ 160.58" },
      { label: "Avg Review Score", value: "4.03 / 5.0" }
    ],
    dashboardType: "olist-sales",
    caseStudy: {
      problem: "Pertumbuhan transaksi bulanan yang pesat (dari R$ 130k di awal 2017 hingga menembus R$ 1.18M/bulan) terkonsentrasi berat di wilayah tenggara seperti São Paulo (SP), Rio de Janeiro (RJ), dan Minas Gerais (MG), sementara pengiriman lintas state sering mengalami deviasi durasi yang berpotensi menurunkan kepuasan pelanggan.",
      action: "Mengekstraksi dan memvalidasi 98,666 pesanan berstatus Delivered dari 95,420 unique customers. Merancang Executive Dashboard interaktif dengan filter Tahun, Kategori Produk, State, dan Status Pesanan yang membedah Top 10 Kategori Produk (Health & Beauty, Watches & Gifts, Bed Bath Table), proporsi pembayaran (didominasi Credit Card & Boleto), serta perbandingan Delivery Time Aktual vs Estimasi per state.",
      impact: "Membuktikan bahwa ketepatan waktu pengiriman berdampak langsung terhadap reputasi platform: pesanan On-Time mencatat rata-rata Review Score tinggi (~4.2/5.0), sedangkan pesanan terlambat (Late Delivery) anjlok ke ~2.5/5.0. Insight ini menjadi dasar prioritas perbaikan SLA mitra logistik di state dengan waktu tempuh terlama seperti Bahia (BA) dan Rio de Janeiro (RJ)."
    },
    githubUrl: "https://github.com/nofa054/Brazilian-E-Commerce",
    liveUrl: "#projects",
    reportUrl: "#case-study-01"
  },
  {
    id: "02",
    number: "02",
    category: "Marketing & Funnel Analytics",
    badge: "Olist E-Commerce • 8.000 Leads",
    displayTitle: "02 - Marketing Funnel & Channel Performance",
    title: "Analisis Konversi Lead (MQL) ke Closed Deals, Kecepatan Closing, dan Optimasi Channel Pemasaran",
    image: project2Img,
    highlightDesc: "Menganalisis **8.000 Marketing Qualified Leads (MQL)** dan **842 Closed Deals** (**10,53% Conversion Rate**) pada dataset **funnel_clean.csv** untuk mengidentifikasi **channel pemasaran paling efektif** dan mempercepat **rata-rata Sales Cycle (48,4 hari)**.",
    fullDescription: "Evaluasi performa akuisisi seller/merchant dari tahap prospek terdaftar (MQL) hingga transaksi berhasil closing (Won). Mengukur rasio konversi dan kecepatan closing (first contact hingga deal closing) di 10 channel pemasaran sekaligus melakukan audit kualitas data pada metrik Declared Revenue.",
    tools: ["Python", "SQL", "Funnel Analytics", "Data Hygiene & QA", "BI Dashboard", "CSV ETL"],
    metrics: [
      { label: "Total Leads (MQL)", value: "8.000" },
      { label: "Closed Deals (Won)", value: "842" },
      { label: "Conversion Rate", value: "10,53%" },
      { label: "Avg Sales Cycle", value: "48,4 Hari" }
    ],
    dashboardType: "marketing-funnel",
    caseStudy: {
      problem: "Tim akuisisi perlu mengetahui channel pemasaran mana yang menghasilkan probabilitas closing tertinggi dan mana yang memiliki waktu tunggu (sales cycle) paling singkat, di tengah kondisi distribusi durasi closing yang miring (mean 48,4 hari vs median 14 hari) serta banyaknya data Declared Revenue yang kosong.",
      action: "Membersihkan dan memodelkan 8.000 data prospek pada funnel_clean.csv, memetakan Conversion Rate per Channel serta Rata-rata Sales Cycle (Hari) untuk seluruh channel akuisisi, dan menyertakan indikator transparansi kualitas data pada kartu Declared Revenue (R$ 61,8M di mana 94,66% baris bernilai R$ 0).",
      impact: "Mengidentifikasi Paid Search sebagai channel terukur dengan konversi tertinggi (12,30%, di luar Unknown/Direct ~16,5%), disusul Organic Search dan Direct Traffic (~11–12%). Sementara itu, Display Ads terbukti memiliki siklus closing tercepat (10,3 hari) dibanding Social Media (~60 hari), mendukung strategi realokasi budget akuisisi berbasis kecepatan dan konversi."
    },
    githubUrl: "https://github.com/nofa054/Marketing-Funnel-by-Olist",
    liveUrl: "#projects",
    reportUrl: "#case-study-02"
  },
  {
    id: "03",
    number: "03",
    category: "Customer Analytics & Machine Learning",
    badge: "Online Retail II (UCI) • K-Means (K=4)",
    displayTitle: "03 - Customer Segmentation (RFM) & Retention",
    title: "Customer Segmentation (RFM) & Retention Dashboard • SQLite + Python K-Means (K=4) + Excel",
    image: project3Img,
    highlightDesc: "Mengelompokkan **5,878 pelanggan unik** dengan total revenue **£17.37M** menggunakan **SQLite & Python K-Means (K=4)** untuk memetakan **segmen Champions (20.5%) vs At Risk (24.8%)**, **Kurva Pareto 80/20**, dan **tren retensi pelanggan berulang**.",
    fullDescription: "Proyek end-to-end Customer Relationship & Retention Analytics pada dataset Online Retail II (UCI) periode 2009–2011. Mengombinasikan ekstraksi data SQLite, clustering K-Means (K=4) berbasis transformasi Log10 Frequency vs Monetary di Python, serta dashboard interaktif untuk strategi retensi pelanggan bernilai tinggi.",
    tools: ["SQLite", "Python", "Scikit-Learn K-Means (K=4)", "RFM Segmentation", "Microsoft Excel", "Pareto 80/20"],
    metrics: [
      { label: "Total Customers", value: "5,878" },
      { label: "Total Revenue", value: "£17.37M" },
      { label: "Champions (VIP)", value: "20.5%" },
      { label: "At Risk (Priority)", value: "24.8%" }
    ],
    dashboardType: "rfm-segmentation",
    caseStudy: {
      problem: "Dengan total transaksi £17,374,804 dari 5.878 pelanggan unik (rata-rata belanja £2,955.90 per pelanggan), perusahaan memerlukan segmentasi objektif berbasis perilaku transaksi untuk melindungi sumber pendapatan utama sekaligus mencegah churn pada pelanggan bernilai tinggi.",
      action: "Membangun pipeline agregasi RFM menggunakan SQLite dan menerapkan algoritma K-Means Clustering (K=4) dengan skala Log-Log (Log10 Frequency vs Monetary) di Python. Memvisualisasikan 5 komponen analitik utama: distribusi jumlah pelanggan per segmen, kontribusi revenue per segmen, Kurva Pareto 80/20, scatter plot pemisahan ruang cluster, dan tren bulanan pelanggan Baru vs Repeat (2009-12 s.d. 2011-12).",
      impact: "Mengungkap konsentrasi Pareto di mana 23,04% pelanggan teratas menyumbang 80% total revenue—dengan segmen Champions (1.196 pelanggan / 20,35%) menghasilkan £12.83M (73,87% revenue). Menetapkan 1.459 pelanggan di segmen At Risk (24,82% populasi yang menyumbang £2.84M / 16,36% revenue) sebagai target prioritas kampanye win-back & retensi."
    },
    githubUrl: "https://github.com/nofa054/Online-Retail-II-UCI",
    liveUrl: "#projects",
    reportUrl: "#case-study-03"
  }
];

export const educationList = [
  {
    period: "Fresh Graduate",
    degree: "Sarjana Komputer (S1 Informatika)",
    institution: "Universitas Muhammadiyah Semarang (UNIMUS)",
    type: "Pendidikan Tinggi",
    desc: "Mempelajari fondasi ilmu komputer, sistem basis data (SQL), pemrograman Python, struktur data, penambangan data (Data Mining), serta penerapan metode statistik dan machine learning untuk analisis data."
  },
  {
    period: "Portfolio & Case Studies",
    degree: "Independent Data Analyst Projects",
    institution: "Self-Directed Analytics & Case Study Research",
    type: "Praktik & Proyek Portofolio",
    desc: "Mengerjakan 3 proyek studi kasus end-to-end menggunakan dataset industri nyata: (1) Analisis Penjualan & Logistik Olist E-Commerce 100k Orders, (2) Evaluasi Marketing Funnel 8.000 MQL Leads, dan (3) Segmentasi Pelanggan RFM dengan SQLite + Python K-Means (K=4) + Excel."
  }
];

export const certifications = [
  {
    name: "Database Programming with SQL",
    issuer: "Oracle Academy",
    type: "Award of Course Completion",
    detail: "24 Juli 2023 • SQL & Relational Database",
    pdfUrl: "/certificates/ORACLE-DATABASE-PROGRAMMING-SQL.pdf",
    highlight: true
  },
  {
    name: "Database Foundations",
    issuer: "Oracle Academy",
    type: "Award of Final Exam Completion",
    detail: "28 Juli 2023 • Database Design & Modeling",
    pdfUrl: "/certificates/ORACLE-DATABASE-FOUNDATIONS.pdf",
    highlight: true
  },
  {
    name: "Data Science & Data Analysis (Full Learning Path)",
    issuer: "MySkill — Certificate of Professional Skill",
    type: "147 Hours • 147 Courses",
    detail: "ID: MS-20261030-IdfS1jfH4ic4yMPW7hLM",
    pdfUrl: "/certificates/DATA-SCIENCE-AND-DATA-ANALYSIS.pdf",
    highlight: true
  },
  {
    name: "SQL for Data Analysis",
    issuer: "MySkill — Skill Specialization",
    type: "15 Hours • 15 Courses",
    detail: "ID: MS-20261101-wIaKxYDGu66IY4UcgqFY",
    pdfUrl: "/certificates/SQL-FOR-DATA-ANALYSIS.pdf"
  },
  {
    name: "Python for Data Analysis",
    issuer: "MySkill — Skill Specialization",
    type: "10 Hours • 10 Courses",
    detail: "ID: MS-20261028-qhPY1lUi9YnAQy6nlWyb",
    pdfUrl: "/certificates/PYTHON-FOR-DATA-ANALYSIS.pdf"
  },
  {
    name: "Microsoft Power BI",
    issuer: "MySkill — Skill Specialization",
    type: "12 Hours • 12 Courses",
    detail: "ID: MS-20261029-UiDMXbR5fRfJeGZumyzY",
    pdfUrl: "/certificates/MICROSOFT-POWER-BI.pdf"
  },
  {
    name: "Google Looker Studio",
    issuer: "MySkill — Skill Specialization",
    type: "7 Hours • 7 Courses",
    detail: "ID: MS-20261101-RecZgTLEHmz8mTtutv8n",
    pdfUrl: "/certificates/GOOGLE-LOOKER-STUDIO.pdf"
  },
  {
    name: "Data Analysis Specialization",
    issuer: "MySkill — Skill Specialization",
    type: "16 Hours • 16 Courses",
    detail: "ID: MS-20261101-zczvZoFNeOZNZrErJ4hl",
    pdfUrl: "/certificates/DATA-ANALYSIS.pdf"
  },
  {
    name: "Data Science Specialization",
    issuer: "MySkill — Skill Specialization",
    type: "18 Hours • 18 Courses",
    detail: "ID: MS-20261101-AmVSWUpL6rjr2VKJLYej",
    pdfUrl: "/certificates/DATA-SCIENCE.pdf"
  },
  {
    name: "Python for Data Science",
    issuer: "MySkill — Skill Specialization",
    type: "22 Hours • 22 Courses",
    detail: "ID: MS-20261101-RQN3xgH7uO5c9ePLQokL",
    pdfUrl: "/certificates/PYTHON-FOR-DATA-SCIENCE.pdf"
  },
  {
    name: "Python Fundamental",
    issuer: "MySkill — Skill Specialization",
    type: "37 Hours • 37 Courses",
    detail: "ID: MS-20261101-Kwhhf4r3LGKS7UPQ4mvs",
    pdfUrl: "/certificates/PYTHON-FUNDAMENTAL.pdf"
  },
  {
    name: "Microsoft Excel Basic",
    issuer: "MySkill — Skill Specialization",
    type: "8 Hours • 8 Courses",
    detail: "ID: MS-20261102-GaGWr8HmpDQ7LGsPzTnh",
    pdfUrl: "/certificates/MICROSOFT-EXCEL-BASIC.pdf"
  },
  {
    name: "Basic Data Specialization",
    issuer: "MySkill — Skill Specialization",
    type: "10 Hours • 10 Courses",
    detail: "ID: MS-20261029-rSYJxFeoPmgflqxDjRh1",
    pdfUrl: "/certificates/Basic-data.pdf"
  }
];
