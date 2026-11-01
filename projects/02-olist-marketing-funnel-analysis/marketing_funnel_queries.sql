-- =====================================================================
-- PORTFOLIO DATA ANALYST: MARKETING FUNNEL & CHANNEL PERFORMANCE
-- Database Engine: SQLite / PostgreSQL / MySQL Compatible
-- Dataset: Olist E-Commerce Marketing Funnel
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ANALISIS PERFORMA CHANNEL (ORIGIN): CONVERSION RATE & SALES CYCLE
-- Problem: Channel mana yang konversinya tertinggi dan sales cycle tercepat?
-- ---------------------------------------------------------------------
SELECT 
    origin AS marketing_channel,
    COUNT(mql_id) AS total_leads,
    SUM(is_won) AS won_deals,
    ROUND(CAST(SUM(is_won) AS FLOAT) / COUNT(mql_id) * 100, 2) AS conv_rate_pct,
    ROUND(AVG(CASE WHEN is_won = 1 THEN sales_cycle_days END), 1) AS avg_sales_cycle_days,
    -- Ranking performa konversi
    DENSE_RANK() OVER (ORDER BY CAST(SUM(is_won) AS FLOAT) / COUNT(mql_id) DESC) AS rank_conversion
FROM funnel
GROUP BY origin
ORDER BY conv_rate_pct DESC;


-- ---------------------------------------------------------------------
-- 2. TREN FUNNEL BULANAN (MONTHLY COHORT)
-- Problem: Bagaimana pertumbuhan volume lead dan deal dari waktu ke waktu?
-- ---------------------------------------------------------------------
SELECT 
    lead_month,
    COUNT(mql_id) AS total_leads,
    SUM(is_won) AS won_deals,
    COUNT(mql_id) - SUM(is_won) AS lost_or_pending_leads,
    ROUND(CAST(SUM(is_won) AS FLOAT) / COUNT(mql_id) * 100, 2) AS conv_rate_pct,
    -- Pertumbuhan volume leads MoM (Month-over-Month)
    ROUND(
        (CAST(COUNT(mql_id) AS FLOAT) - LAG(COUNT(mql_id)) OVER (ORDER BY lead_month)) 
        / LAG(COUNT(mql_id)) OVER (ORDER BY lead_month) * 100, 
        2
    ) AS leads_growth_mom_pct
FROM funnel
GROUP BY lead_month
ORDER BY lead_month ASC;


-- ---------------------------------------------------------------------
-- 3. PERFORMA LANDING PAGE (MINIMAL 30 LEADS)
-- Problem: Landing page mana yang paling efektif mengonversi prospek?
-- (Filter HAVING total_leads >= 30 untuk menghindari bias sampel kecil)
-- ---------------------------------------------------------------------
SELECT 
    landing_page_id,
    COUNT(mql_id) AS total_leads,
    SUM(is_won) AS won_deals,
    ROUND(CAST(SUM(is_won) AS FLOAT) / COUNT(mql_id) * 100, 2) AS conv_rate_pct,
    ROUND(AVG(CASE WHEN is_won = 1 THEN sales_cycle_days END), 1) AS avg_sales_cycle_days
FROM funnel
GROUP BY landing_page_id
HAVING total_leads >= 30
ORDER BY conv_rate_pct DESC
LIMIT 10;


-- ---------------------------------------------------------------------
-- 4. BREAKDOWN SEGMEN BISNIS & TIPE BISNIS (CLOSED DEALS)
-- Problem: Industri seller mana yang paling banyak closing?
-- ---------------------------------------------------------------------
SELECT 
    COALESCE(business_segment, 'unknown') AS business_segment,
    COALESCE(business_type, 'unknown') AS business_type,
    COUNT(mql_id) AS total_won_deals,
    ROUND(COUNT(mql_id) * 100.0 / (SELECT COUNT(*) FROM funnel WHERE is_won = 1), 2) AS pct_of_total_deals,
    ROUND(AVG(sales_cycle_days), 1) AS avg_sales_cycle_days
FROM funnel
WHERE is_won = 1
GROUP BY business_segment, business_type
ORDER BY total_won_deals DESC
LIMIT 15;


-- ---------------------------------------------------------------------
-- 5. AUDIT REVENUE & OUTLIER CHECK (KETERBATASAN DATA)
-- Problem: Mengapa revenue tidak dijadikan metrik utama alokasi budget?
-- ---------------------------------------------------------------------
SELECT 
    CASE 
        WHEN declared_monthly_revenue = 0 OR declared_monthly_revenue IS NULL THEN '0 / Not Declared'
        WHEN declared_monthly_revenue > 0 AND declared_monthly_revenue <= 50000 THEN 'Low (1 - 50k)'
        WHEN declared_monthly_revenue > 50000 AND declared_monthly_revenue <= 500000 THEN 'Mid (50k - 500k)'
        ELSE 'High (> 500k Outlier)'
    END AS revenue_tier,
    COUNT(*) AS total_deals,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM funnel WHERE is_won = 1), 2) AS pct_deals,
    ROUND(AVG(declared_monthly_revenue), 2) AS avg_revenue
FROM funnel
WHERE is_won = 1
GROUP BY revenue_tier
ORDER BY total_deals DESC;

