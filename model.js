/* NISD analytics engine - JavaScript port of fsm.py
 *
 *   SOS = w_IV*IV + w_PG*PG + w_TR*TR + w_SE*SE      (default 0.35 / 0.30 / 0.20 / 0.15)
 *
 *   IV  normalised import value (0-10)      log10 min-max (default) or linear share of largest line
 *   PG  production gap % / 10               (0-10)
 *   TR  technology readiness                (0-10, as supplied)
 *   SE  strategic economic score            (0-10, as supplied)
 */
(function (root) {
  "use strict";

  const DEFAULT_WEIGHTS = { IV: 0.35, PG: 0.30, TR: 0.20, SE: 0.15 };
  const HIGH_PRIORITY_THRESHOLD = 7.0;
  const RAMP = [0.2, 0.5, 0.8, 1.0, 1.0]; // share of new capacity online in years 1..5

  const round = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Number.EPSILON) * f) / f; };

  /** Scale any weights so they sum to 1 (as fsm.score does). */
  function normaliseWeights(w) {
    const total = (w.IV + w.PG + w.TR + w.SE) || 1;
    return { IV: w.IV / total, PG: w.PG / total, TR: w.TR / total, SE: w.SE / total };
  }

  /** Normalised import value, 0-10. */
  function normaliseImportValue(values, method) {
    if (method === "linear") {
      const mx = Math.max.apply(null, values);
      return values.map(v => 10 * v / mx);
    }
    const lv = values.map(v => Math.log10(Math.max(v, 1)));
    const lo = Math.min.apply(null, lv), hi = Math.max.apply(null, lv);
    return lv.map(v => (hi > lo ? 10 * (v - lo) / (hi - lo) : 10));
  }

  /** Score + rank every product. Returns new array sorted by SOS (desc). */
  function score(products, weights, ivMethod) {
    const w = normaliseWeights(weights || DEFAULT_WEIGHTS);
    const iv = normaliseImportValue(products.map(p => p.avg_import_usd_mn), ivMethod || "log");
    const rows = products.map((p, i) => {
      const IV = round(iv[i], 2);
      const PG = round(p.prod_gap_pct / 10, 2);
      const TR = +p.tech_ready_score;
      const SE = +p.se_score;
      const SOS = round(w.IV * IV + w.PG * PG + w.TR * TR + w.SE * SE, 2);
      return Object.assign({}, p, {
        IV, PG, TR, SE, SOS,
        opportunity_usd_mn: round(p.avg_import_usd_mn * p.prod_gap_pct / 100, 1)
      });
    });
    // stable sort: SOS desc, then larger imports first (deterministic ties)
    rows.sort((a, b) => b.SOS - a.SOS || b.avg_import_usd_mn - a.avg_import_usd_mn);
    rows.forEach((r, i) => { r.rank = i + 1; });
    return rows;
  }

  /** Five-year projection of a tariff + investment-subsidy intervention (fsm.simulate). */
  function simulate(product, tariffPP, subsidyNgnBn, fxRate, o) {
    o = o || {};
    const m0 = +product.avg_import_usd_mn;
    const t0 = +(product.tariff_rate_pct || 0);
    const e = Math.abs(o.elasticity != null ? o.elasticity : product.import_elasticity);
    const orat = o.outputRatio != null ? o.outputRatio : product.output_ratio;
    const emp = o.employMultiplier != null ? o.employMultiplier : product.employ_multiplier;
    const indirectRatio = o.indirectRatio != null ? o.indirectRatio : 1.5;
    const years = o.years || 5;
    fxRate = fxRate || 1550;

    const subsidyUsdMn = subsidyNgnBn * 1e3 / fxRate;       // NGN bn -> USD mn
    const priceChange = tariffPP / (100 + t0);
    const fullTariffCut = Math.min(m0, m0 * e * priceChange);

    const rows = [];
    let cum = 0;
    for (let y = 1; y <= years; y++) {
      const ramp = RAMP[Math.min(y, RAMP.length) - 1];
      const tariffCut = fullTariffCut * (y === 1 ? 0.5 : 1.0);
      const newOutput = subsidyUsdMn * orat * ramp;
      const displaced = Math.max(0, Math.min(m0 - tariffCut, newOutput));
      const reduction = tariffCut + displaced;
      const importsAfter = m0 - reduction;
      cum += reduction;
      const direct = displaced * emp;
      const revChange = importsAfter * (t0 + tariffPP) / 100 - m0 * t0 / 100;
      const subsidyCost = subsidyUsdMn / years;
      rows.push({
        year: y,
        baseline: m0,
        importsAfter,
        reduction,
        fromTariff: tariffCut,
        fromOutput: displaced,
        fxSaving: reduction,
        cumFx: cum,
        directJobs: Math.round(direct),
        indirectJobs: Math.round(direct * indirectRatio),
        tariffRevenueChange: revChange,
        subsidyCost,
        netFiscal: revChange - subsidyCost
      });
    }
    return rows;
  }

  const api = { DEFAULT_WEIGHTS, HIGH_PRIORITY_THRESHOLD, normaliseWeights, normaliseImportValue, score, simulate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NISD = api;
})(typeof window !== "undefined" ? window : globalThis);
