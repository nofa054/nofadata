import json

with open(r'e:\Brazilian E-Commerce\dashboard_data.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

data_json_str = json.dumps(raw_data)

html = f"""<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brazilian E-Commerce Sales & Logistics Analysis</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {{
            --bg-main: #060B19;
            --bg-card: rgba(22, 33, 62, 0.75);
            --border-card: rgba(67, 97, 238, 0.25);
            --accent-cyan: #00F5D4;
            --accent-teal: #00BBF9;
            --accent-blue: #4361EE;
            --accent-purple: #7209B7;
            --status-ontime: #06D6A0;
            --status-late: #FF4D6D;
            --text-main: #FFFFFF;
            --text-muted: #94A3B8;
        }}
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
        }}
        body {{
            background-color: var(--bg-main);
            background-image: 
                radial-gradient(circle at 15% 15%, rgba(0, 245, 212, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 85% 20%, rgba(67, 97, 238, 0.12) 0%, transparent 45%),
                radial-gradient(circle at 50% 80%, rgba(114, 9, 183, 0.07) 0%, transparent 50%);
            background-attachment: fixed;
            color: var(--text-main);
            padding: 24px;
            min-height: 100vh;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
            padding-bottom: 18px;
            border-bottom: 1px solid rgba(67, 97, 238, 0.2);
            position: relative;
        }}
        .header::after {{
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 220px;
            height: 2px;
            background: linear-gradient(90deg, var(--accent-cyan), transparent);
        }}
        .header h1 {{
            font-size: 22px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: -0.4px;
        }}
        .header p {{
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }}
        .filters {{
            display: flex;
            gap: 8px;
            align-items: center;
            flex-shrink: 0;
        }}
        .filter-select {{
            background: linear-gradient(135deg, rgba(28, 37, 65, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
            color: var(--text-main);
            border: 1px solid rgba(67, 97, 238, 0.3);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        .filter-select:hover {{
            border-color: var(--accent-cyan);
            box-shadow: 0 0 10px rgba(0, 245, 212, 0.2);
        }}
        .kpi-row {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }}
        .kpi-card {{
            background: linear-gradient(145deg, rgba(26, 38, 68, 0.8) 0%, rgba(13, 20, 39, 0.9) 100%);
            border: 1px solid rgba(67, 97, 238, 0.25);
            border-radius: 14px;
            padding: 18px 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(8px);
            transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }}
        .kpi-card:hover {{
            transform: translateY(-4px);
            border-color: rgba(0, 245, 212, 0.5);
            box-shadow: 0 12px 28px rgba(0, 245, 212, 0.15);
        }}
        .kpi-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #00F5D4, #00BBF9);
        }}
        .kpi-card:nth-child(2)::before {{
            background: linear-gradient(90deg, #00BBF9, #4361EE);
        }}
        .kpi-card:nth-child(3)::before {{
            background: linear-gradient(90deg, #4361EE, #7209B7);
        }}
        .kpi-card:nth-child(4)::before {{
            background: linear-gradient(90deg, #7209B7, #F72585);
        }}
        .kpi-card:nth-child(5)::before {{
            background: linear-gradient(90deg, #F72585, #00F5D4);
        }}
        .kpi-title {{
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.9px;
            color: var(--text-muted);
            margin-bottom: 8px;
            font-weight: 600;
        }}
        .kpi-value {{
            font-size: 26px;
            font-weight: 700;
            color: var(--accent-cyan);
            letter-spacing: -0.5px;
            display: inline-block;
        }}
        .kpi-sub {{
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 6px;
        }}
        .grid-row {{
            display: grid;
            gap: 20px;
            margin-bottom: 20px;
        }}
        .row-1 {{
            grid-template-columns: 1.8fr 1.3fr 1fr;
        }}
        .row-2 {{
            grid-template-columns: 1.3fr 1.3fr 1.1fr;
        }}
        .chart-card {{
            background: linear-gradient(145deg, rgba(22, 33, 62, 0.75) 0%, rgba(11, 19, 43, 0.9) 100%);
            border: 1px solid rgba(67, 97, 238, 0.22);
            border-radius: 14px;
            padding: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(8px);
            display: flex;
            flex-direction: column;
            position: relative;
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }}
        .chart-card:hover {{
            border-color: rgba(0, 187, 249, 0.4);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }}
        .chart-header {{
            margin-bottom: 14px;
        }}
        .chart-title {{
            font-size: 14px;
            font-weight: 700;
            color: var(--text-main);
            letter-spacing: -0.2px;
        }}
        .chart-subtitle {{
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 2px;
        }}
        .chart-container {{
            position: relative;
            flex-grow: 1;
            min-height: 250px;
        }}

        @media (max-width: 1200px) {{
            .row-1 {{
                grid-template-columns: 1fr 1fr;
            }}
            .row-1 > :last-child {{
                grid-column: span 2;
            }}
            .row-2 {{
                grid-template-columns: 1fr 1fr;
            }}
            .row-2 > :last-child {{
                grid-column: span 2;
            }}
        }}

        @media (max-width: 900px) {{
            .header {{
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }}
            .filters {{
                width: 100%;
                flex-wrap: wrap;
            }}
        }}

        @media (max-width: 768px) {{
            body {{
                padding: 12px;
            }}
            .row-1, .row-2 {{
                grid-template-columns: 1fr !important;
            }}
            .row-1 > :last-child, .row-2 > :last-child {{
                grid-column: span 1 !important;
            }}
            .kpi-row {{
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 10px;
            }}
            .header h1 {{
                font-size: 20px;
            }}
            .chart-container {{
                min-height: 220px;
            }}
        }}
    </style>
</head>
<body>

    <div class="header">
        <div>
            <h1>Brazilian E-Commerce Sales & Logistics Analysis</h1>
            <p>Executive Dashboard • Brazilian E-Commerce Public Dataset by Olist (100k Orders)</p>
        </div>
        <div class="filters">
            <select class="filter-select">
                <option>Semua Tahun (All Years)</option>
                <option>2017</option>
                <option>2018</option>
            </select>
            <select class="filter-select">
                <option>Semua Kategori Produk</option>
            </select>
            <select class="filter-select">
                <option>Semua State (SP, RJ, MG, ...)</option>
            </select>
            <select class="filter-select">
                <option>Status: Delivered</option>
                <option>Semua Status</option>
            </select>
        </div>
    </div>

    <!-- KPI CARDS -->
    <div class="kpi-row">
        <div class="kpi-card">
            <div class="kpi-title">TOTAL REVENUE</div>
            <div class="kpi-value">R$ 15.84M</div>
            <div class="kpi-sub">Price + Freight Value</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">TOTAL ORDERS</div>
            <div class="kpi-value">98,666</div>
            <div class="kpi-sub">Unique Completed Orders</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">AVG ORDER VALUE (AOV)</div>
            <div class="kpi-value">R$ 160.58</div>
            <div class="kpi-sub">Revenue per Order</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">UNIQUE CUSTOMERS</div>
            <div class="kpi-value">95,420</div>
            <div class="kpi-sub">Active Buyers</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">AVG REVIEW SCORE</div>
            <div class="kpi-value" style="color: #06D6A0;">4.03 <span style="font-size: 16px; color: var(--text-muted);">/ 5.0</span></div>
            <div class="kpi-sub">Customer Satisfaction</div>
        </div>
    </div>

    <!-- ROW 1 -->
    <div class="grid-row row-1">
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">Tren Penjualan Bulanan (Revenue)</div>
                <div class="chart-subtitle">Perkembangan total omset 2017 - 2018</div>
            </div>
            <div class="chart-container">
                <canvas id="chartMonthly"></canvas>
            </div>
        </div>
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">Top 10 Kategori Produk by Revenue</div>
                <div class="chart-subtitle">Kategori penyumbang penjualan terbesar</div>
            </div>
            <div class="chart-container">
                <canvas id="chartCategory"></canvas>
            </div>
        </div>
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">Metode Pembayaran</div>
                <div class="chart-subtitle">Proporsi share nilai transaksi</div>
            </div>
            <div class="chart-container">
                <canvas id="chartPayment"></canvas>
            </div>
        </div>
    </div>

    <!-- ROW 2 -->
    <div class="grid-row row-2">
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">Total Revenue per State (Top 10)</div>
                <div class="chart-subtitle">Wilayah konsentrasi pembeli terbesar</div>
            </div>
            <div class="chart-container">
                <canvas id="chartState"></canvas>
            </div>
        </div>
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">Delivery Time: Aktual vs Estimasi (Hari)</div>
                <div class="chart-subtitle">Perbandingan durasi pengiriman per state</div>
            </div>
            <div class="chart-container">
                <canvas id="chartDelivery"></canvas>
            </div>
        </div>
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">Review Score: Tepat Waktu vs Terlambat</div>
                <div class="chart-subtitle">Dampak keterlambatan logistik terhadap kepuasan</div>
            </div>
            <div class="chart-container">
                <canvas id="chartReview"></canvas>
            </div>
        </div>
    </div>

    <script>
        const dashboardData = {data_json_str};

        // 1. Monthly Revenue Chart
        const monthlyMonths = dashboardData.monthly.map(d => d.order_purchase_month);
        const monthlyRevenue = dashboardData.monthly.map(d => d.item_total_revenue);

        const ctxMonthly = document.getElementById('chartMonthly').getContext('2d');
        const gradMonthly = ctxMonthly.createLinearGradient(0, 0, 0, 250);
        gradMonthly.addColorStop(0, 'rgba(0, 245, 212, 0.45)');
        gradMonthly.addColorStop(0.6, 'rgba(0, 187, 249, 0.15)');
        gradMonthly.addColorStop(1, 'rgba(0, 245, 212, 0.0)');

        new Chart(ctxMonthly, {{
            type: 'line',
            data: {{
                labels: monthlyMonths,
                datasets: [{{
                    label: 'Revenue (R$)',
                    data: monthlyRevenue,
                    borderColor: '#00F5D4',
                    backgroundColor: gradMonthly,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#00F5D4',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1.5
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{ display: false }}
                }},
                scales: {{
                    x: {{
                        grid: {{ color: 'rgba(67, 97, 238, 0.15)' }},
                        ticks: {{ color: '#8D99AE', font: {{ size: 10 }}, maxRotation: 45 }}
                    }},
                    y: {{
                        grid: {{ color: 'rgba(67, 97, 238, 0.15)' }},
                        ticks: {{
                            color: '#8D99AE',
                            font: {{ size: 10 }},
                            callback: val => 'R$ ' + (val/1000).toFixed(0) + 'k'
                        }}
                    }}
                }}
            }}
        }});

        // 2. Top Categories Bar Chart
        const ctxCat = document.getElementById('chartCategory').getContext('2d');
        const gradCat = ctxCat.createLinearGradient(0, 0, 400, 0);
        gradCat.addColorStop(0, '#00BBF9');
        gradCat.addColorStop(1, '#00F5D4');

        new Chart(ctxCat, {{
            type: 'bar',
            data: {{
                labels: dashboardData.top_categories.map(d => d.product_category),
                datasets: [{{
                    data: dashboardData.top_categories.map(d => d.item_total_revenue),
                    backgroundColor: gradCat,
                    borderRadius: 6
                }}]
            }},
            options: {{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{ legend: {{ display: false }} }},
                scales: {{
                    x: {{
                        grid: {{ color: 'rgba(67, 97, 238, 0.15)' }},
                        ticks: {{
                            color: '#8D99AE',
                            font: {{ size: 10 }},
                            callback: val => 'R$ ' + (val/1e6).toFixed(1) + 'M'
                        }}
                    }},
                    y: {{
                        grid: {{ display: false }},
                        ticks: {{ color: '#FFFFFF', font: {{ size: 11, weight: 500 }} }}
                    }}
                }}
            }}
        }});

        // 3. Payment Donut Chart
        new Chart(document.getElementById('chartPayment'), {{
            type: 'doughnut',
            data: {{
                labels: dashboardData.payments.map(d => d.payment_type),
                datasets: [{{
                    data: dashboardData.payments.map(d => d.item_total_revenue),
                    backgroundColor: ['#00F5D4', '#00BBF9', '#4361EE', '#FF4D6D', '#8D99AE'],
                    borderWidth: 2,
                    borderColor: '#16213E'
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{
                        position: 'bottom',
                        labels: {{ color: '#FFFFFF', boxWidth: 12, font: {{ size: 11 }} }}
                    }}
                }},
                cutout: '70%'
            }}
        }});

        // 4. State Revenue Bar Chart
        const ctxState = document.getElementById('chartState').getContext('2d');
        const gradState = ctxState.createLinearGradient(0, 0, 0, 250);
        gradState.addColorStop(0, '#00BBF9');
        gradState.addColorStop(1, '#4361EE');

        new Chart(ctxState, {{
            type: 'bar',
            data: {{
                labels: dashboardData.state_revenue.map(d => d.customer_state),
                datasets: [{{
                    data: dashboardData.state_revenue.map(d => d.item_total_revenue),
                    backgroundColor: gradState,
                    borderRadius: 6
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{ legend: {{ display: false }} }},
                scales: {{
                    x: {{
                        grid: {{ display: false }},
                        ticks: {{ color: '#FFFFFF', font: {{ size: 11, weight: 600 }} }}
                    }},
                    y: {{
                        grid: {{ color: 'rgba(67, 97, 238, 0.15)' }},
                        ticks: {{
                            color: '#8D99AE',
                            font: {{ size: 10 }},
                            callback: val => 'R$ ' + (val/1e6).toFixed(1) + 'M'
                        }}
                    }}
                }}
            }}
        }});

        // 5. Actual vs Estimated Delivery Time by State
        new Chart(document.getElementById('chartDelivery'), {{
            type: 'bar',
            data: {{
                labels: dashboardData.delivery_state.map(d => d.customer_state),
                datasets: [
                    {{
                        label: 'Aktual (Hari)',
                        data: dashboardData.delivery_state.map(d => d.actual_delivery_days.toFixed(1)),
                        backgroundColor: '#00F5D4',
                        borderRadius: 4
                    }},
                    {{
                        label: 'Estimasi (Hari)',
                        data: dashboardData.delivery_state.map(d => d.estimated_delivery_days.toFixed(1)),
                        backgroundColor: 'rgba(141, 153, 174, 0.3)',
                        borderRadius: 4
                    }}
                ]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{
                        position: 'top',
                        labels: {{ color: '#FFFFFF', boxWidth: 12, font: {{ size: 11 }} }}
                    }}
                }},
                scales: {{
                    x: {{
                        grid: {{ display: false }},
                        ticks: {{ color: '#FFFFFF', font: {{ size: 11 }} }}
                    }},
                    y: {{
                        grid: {{ color: 'rgba(67, 97, 238, 0.15)' }},
                        ticks: {{ color: '#8D99AE', font: {{ size: 10 }} }}
                    }}
                }}
            }}
        }});

        // 6. Review Score vs Delivery Delay Status
        const ctxRev = document.getElementById('chartReview').getContext('2d');
        const gradOnTime = ctxRev.createLinearGradient(0, 0, 0, 200);
        gradOnTime.addColorStop(0, '#00F5D4');
        gradOnTime.addColorStop(1, '#06D6A0');

        const gradLate = ctxRev.createLinearGradient(0, 0, 0, 200);
        gradLate.addColorStop(0, '#FF4D6D');
        gradLate.addColorStop(1, '#C9184A');

        new Chart(ctxRev, {{
            type: 'bar',
            data: {{
                labels: dashboardData.review_status.map(d => d.delivery_status),
                datasets: [{{
                    data: dashboardData.review_status.map(d => d.review_score.toFixed(2)),
                    backgroundColor: [gradLate, gradOnTime],
                    borderRadius: 8,
                    barThickness: 55
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{ display: false }}
                }},
                scales: {{
                    x: {{
                        grid: {{ display: false }},
                        ticks: {{ color: '#FFFFFF', font: {{ size: 12, weight: 'bold' }} }}
                    }},
                    y: {{
                        min: 0,
                        max: 5,
                        grid: {{ color: 'rgba(67, 97, 238, 0.15)' }},
                        ticks: {{ color: '#8D99AE', font: {{ size: 10 }} }}
                    }}
                }}
            }}
        }});
    </script>
</body>
</html>
"""

with open(r'e:\Brazilian E-Commerce\dashboard_preview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('SUCCESS')
