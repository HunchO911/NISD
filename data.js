/* NISD data - converted from the project CSVs (products.csv, annual_imports.csv, sector_imports.csv).
   Status of each column is documented in data/DATA_STATUS.md of the original project:
   se_score, tariff_rate_pct, import_elasticity, output_ratio, employ_multiplier are PLACEHOLDER values. */
window.NISD_DATA = {
PRODUCTS: [
 {
  "hs_code": "8502",
  "description": "Generating sets & rotary converters",
  "sector": "Electrical (HS 85)",
  "hs_chapter": 85,
  "avg_import_usd_mn": 1820,
  "prod_gap_pct": 91,
  "tech_ready_score": 7.2,
  "se_score": 9.0,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.8,
  "output_ratio": 1.3,
  "employ_multiplier": 35,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "3004",
  "description": "Medicaments packed for retail",
  "sector": "Pharmaceuticals (HS 30)",
  "hs_chapter": 30,
  "avg_import_usd_mn": 2100,
  "prod_gap_pct": 82,
  "tech_ready_score": 7.5,
  "se_score": 9.0,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.5,
  "output_ratio": 1.4,
  "employ_multiplier": 40,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "8432",
  "description": "Agricultural machinery for soil preparation",
  "sector": "Machinery (HS 84)",
  "hs_chapter": 84,
  "avg_import_usd_mn": 680,
  "prod_gap_pct": 94,
  "tech_ready_score": 6.8,
  "se_score": 8.0,
  "tariff_rate_pct": 5,
  "import_elasticity": -0.7,
  "output_ratio": 1.2,
  "employ_multiplier": 45,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "1001",
  "description": "Wheat and meslin",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 10,
  "avg_import_usd_mn": 2050,
  "prod_gap_pct": 97,
  "tech_ready_score": 8.0,
  "se_score": 9.5,
  "tariff_rate_pct": 5,
  "import_elasticity": -0.4,
  "output_ratio": 1.5,
  "employ_multiplier": 60,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "8413",
  "description": "Pumps for liquids",
  "sector": "Machinery (HS 84)",
  "hs_chapter": 84,
  "avg_import_usd_mn": 540,
  "prod_gap_pct": 89,
  "tech_ready_score": 6.6,
  "se_score": 7.0,
  "tariff_rate_pct": 10,
  "import_elasticity": -0.8,
  "output_ratio": 1.2,
  "employ_multiplier": 30,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "3002",
  "description": "Vaccines, blood, immunological products",
  "sector": "Pharmaceuticals (HS 30)",
  "hs_chapter": 30,
  "avg_import_usd_mn": 410,
  "prod_gap_pct": 88,
  "tech_ready_score": 6.0,
  "se_score": 9.0,
  "tariff_rate_pct": 5,
  "import_elasticity": -0.3,
  "output_ratio": 1.0,
  "employ_multiplier": 25,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "1701",
  "description": "Cane or beet sugar",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 17,
  "avg_import_usd_mn": 820,
  "prod_gap_pct": 78,
  "tech_ready_score": 7.0,
  "se_score": 8.5,
  "tariff_rate_pct": 10,
  "import_elasticity": -0.6,
  "output_ratio": 1.6,
  "employ_multiplier": 80,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "8501",
  "description": "Electric motors and generators",
  "sector": "Electrical (HS 85)",
  "hs_chapter": 85,
  "avg_import_usd_mn": 920,
  "prod_gap_pct": 86,
  "tech_ready_score": 6.4,
  "se_score": 7.0,
  "tariff_rate_pct": 10,
  "import_elasticity": -0.8,
  "output_ratio": 1.2,
  "employ_multiplier": 30,
  "priority_tier": "Tier 1 (Critical)"
 },
 {
  "hs_code": "0402",
  "description": "Milk and cream (concentrated)",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 4,
  "avg_import_usd_mn": 610,
  "prod_gap_pct": 83,
  "tech_ready_score": 6.8,
  "se_score": 8.0,
  "tariff_rate_pct": 10,
  "import_elasticity": -0.7,
  "output_ratio": 1.5,
  "employ_multiplier": 70,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "8544",
  "description": "Insulated wire, cable & conductors",
  "sector": "Electrical (HS 85)",
  "hs_chapter": 85,
  "avg_import_usd_mn": 780,
  "prod_gap_pct": 80,
  "tech_ready_score": 7.2,
  "se_score": 7.5,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.9,
  "output_ratio": 1.4,
  "employ_multiplier": 35,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "8471",
  "description": "ADP machines (computers, laptops)",
  "sector": "Machinery (HS 84)",
  "hs_chapter": 84,
  "avg_import_usd_mn": 1100,
  "prod_gap_pct": 92,
  "tech_ready_score": 5.8,
  "se_score": 6.0,
  "tariff_rate_pct": 5,
  "import_elasticity": -1.0,
  "output_ratio": 1.1,
  "employ_multiplier": 20,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "3003",
  "description": "Medicaments (unmixed products)",
  "sector": "Pharmaceuticals (HS 30)",
  "hs_chapter": 30,
  "avg_import_usd_mn": 320,
  "prod_gap_pct": 76,
  "tech_ready_score": 6.4,
  "se_score": 7.5,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.5,
  "output_ratio": 1.3,
  "employ_multiplier": 35,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "8517",
  "description": "Telephone handsets & smartphones",
  "sector": "Electrical (HS 85)",
  "hs_chapter": 85,
  "avg_import_usd_mn": 1800,
  "prod_gap_pct": 95,
  "tech_ready_score": 4.5,
  "se_score": 6.5,
  "tariff_rate_pct": 10,
  "import_elasticity": -1.1,
  "output_ratio": 1.0,
  "employ_multiplier": 15,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "1901",
  "description": "Food preparations (malt extracts, etc.)",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 19,
  "avg_import_usd_mn": 440,
  "prod_gap_pct": 74,
  "tech_ready_score": 7.0,
  "se_score": 7.0,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.8,
  "output_ratio": 1.5,
  "employ_multiplier": 55,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "8536",
  "description": "Electrical apparatus for circuits",
  "sector": "Electrical (HS 85)",
  "hs_chapter": 85,
  "avg_import_usd_mn": 620,
  "prod_gap_pct": 84,
  "tech_ready_score": 5.6,
  "se_score": 6.0,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.9,
  "output_ratio": 1.2,
  "employ_multiplier": 30,
  "priority_tier": "Tier 3 (Medium)"
 },
 {
  "hs_code": "1102",
  "description": "Cereal flours (non-wheat)",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 11,
  "avg_import_usd_mn": 190,
  "prod_gap_pct": 78,
  "tech_ready_score": 8.0,
  "se_score": 8.0,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.9,
  "output_ratio": 1.7,
  "employ_multiplier": 75,
  "priority_tier": "Tier 2 (High)"
 },
 {
  "hs_code": "3302",
  "description": "Mixtures of odoriferous substances (food ind.)",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 33,
  "avg_import_usd_mn": 280,
  "prod_gap_pct": 72,
  "tech_ready_score": 7.4,
  "se_score": 5.5,
  "tariff_rate_pct": 10,
  "import_elasticity": -0.7,
  "output_ratio": 1.3,
  "employ_multiplier": 30,
  "priority_tier": "Tier 3 (Medium)"
 },
 {
  "hs_code": "8535",
  "description": "Electrical apparatus, voltage > 1,000V",
  "sector": "Electrical (HS 85)",
  "hs_chapter": 85,
  "avg_import_usd_mn": 490,
  "prod_gap_pct": 82,
  "tech_ready_score": 5.2,
  "se_score": 6.0,
  "tariff_rate_pct": 10,
  "import_elasticity": -0.8,
  "output_ratio": 1.1,
  "employ_multiplier": 25,
  "priority_tier": "Tier 3 (Medium)"
 },
 {
  "hs_code": "2106",
  "description": "Food preparations NES",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 21,
  "avg_import_usd_mn": 360,
  "prod_gap_pct": 70,
  "tech_ready_score": 7.5,
  "se_score": 6.5,
  "tariff_rate_pct": 20,
  "import_elasticity": -0.8,
  "output_ratio": 1.5,
  "employ_multiplier": 55,
  "priority_tier": "Tier 3 (Medium)"
 },
 {
  "hs_code": "0802",
  "description": "Nuts (coconut, cashew, almond)",
  "sector": "Processed Agro-Foods",
  "hs_chapter": 8,
  "avg_import_usd_mn": 170,
  "prod_gap_pct": 68,
  "tech_ready_score": 8.5,
  "se_score": 7.0,
  "tariff_rate_pct": 20,
  "import_elasticity": -1.0,
  "output_ratio": 1.6,
  "employ_multiplier": 90,
  "priority_tier": "Tier 3 (Medium)"
 }
],
ANNUAL: [
 {
  "year": 2015,
  "total_imports_usd_bn": 46.2,
  "top_category": "Machinery (HS 84)",
  "ngn_usd_rate": 199,
  "mfg_gdp_share_pct": 9.1,
  "capacity_utilization_pct": 48,
  "is_projection": 0
 },
 {
  "year": 2016,
  "total_imports_usd_bn": 35.2,
  "top_category": "Fuel Products",
  "ngn_usd_rate": 305,
  "mfg_gdp_share_pct": 8.7,
  "capacity_utilization_pct": 44,
  "is_projection": 0
 },
 {
  "year": 2017,
  "total_imports_usd_bn": 42.8,
  "top_category": "Machinery (HS 84)",
  "ngn_usd_rate": 306,
  "mfg_gdp_share_pct": 9.0,
  "capacity_utilization_pct": 46,
  "is_projection": 0
 },
 {
  "year": 2018,
  "total_imports_usd_bn": 52.3,
  "top_category": "Machinery (HS 84)",
  "ngn_usd_rate": 307,
  "mfg_gdp_share_pct": 9.2,
  "capacity_utilization_pct": 50,
  "is_projection": 0
 },
 {
  "year": 2019,
  "total_imports_usd_bn": 55.1,
  "top_category": "Pharma/Machines",
  "ngn_usd_rate": 361,
  "mfg_gdp_share_pct": 9.0,
  "capacity_utilization_pct": 52,
  "is_projection": 0
 },
 {
  "year": 2020,
  "total_imports_usd_bn": 40.8,
  "top_category": "Food/Pharma",
  "ngn_usd_rate": 381,
  "mfg_gdp_share_pct": 8.6,
  "capacity_utilization_pct": 45,
  "is_projection": 0
 },
 {
  "year": 2021,
  "total_imports_usd_bn": 52.7,
  "top_category": "Machinery (HS 84)",
  "ngn_usd_rate": 410,
  "mfg_gdp_share_pct": 8.8,
  "capacity_utilization_pct": 49,
  "is_projection": 0
 },
 {
  "year": 2022,
  "total_imports_usd_bn": 60.4,
  "top_category": "Machinery (HS 84)",
  "ngn_usd_rate": 443,
  "mfg_gdp_share_pct": 9.1,
  "capacity_utilization_pct": 53,
  "is_projection": 0
 },
 {
  "year": 2023,
  "total_imports_usd_bn": 57.8,
  "top_category": "Machinery (HS 84)",
  "ngn_usd_rate": 757,
  "mfg_gdp_share_pct": 9.3,
  "capacity_utilization_pct": 51,
  "is_projection": 0
 },
 {
  "year": 2024,
  "total_imports_usd_bn": 54.2,
  "top_category": "Electrical (HS 85)",
  "ngn_usd_rate": 1480,
  "mfg_gdp_share_pct": 9.5,
  "capacity_utilization_pct": 54,
  "is_projection": 0
 },
 {
  "year": 2025,
  "total_imports_usd_bn": 58.0,
  "top_category": "Machinery/Electrical",
  "ngn_usd_rate": 1550,
  "mfg_gdp_share_pct": 9.6,
  "capacity_utilization_pct": 55,
  "is_projection": 1
 }
],
SECTOR_IMPORTS: [
 {
  "year": 2015,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 7.5,
  "domestic_production_usd_bn": 0.92
 },
 {
  "year": 2015,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 4.51,
  "domestic_production_usd_bn": 0.61
 },
 {
  "year": 2015,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 2.95,
  "domestic_production_usd_bn": 1.14
 },
 {
  "year": 2015,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 4.71,
  "domestic_production_usd_bn": 1.06
 },
 {
  "year": 2015,
  "sector": "All other goods",
  "import_usd_bn": 26.53,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2016,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 5.72,
  "domestic_production_usd_bn": 0.72
 },
 {
  "year": 2016,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 3.58,
  "domestic_production_usd_bn": 0.49
 },
 {
  "year": 2016,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 2.28,
  "domestic_production_usd_bn": 0.9
 },
 {
  "year": 2016,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 3.55,
  "domestic_production_usd_bn": 0.82
 },
 {
  "year": 2016,
  "sector": "All other goods",
  "import_usd_bn": 20.07,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2017,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 6.95,
  "domestic_production_usd_bn": 0.89
 },
 {
  "year": 2017,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 4.52,
  "domestic_production_usd_bn": 0.63
 },
 {
  "year": 2017,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 2.8,
  "domestic_production_usd_bn": 1.13
 },
 {
  "year": 2017,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 4.28,
  "domestic_production_usd_bn": 1.01
 },
 {
  "year": 2017,
  "sector": "All other goods",
  "import_usd_bn": 24.25,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2018,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 8.49,
  "domestic_production_usd_bn": 1.11
 },
 {
  "year": 2018,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 5.74,
  "domestic_production_usd_bn": 0.82
 },
 {
  "year": 2018,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 3.45,
  "domestic_production_usd_bn": 1.42
 },
 {
  "year": 2018,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.18,
  "domestic_production_usd_bn": 1.24
 },
 {
  "year": 2018,
  "sector": "All other goods",
  "import_usd_bn": 29.44,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2019,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 8.95,
  "domestic_production_usd_bn": 1.2
 },
 {
  "year": 2019,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 6.27,
  "domestic_production_usd_bn": 0.92
 },
 {
  "year": 2019,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 3.67,
  "domestic_production_usd_bn": 1.54
 },
 {
  "year": 2019,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.4,
  "domestic_production_usd_bn": 1.32
 },
 {
  "year": 2019,
  "sector": "All other goods",
  "import_usd_bn": 30.81,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2020,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 6.62,
  "domestic_production_usd_bn": 0.9
 },
 {
  "year": 2020,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 4.8,
  "domestic_production_usd_bn": 0.72
 },
 {
  "year": 2020,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 2.75,
  "domestic_production_usd_bn": 1.18
 },
 {
  "year": 2020,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 3.96,
  "domestic_production_usd_bn": 0.99
 },
 {
  "year": 2020,
  "sector": "All other goods",
  "import_usd_bn": 22.67,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2021,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 8.56,
  "domestic_production_usd_bn": 1.19
 },
 {
  "year": 2021,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 6.42,
  "domestic_production_usd_bn": 0.98
 },
 {
  "year": 2021,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 3.58,
  "domestic_production_usd_bn": 1.56
 },
 {
  "year": 2021,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.06,
  "domestic_production_usd_bn": 1.29
 },
 {
  "year": 2021,
  "sector": "All other goods",
  "import_usd_bn": 29.08,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2022,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 9.81,
  "domestic_production_usd_bn": 1.39
 },
 {
  "year": 2022,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 7.6,
  "domestic_production_usd_bn": 1.18
 },
 {
  "year": 2022,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 4.15,
  "domestic_production_usd_bn": 1.85
 },
 {
  "year": 2022,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.74,
  "domestic_production_usd_bn": 1.49
 },
 {
  "year": 2022,
  "sector": "All other goods",
  "import_usd_bn": 33.1,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2023,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 9.39,
  "domestic_production_usd_bn": 1.36
 },
 {
  "year": 2023,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 7.5,
  "domestic_production_usd_bn": 1.19
 },
 {
  "year": 2023,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 4.01,
  "domestic_production_usd_bn": 1.82
 },
 {
  "year": 2023,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.44,
  "domestic_production_usd_bn": 1.44
 },
 {
  "year": 2023,
  "sector": "All other goods",
  "import_usd_bn": 31.46,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2024,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 8.8,
  "domestic_production_usd_bn": 1.3
 },
 {
  "year": 2024,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 7.25,
  "domestic_production_usd_bn": 1.17
 },
 {
  "year": 2024,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 3.8,
  "domestic_production_usd_bn": 1.76
 },
 {
  "year": 2024,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.05,
  "domestic_production_usd_bn": 1.36
 },
 {
  "year": 2024,
  "sector": "All other goods",
  "import_usd_bn": 29.3,
  "domestic_production_usd_bn": null
 },
 {
  "year": 2025,
  "sector": "Machinery (HS 84)",
  "import_usd_bn": 9.42,
  "domestic_production_usd_bn": 1.41
 },
 {
  "year": 2025,
  "sector": "Electrical (HS 85)",
  "import_usd_bn": 7.99,
  "domestic_production_usd_bn": 1.31
 },
 {
  "year": 2025,
  "sector": "Pharmaceuticals (HS 30)",
  "import_usd_bn": 4.1,
  "domestic_production_usd_bn": 1.93
 },
 {
  "year": 2025,
  "sector": "Processed Agro-Foods",
  "import_usd_bn": 5.35,
  "domestic_production_usd_bn": 1.47
 },
 {
  "year": 2025,
  "sector": "All other goods",
  "import_usd_bn": 31.14,
  "domestic_production_usd_bn": null
 }
],
PRIORITY_SECTORS: ["Machinery (HS 84)","Electrical (HS 85)","Pharmaceuticals (HS 30)","Processed Agro-Foods"]
};
