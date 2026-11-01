import React from 'react';
import { 
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  ShoppingBag,
  Clock
} from 'lucide-react';

function OlistSalesInteractive() {
  const topCategories = [
    { name: 'Health Beauty', val: 'R$ 1.44M', w: '100%' },
    { name: 'Watches Gifts', val: 'R$ 1.30M', w: '90%' },
    { name: 'Bed Bath Table', val: 'R$ 1.24M', w: '86%' },
    { name: 'Sports Leisure', val: 'R$ 1.15M', w: '80%' },
    { name: 'Computers Acc.', val: 'R$ 1.06M', w: '74%' },
  ];

  const topStates = [
    { st: 'SP', h: '100%', val: 'R$ 5.9M' },
    { st: 'RJ', h: '36%', val: 'R$ 2.1M' },
    { st: 'MG', h: '31%', val: 'R$ 1.8M' },
    { st: 'RS', h: '15%', val: 'R$ 0.9M' },
    { st: 'PR', h: '14%', val: 'R$ 0.8M' },
    { st: 'BA', h: '10%', val: 'R$ 0.6M' },
  ];

  return (
    <div className="space-y-3">
      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-teal-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Total Revenue</span>
          <span className="text-sm sm:text-base font-extrabold text-teal-300 font-mono">R$ 15.84M</span>
          <span className="text-[9px] text-slate-500 block">Price + Freight</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-sky-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Total Orders</span>
          <span className="text-sm sm:text-base font-extrabold text-sky-300 font-mono">98,666</span>
          <span className="text-[9px] text-slate-500 block">Completed Orders</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-indigo-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Avg Order Value</span>
          <span className="text-sm sm:text-base font-extrabold text-indigo-300 font-mono">R$ 160.58</span>
          <span className="text-[9px] text-slate-500 block">Revenue / Order</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-cyan-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Unique Customers</span>
          <span className="text-sm sm:text-base font-extrabold text-cyan-300 font-mono">95,420</span>
          <span className="text-[9px] text-slate-500 block">Active Buyers</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-emerald-400/30 col-span-2 sm:col-span-1">
          <span className="text-[9px] text-slate-400 uppercase block">Avg Review Score</span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-300 font-mono">4.03 / 5.0</span>
          <span className="text-[9px] text-slate-500 block">CSAT Rating</span>
        </div>
      </div>

      {/* Middle Row: Monthly Trend + Top Categories */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7 bg-[#0e1a38] p-3 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-1">
            <div>
              <span className="text-xs font-bold text-white block">Tren Penjualan Bulanan (Revenue)</span>
              <span className="text-[10px] text-slate-400">Perkembangan total omset 2017 – 2018 (Peak: R$ 1.18M)</span>
            </div>
            <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              2017–2018
            </span>
          </div>
          <div className="w-full h-28 mt-2">
            <svg className="w-full h-full" viewBox="0 0 300 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="olistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M5,78 L25,65 L45,52 L65,54 L85,40 L105,46 L125,38 L145,32 L165,28 L185,8 L205,25 L225,12 L245,18 L265,10 L285,12 L295,15 L295,88 L5,88 Z"
                fill="url(#olistGrad)"
              />
              <path
                d="M5,78 L25,65 L45,52 L65,54 L85,40 L105,46 L125,38 L145,32 L165,28 L185,8 L205,25 L225,12 L245,18 L265,10 L285,12 L295,15"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="185" cy="8" r="3.5" fill="#2dd4bf" />
              <circle cx="265" cy="10" r="3.5" fill="#2dd4bf" />
            </svg>
          </div>
        </div>

        <div className="md:col-span-5 bg-[#0e1a38] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Top Kategori Produk by Revenue</span>
            <span className="text-[10px] text-slate-400">Penyumbang penjualan terbesar</span>
          </div>
          <div className="space-y-2 mt-2">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-teal-300 font-mono">{cat.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" style={{ width: cat.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Revenue per State + Review Score On Time vs Late */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#0e1a38] p-3 rounded-xl border border-white/5">
          <span className="text-xs font-bold text-white block mb-1">Total Revenue per State (Top 6)</span>
          <div className="flex items-end justify-between gap-2 h-20 pt-2 px-2">
            {topStates.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full max-w-[22px] bg-gradient-to-t from-blue-600 to-sky-400 rounded-t" style={{ height: s.h }} />
                <span className="text-[9px] font-mono text-slate-300">{s.st}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1a38] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Review Score: Tepat Waktu vs Terlambat</span>
            <span className="text-[10px] text-slate-400">Dampak keterlambatan logistik terhadap kepuasan</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 text-center">
              <span className="text-base font-extrabold font-mono text-rose-400 block">2.54 / 5.0</span>
              <span className="text-[10px] text-slate-300">Late Delivery</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
              <span className="text-base font-extrabold font-mono text-emerald-400 block">4.21 / 5.0</span>
              <span className="text-[10px] text-slate-300">On Time Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingFunnelInteractive() {
  const channelsConv = [
    { ch: 'Unknown / Direct', rate: '16.5%', w: '100%' },
    { ch: 'Paid Search', rate: '12.30%', w: '75%', highlight: true },
    { ch: 'Organic Search', rate: '11.8%', w: '71%' },
    { ch: 'Direct Traffic', rate: '11.2%', w: '68%' },
    { ch: 'Referral', rate: '8.4%', w: '51%' },
    { ch: 'Social Media', rate: '5.6%', w: '34%' },
  ];

  const cycleDays = [
    { ch: 'Display Ads', days: '10,3 Hari', w: '17%', fast: true },
    { ch: 'Direct Traffic', days: '31,0 Hari', w: '51%' },
    { ch: 'Referral', days: '33,2 Hari', w: '55%' },
    { ch: 'Organic Search', days: '49,8 Hari', w: '82%' },
    { ch: 'Paid Search', days: '56,4 Hari', w: '93%' },
    { ch: 'Social Media', days: '60,5 Hari', w: '100%' },
  ];

  return (
    <div className="space-y-3">
      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-white/10">
          <span className="text-[9px] text-slate-400 uppercase block">Total Leads (MQL)</span>
          <span className="text-sm sm:text-base font-extrabold text-white font-mono">8.000</span>
          <span className="text-[9px] text-slate-500 block">Semua prospek</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-sky-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Closed Deals</span>
          <span className="text-sm sm:text-base font-extrabold text-sky-400 font-mono">842</span>
          <span className="text-[9px] text-slate-500 block">Transaksi Won</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-amber-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Conversion Rate</span>
          <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">10,53%</span>
          <span className="text-[9px] text-slate-500 block">Rasio konversi</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-emerald-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Avg Sales Cycle</span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">48,4 Hari</span>
          <span className="text-[9px] text-slate-500 block">Median: 14 hari</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-purple-400/30 col-span-2 sm:col-span-1">
          <span className="text-[9px] text-slate-400 uppercase flex items-center justify-between">
            Declared Rev* <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
          </span>
          <span className="text-sm sm:text-base font-extrabold text-purple-300 font-mono">R$ 61,8M</span>
          <span className="text-[9px] text-amber-300/80 block">*94,66% bernilai R$ 0</span>
        </div>
      </div>

      {/* 2 Main Charts: Conversion Rate per Channel & Avg Sales Cycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#0e1a38] p-3.5 rounded-xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs font-bold text-white block">Conversion Rate per Channel</span>
              <span className="text-[10px] text-slate-400">% leads berhasil closing per channel</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              Top: Paid Search (12,30%)
            </span>
          </div>
          <div className="space-y-2 pt-1">
            {channelsConv.map((item, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300">{item.ch}</span>
                  <span className="font-mono text-amber-300 font-semibold">{item.rate}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.highlight ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-amber-500/70'}`}
                    style={{ width: item.w }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1a38] p-3.5 rounded-xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs font-bold text-white block">Rata-rata Sales Cycle (Hari)</span>
              <span className="text-[10px] text-slate-400">First contact hingga closing (pendek = baik)</span>
            </div>
            <span className="text-[9px] font-mono bg-sky-500/15 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
              Tercepat: Display (10,3 Hr)
            </span>
          </div>
          <div className="space-y-2 pt-1">
            {cycleDays.map((item, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300">{item.ch}</span>
                  <span className="font-mono text-sky-300 font-semibold">{item.days}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.fast ? 'bg-gradient-to-r from-emerald-400 to-sky-400' : 'bg-sky-500/75'}`}
                    style={{ width: item.w }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RfmSegmentationInteractive() {
  const segments = [
    { name: 'Champions', cust: '1,196 (20.35%)', rev: '£12.83M (73.87%)', custW: '60%', revW: '100%', color: 'bg-indigo-500' },
    { name: 'At Risk', cust: '1,459 (24.82%)', rev: '£2.84M (16.36%)', custW: '74%', revW: '22%', color: 'bg-amber-500' },
    { name: 'Pot. Loyalists', cust: '1,250 (21.27%)', rev: '£1.07M (6.17%)', custW: '63%', revW: '9%', color: 'bg-sky-400' },
    { name: 'Hibernating', cust: '1,973 (33.57%)', rev: '£626K (3.60%)', custW: '100%', revW: '5%', color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-3">
      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-white/10">
          <span className="text-[9px] text-slate-400 uppercase block">Total Customers</span>
          <span className="text-sm sm:text-base font-extrabold text-white font-mono">5,878</span>
          <span className="text-[9px] text-slate-500 block">2009–2011 Unique</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-indigo-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Total Revenue</span>
          <span className="text-sm sm:text-base font-extrabold text-indigo-300 font-mono">£17.37M</span>
          <span className="text-[9px] text-slate-500 block">£17,374,804</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-sky-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">Avg Monetary</span>
          <span className="text-sm sm:text-base font-extrabold text-sky-300 font-mono">£2,955.90</span>
          <span className="text-[9px] text-slate-500 block">Per customer</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-purple-400/30">
          <span className="text-[9px] text-slate-400 uppercase block">% Champions</span>
          <span className="text-sm sm:text-base font-extrabold text-purple-300 font-mono">20.5%</span>
          <span className="text-[9px] text-slate-500 block">1,203 VIP Cust</span>
        </div>
        <div className="bg-[#0e1a38] p-2.5 rounded-xl border border-amber-400/30 col-span-2 sm:col-span-1">
          <span className="text-[9px] text-slate-400 uppercase block">% At Risk (Priority)</span>
          <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">24.8%</span>
          <span className="text-[9px] text-slate-500 block">1,455 perlu retensi</span>
        </div>
      </div>

      {/* Segments Breakdown + Pareto Curve */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7 bg-[#0e1a38] p-3.5 rounded-xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">Distribusi Segmen & Kontribusi Revenue (K-Means K=4)</span>
            <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-400/20">
              RFM Model
            </span>
          </div>
          <div className="space-y-2.5 pt-1">
            {segments.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="text-slate-300 font-mono">Cust: {s.cust} • <strong className="text-indigo-300">Rev: {s.rev}</strong></span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: s.revW }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 bg-[#0e1a38] p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-white block">Kurva Pareto (Konsentrasi Revenue)</span>
              <span className="text-[10px] text-slate-400">23.04% customer teratas = 80% revenue</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              80/20 Rule
            </span>
          </div>

          <div className="w-full h-28 my-1 relative">
            <svg className="w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="paretoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M10,85 Q22,22 50,20 Q110,12 195,10 L195,85 Z"
                fill="url(#paretoGrad)"
              />
              <path
                d="M10,85 Q22,22 50,20 Q110,12 195,10"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              <line x1="50" y1="20" x2="50" y2="85" stroke="#38bdf8" strokeDasharray="3,3" strokeWidth="1.2" />
              <line x1="10" y1="20" x2="50" y2="20" stroke="#ef4444" strokeDasharray="3,3" strokeWidth="1.2" />
              <circle cx="50" cy="20" r="4" fill="#facc15" stroke="#0e1a38" strokeWidth="1.5" />
            </svg>
            <div className="absolute top-3 left-14 bg-[#091124]/90 border border-sky-400/40 px-2 py-0.5 rounded text-[9px] font-mono text-white">
              23.04% Cust = 80% Rev
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex justify-between border-t border-white/5 pt-1.5">
            <span>Scale: Log10 Freq vs Monetary</span>
            <span className="text-sky-300 font-mono">Cohort: 2009-12 – 2011-12</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardVisual({ project }) {
  return (
    <div className="w-full rounded-2xl bg-[#091124] border border-sky-500/25 p-3.5 sm:p-5 shadow-2xl shadow-sky-950/60 overflow-hidden relative group text-xs sm:text-sm select-none">
      {/* Background ambient glow */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dashboard Top Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
              {project.displayTitle}
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="block text-[10px] text-slate-400">{project.badge}</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30 text-[10px] font-mono">
          Interactive Summary
        </span>
      </div>

      {/* Render Project-Specific Interactive View */}
      {project.dashboardType === 'olist-sales' && <OlistSalesInteractive />}
      {project.dashboardType === 'marketing-funnel' && <MarketingFunnelInteractive />}
      {project.dashboardType === 'rfm-segmentation' && <RfmSegmentationInteractive />}
    </div>
  );
}
