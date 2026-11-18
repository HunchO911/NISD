/* NISD dashboard – UI logic. Depends on data.js, model.js, charts.js (all loaded from index.html). */
(function () {
  "use strict";

  const D = window.NISD_DATA, M = window.NISD, C = window.Charts;
  const P = D.PRODUCTS, ANNUAL = D.ANNUAL, SECTORS = D.PRIORITY_SECTORS;
  const SECTOR_COLOR = {
    "Machinery (HS 84)": "#5aa9e6",
    "Electrical (HS 85)": "#f2b84b",
    "Pharmaceuticals (HS 30)": "#e8737d",
    "Processed Agro-Foods": "#a8d65b"
  };
  const PICK_COLORS = ["#3fd28f", "#f2b84b", "#5aa9e6", "#e8737d"];
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nf = (v, d) => (+v).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  const signed = (v, d) => (v > 0 ? "+" : v < 0 ? "−" : "") + nf(Math.abs(v), d);

  const DEFAULT_RANK = {};
  M.score(P, M.DEFAULT_WEIGHTS, "log").forEach(r => { DEFAULT_RANK[r.hs_code] = r.rank; });

  /* ================================================================ routing */
  const views = ["overview", "ranker", "sim"];
  let current = "overview";

  function show(v) {
    if (views.indexOf(v) < 0) v = "overview";
    current = v;
    views.forEach(x => {
      $("view-" + x).classList.toggle("on", x === v);
    });
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("on", a.dataset.view === v));
    renderCurrent();
    window.scrollTo(0, 0);
  }
  function renderCurrent() {
    if (current === "overview") renderOverview();
    if (current === "ranker") { renderRanker(false); renderCompare(); }
    if (current === "sim") renderSim();
  }
  window.addEventListener("hashchange", () => show(location.hash.slice(1)));
  let rT; window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(renderCurrent, 150); });

  /* ================================================================ overview */
  function kpi(label, value, sub, cls, subCls) {
    return `<div class="kpi ${cls || ""}"><div class="kpi-l">${label}</div><div class="kpi-v">${value}</div><div class="kpi-s ${subCls || ""}">${sub}</div></div>`;
  }

  function renderOverview() {
    const last = ANNUAL[ANNUAL.length - 1], prev = ANNUAL[ANNUAL.length - 2];
    const yoy = (last.total_imports_usd_bn / prev.total_imports_usd_bn - 1) * 100;
    const avg = ANNUAL.reduce((a, r) => a + r.total_imports_usd_bn, 0) / ANNUAL.length;
    const cap = ANNUAL.reduce((a, r) => a + r.capacity_utilization_pct, 0) / ANNUAL.length;
    const scored = M.score(P, M.DEFAULT_WEIGHTS, "log");
    const targets = scored.filter(r => r.SOS > M.HIGH_PRIORITY_THRESHOLD).length;
    const opp = scored.reduce((a, r) => a + r.opportunity_usd_mn, 0) / 1000;

    $("kpis").innerHTML =
      kpi(`Total imports ${last.year}${last.is_projection ? "*" : ""}`, `${nf(last.total_imports_usd_bn, 1)}<small>USD bn</small>`,
        `${signed(yoy, 1)}% vs ${prev.year}`, "", yoy > 0 ? "up" : "dn") +
      kpi("Decade average", `${nf(avg, 1)}<small>USD bn</small>`, `${ANNUAL[0].year}–${last.year}`) +
      kpi("Capacity utilisation", `${nf(cap, 0)}<small>%</small>`, `average · ${last.capacity_utilization_pct}% in ${last.year}`) +
      kpi("Substitution opportunity", `${nf(opp, 1)}<small>USD bn</small>`, "per year, top-20 HS lines", "hl") +
      kpi("High-priority targets", `${targets}<small>of ${P.length}</small>`, `SOS above ${M.HIGH_PRIORITY_THRESHOLD.toFixed(1)}, default weights`, "hl");

    const years = ANNUAL.map(r => String(r.year));
    const proj = ANNUAL.findIndex(r => r.is_projection);
    C.xyChart($("chImports"), {
      mode: "area", labels: years, height: 290, legend: false, aria: "Total imports by year",
      series: [{ name: "Total imports", color: "#3fd28f", values: ANNUAL.map(r => r.total_imports_usd_bn), dashFrom: proj < 0 ? null : proj }],
      yFmt: v => nf(v, 0), tipFmt: v => "USD " + nf(v, 1) + " bn", projFrom: proj < 0 ? null : proj
    });

    C.xyChart($("chSectors"), {
      mode: "stack", labels: years, height: 290, aria: "Imports by priority sector",
      series: SECTORS.map(s => ({
        name: s, color: SECTOR_COLOR[s],
        values: ANNUAL.map(a => { const r = D.SECTOR_IMPORTS.find(x => x.year === a.year && x.sector === s); return r ? r.import_usd_bn : 0; })
      })),
      yFmt: v => nf(v, 0), tipFmt: v => "USD " + nf(v, 1) + " bn", projFrom: proj < 0 ? null : proj
    });

    C.xyChart($("chCapacity"), {
      mode: "bar", labels: years, height: 290, legend: false, aria: "Capacity utilisation by year", yMax: 70,
      series: [{ name: "Capacity utilisation", color: "#5aa9e6", values: ANNUAL.map(r => r.capacity_utilization_pct) }],
      yFmt: v => nf(v, 0) + "%", tipFmt: v => v + "%", projFrom: proj < 0 ? null : proj
    });

    $("top5").innerHTML = scored.slice(0, 5).map(r =>
      `<li><span class="n">${r.rank}</span><span class="d"><b>${esc(r.description)}</b><small>HS ${r.hs_code} · ${esc(r.sector)} · USD ${nf(r.avg_import_usd_mn)} mn imports, ${r.prod_gap_pct}% gap</small></span><span class="s">${r.SOS.toFixed(2)}</span></li>`
    ).join("");
  }

  /* ================================================================ ranker */
  const PRESETS = {
    default: { IV: 35, PG: 30, TR: 20, SE: 15 },
    equal: { IV: 25, PG: 25, TR: 25, SE: 25 },
    value: { IV: 50, PG: 25, TR: 15, SE: 10 },
    ready: { IV: 15, PG: 20, TR: 45, SE: 20 }
  };
  const rk = {
    w: Object.assign({}, PRESETS.default),
    iv: "log",
    sector: "All",
    sort: { key: "SOS", dir: -1 },
    picks: ["8502", "3004", "1001"]
  };

  function weightsUI() {
    const tot = rk.w.IV + rk.w.PG + rk.w.TR + rk.w.SE;
    ["IV", "PG", "TR", "SE"].forEach(k => {
      const el = $("w_" + k);
      el.value = rk.w[k];
      el.style.setProperty("--p", (rk.w[k] / (+el.max)) * 100 + "%");
      $("o_" + k).textContent = tot ? nf(rk.w[k] / tot * 100, 0) + "%" : "0%";
    });
    const nw = M.normaliseWeights(rk.w);
    $("formula").innerHTML = tot
      ? `SOS = <b>${nw.IV.toFixed(2)}</b>·IV + <b>${nw.PG.toFixed(2)}</b>·PG + <b>${nw.TR.toFixed(2)}</b>·TR + <b>${nw.SE.toFixed(2)}</b>·SE`
      : "All weights are zero, so every product scores 0.";
  }

  function scoredRows() {
    const rows = M.score(P, rk.w, rk.iv);
    rows.forEach(r => { r.delta = DEFAULT_RANK[r.hs_code] - r.rank; });
    return rows;
  }

  function renderRanker(animate) {
    weightsUI();
    const all = scoredRows();
    let rows = rk.sector === "All" ? all.slice() : all.filter(r => r.sector === rk.sector);
    const { key, dir } = rk.sort;
    rows.sort((a, b) => {
      let x = a[key], y = b[key];
      if (key === "rank") { x = a.rank; y = b.rank; }
      if (typeof x === "string") return x.localeCompare(y) * dir;
      return (x - y) * dir || a.rank - b.rank;
    });
    if (key === "rank") rows.sort((a, b) => (a.rank - b.rank) * dir);

    // FLIP: remember where each row was
    const before = {};
    if (animate && !REDUCED) $("rankBody").querySelectorAll("tr").forEach(tr => { before[tr.dataset.hs] = tr.getBoundingClientRect().top; });
    const focusHs = document.activeElement && document.activeElement.dataset && document.activeElement.type === "checkbox" ? document.activeElement.dataset.hs : null;

    const full = rk.picks.length >= 4;
    $("rankBody").innerHTML = rows.map(r => {
      const pi = rk.picks.indexOf(r.hs_code), picked = pi >= 0;
      const mv = r.delta > 0 ? `<span class="mv u">▲ ${r.delta}</span>` : r.delta < 0 ? `<span class="mv d">▼ ${-r.delta}</span>` : `<span class="mv z">–</span>`;
      return `<tr data-hs="${r.hs_code}" class="${picked ? "picked" : ""}">
        <td class="c-sel"><input type="checkbox" data-hs="${r.hs_code}" ${picked ? "checked" : ""} ${!picked && full ? "disabled" : ""} aria-label="Compare ${esc(r.description)}"></td>
        <td class="c-rank">${r.rank}</td>
        <td class="prod"><b>${picked ? `<i class="chip" style="background:${PICK_COLORS[pi]}"></i>` : ""}${esc(r.description)}</b><small>HS ${r.hs_code} · <span class="chip" style="background:${SECTOR_COLOR[r.sector]};margin-right:4px"></span>${esc(r.sector)}</small></td>
        <td class="num">${nf(r.avg_import_usd_mn)}</td>
        <td class="num">${r.prod_gap_pct}</td>
        <td class="num">${r.IV.toFixed(2)}</td>
        <td class="num">${r.PG.toFixed(2)}</td>
        <td class="num">${r.TR.toFixed(1)}</td>
        <td class="num">${r.SE.toFixed(1)}</td>
        <td class="c-sos"><div class="sos"><span class="v">${r.SOS.toFixed(2)}</span><span class="bar"><i class="${r.SOS > M.HIGH_PRIORITY_THRESHOLD ? "" : "low"}" style="width:${Math.max(0, Math.min(100, r.SOS * 10))}%"></i><s></s></span></div></td>
        <td class="num">${mv}</td></tr>`;
    }).join("");

    if (animate && !REDUCED) {
      $("rankBody").querySelectorAll("tr").forEach(tr => {
        const old = before[tr.dataset.hs]; if (old == null) return;
        const dy = old - tr.getBoundingClientRect().top;
        if (Math.abs(dy) < 2) return;
        tr.style.transition = "none"; tr.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { tr.style.transition = "transform .38s cubic-bezier(.2,.7,.2,1), background .15s"; tr.style.transform = ""; }));
      });
    }
    if (focusHs) { const f = $("rankBody").querySelector(`input[data-hs="${focusHs}"]`); if (f) f.focus(); }

    document.querySelectorAll("#rankTable th[data-sort]").forEach(th => {
      const on = th.dataset.sort === key;
      th.classList.toggle("sorted", on); th.classList.toggle("asc", on && dir === 1);
    });
    const hp = all.filter(r => r.SOS > M.HIGH_PRIORITY_THRESHOLD).length;
    $("tblTitle").textContent = rk.sector === "All" ? "All 20 products" : rk.sector;
    $("tblSub").textContent = `${hp} of ${all.length} above the ${M.HIGH_PRIORITY_THRESHOLD.toFixed(1)} high-priority line · ${rk.iv === "log" ? "log" : "linear"} import scaling`;
  }

  function renderCompare() {
    const all = scoredRows();
    const sel = rk.picks.map(h => all.find(r => r.hs_code === h)).filter(Boolean);
    $("cmpSub").textContent = sel.length < 2 ? "tick at least two products in the table" : `${sel.length} of 4 selected`;
    if (!sel.length) {
      $("chRadar").innerHTML = '<div class="empty">No product selected.</div>'; $("cmpTable").innerHTML = ""; return;
    }
    const series = sel.map((r, i) => ({ name: `${r.description} (${r.hs_code})`, color: PICK_COLORS[i], values: [r.IV, r.PG, r.TR, r.SE] }));
    const box = $("chRadar");
    box.innerHTML = '<div id="radarSvg" style="width:100%"></div><div id="radarLegend"></div>';
    C.radarChart($("radarSvg"), { axes: ["Import value", "Prod. gap", "Tech ready", "Strategic"], series, max: 10, aria: "Radar comparison of selected products" });
    $("radarLegend").innerHTML = C.legend(series);

    const best = k => Math.max.apply(null, sel.map(r => r[k]));
    $("cmpTable").innerHTML = `<table class="plain"><thead><tr><th>Product</th><th>IV</th><th>PG</th><th>TR</th><th>SE</th><th>SOS</th><th>Rank</th></tr></thead><tbody>` +
      sel.map((r, i) => `<tr><td class="nm"><i class="chip" style="background:${PICK_COLORS[i]}"></i>${esc(r.description)}<br><small>HS ${r.hs_code}</small></td>` +
        ["IV", "PG", "TR", "SE", "SOS"].map(k => `<td class="${sel.length > 1 && r[k] === best(k) ? "best" : ""}">${r[k].toFixed(k === "TR" || k === "SE" ? 1 : 2)}</td>`).join("") +
        `<td>${r.rank}</td></tr>`).join("") + "</tbody></table>";
  }

  function initRanker() {
    const sel = $("sectorFilter");
    sel.innerHTML = '<option value="All">All sectors</option>' + SECTORS.map(s => `<option>${esc(s)}</option>`).join("");
    sel.addEventListener("change", () => { rk.sector = sel.value; renderRanker(false); });

    ["IV", "PG", "TR", "SE"].forEach(k => {
      $("w_" + k).addEventListener("input", e => { rk.w[k] = +e.target.value; renderRanker(true); renderCompare(); });
    });
    document.querySelectorAll("[data-preset]").forEach(b => b.addEventListener("click", () => {
      rk.w = Object.assign({}, PRESETS[b.dataset.preset]); renderRanker(true); renderCompare();
    }));
    document.querySelectorAll("[data-iv]").forEach(b => b.addEventListener("click", () => {
      rk.iv = b.dataset.iv;
      document.querySelectorAll("[data-iv]").forEach(x => x.classList.toggle("on", x === b));
      renderRanker(true); renderCompare();
    }));
    document.querySelectorAll("#rankTable th[data-sort]").forEach(th => th.addEventListener("click", () => {
      const k = th.dataset.sort;
      rk.sort = rk.sort.key === k ? { key: k, dir: -rk.sort.dir } : { key: k, dir: (k === "description" || k === "rank") ? 1 : -1 };
      renderRanker(true);
    }));
    $("rankBody").addEventListener("change", e => {
      if (e.target.type !== "checkbox") return;
      const h = e.target.dataset.hs, i = rk.picks.indexOf(h);
      if (e.target.checked && i < 0 && rk.picks.length < 4) rk.picks.push(h);
      if (!e.target.checked && i >= 0) rk.picks.splice(i, 1);
      renderRanker(false); renderCompare();
    });
  }

  /* ================================================================ simulation */
  const scn = [];
  const FX_NOW = ANNUAL[ANNUAL.length - 1].ngn_usd_rate;
  let lastSim = null;

  function simProduct() { return P.find(p => p.hs_code === $("simProduct").value); }

  function loadDefaults() {
    const p = simProduct();
    $("simEl").value = p.import_elasticity; $("simOr").value = p.output_ratio; $("simEm").value = p.employ_multiplier;
    $("simBase").textContent = `Baseline imports USD ${nf(p.avg_import_usd_mn)} mn a year · current tariff ${p.tariff_rate_pct}% · production gap ${p.prod_gap_pct}%`;
  }

  function simInputs() {
    return {
      p: simProduct(),
      t: +$("simTariff").value, s: +$("simSubsidy").value,
      fx: +$("simFx").value || FX_NOW,
      o: { elasticity: parseFloat($("simEl").value), outputRatio: parseFloat($("simOr").value), employMultiplier: parseFloat($("simEm").value) }
    };
  }

  function renderSim() {
    const i = simInputs();
    ["simTariff", "simSubsidy"].forEach(id => { const el = $(id); el.style.setProperty("--p", (el.value / el.max) * 100 + "%"); });
    $("o_simTariff").textContent = "+" + i.t + " pp";
    $("o_simSubsidy").textContent = "NGN " + nf(i.s) + " bn";

    const rows = M.simulate(i.p, i.t, i.s, i.fx, i.o);
    lastSim = { i, rows };
    const y5 = rows[4], net = rows.reduce((a, r) => a + r.netFiscal, 0);

    $("simKpis").innerHTML =
      kpi("Import reduction, year 5", `${nf(y5.reduction)}<small>USD mn</small>`, `${nf(y5.reduction / y5.baseline * 100, 1)}% of baseline imports`, "hl") +
      kpi("Cumulative FX saving", `${nf(y5.cumFx)}<small>USD mn</small>`, "over five years", "hl") +
      kpi("Jobs created, year 5", nf(y5.directJobs), `+${nf(y5.indirectJobs)} indirect`) +
      kpi("Net fiscal impact", `${signed(net, 0)}<small>USD mn</small>`, "tariff revenue change less subsidy cost", "", net < 0 ? "up" : "dn");

    const yl = rows.map(r => "Yr " + r.year);
    C.waterfall($("chFx"), { labels: yl, values: rows.map(r => r.fxSaving), color: "#3fd28f", totalColor: "#5aa9e6", height: 300, yFmt: v => nf(v), aria: "Foreign exchange savings by year" });
    C.xyChart($("chJobs"), {
      mode: "stackbar", labels: yl, height: 300, aria: "Jobs created by year",
      series: [{ name: "Direct", color: "#5aa9e6", values: rows.map(r => r.directJobs) }, { name: "Indirect", color: "#f2b84b", values: rows.map(r => r.indirectJobs) }],
      yFmt: v => v >= 1000 ? nf(v / 1000, v % 1000 ? 1 : 0) + "k" : nf(v), tipFmt: v => nf(v) + " jobs"
    });

    const hd = ["Year", "Imports after", "Cut via tariff", "Cut via local output", "FX saving", "Direct jobs", "Tariff revenue Δ", "Subsidy cost", "Net fiscal"];
    $("simTable").innerHTML = "<thead><tr>" + hd.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>" +
      rows.map(r => `<tr><td>Year ${r.year}</td><td>${nf(r.importsAfter, 1)}</td><td>${nf(r.fromTariff, 1)}</td><td>${nf(r.fromOutput, 1)}</td><td>${nf(r.fxSaving, 1)}</td><td>${nf(r.directJobs)}</td><td>${signed(r.tariffRevenueChange, 1)}</td><td>${nf(r.subsidyCost, 1)}</td><td>${signed(r.netFiscal, 1)}</td></tr>`).join("") + "</tbody>";
    renderScenarios();
  }

  function renderScenarios() {
    const hd = ["Scenario", "Import reduction", "% of baseline", "Cumulative FX saving", "Direct jobs", "Total jobs", "Net fiscal (5-yr)"];
    if (!scn.length) { $("scnTable").innerHTML = `<tbody><tr><td class="empty" colspan="7" style="text-align:center">Nothing saved yet. Set the levers and choose “Save as scenario” to compare options side by side.</td></tr></tbody>`; return; }
    const best = k => Math.max.apply(null, scn.map(s => s[k]));
    $("scnTable").innerHTML = "<thead><tr>" + hd.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>" +
      scn.map(s => `<tr><td>${esc(s.name)}</td><td class="${s.red === best("red") ? "best" : ""}">${nf(s.red)}</td><td>${nf(s.pct, 1)}%</td><td class="${s.cum === best("cum") ? "best" : ""}">${nf(s.cum)}</td><td>${nf(s.direct)}</td><td class="${s.jobs === best("jobs") ? "best" : ""}">${nf(s.jobs)}</td><td>${signed(s.net, 0)}</td></tr>`).join("") + "</tbody>";
  }

  function initSim() {
    const ranked = M.score(P, M.DEFAULT_WEIGHTS, "log");
    $("simProduct").innerHTML = ranked.map(r => `<option value="${r.hs_code}">${r.rank}. ${esc(r.description)} (HS ${r.hs_code})</option>`).join("");
    $("simFx").value = FX_NOW;
    loadDefaults();
    $("simProduct").addEventListener("change", () => { loadDefaults(); renderSim(); });
    ["simTariff", "simSubsidy", "simFx", "simEl", "simOr", "simEm"].forEach(id => $(id).addEventListener("input", renderSim));

    $("simSave").addEventListener("click", () => {
      if (!lastSim) return;
      const { i, rows } = lastSim, y5 = rows[4];
      if (scn.length >= 6) scn.shift();
      scn.push({
        name: `${i.p.description} · +${i.t} pp tariff · NGN ${nf(i.s)} bn`,
        red: y5.reduction, pct: y5.reduction / y5.baseline * 100, cum: y5.cumFx,
        direct: y5.directJobs, jobs: y5.directJobs + y5.indirectJobs, net: rows.reduce((a, r) => a + r.netFiscal, 0)
      });
      renderScenarios();
    });
    $("simClear").addEventListener("click", () => { scn.length = 0; renderScenarios(); });
    $("simCsv").addEventListener("click", () => {
      if (!lastSim) return;
      const h = ["year", "baseline_imports_usd_mn", "imports_after_usd_mn", "import_reduction_usd_mn", "of_which_tariff_usd_mn", "of_which_domestic_output_usd_mn", "cumulative_fx_saving_usd_mn", "direct_jobs", "indirect_jobs", "tariff_revenue_change_usd_mn", "subsidy_cost_usd_mn", "net_fiscal_impact_usd_mn"];
      const f = r => [r.year, r.baseline, r.importsAfter, r.reduction, r.fromTariff, r.fromOutput, r.cumFx, r.directJobs, r.indirectJobs, r.tariffRevenueChange, r.subsidyCost, r.netFiscal].map((v, k) => k === 0 ? v : (+v).toFixed(2)).join(",");
      const csv = h.join(",") + "\n" + lastSim.rows.map(f).join("\n") + "\n";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `simulation_${lastSim.i.p.hs_code}.csv`; document.body.appendChild(a); a.click(); a.remove();
    });
  }

  /* ================================================================ theme */
  function initTheme() {
    let t = "dark";
    try { t = localStorage.getItem("nisd-theme") || "dark"; } catch (e) { /* file:// may block storage */ }
    const apply = v => {
      document.documentElement.dataset.theme = v;
      $("themeBtn").textContent = v === "dark" ? "Switch to light theme" : "Switch to dark theme";
      try { localStorage.setItem("nisd-theme", v); } catch (e) { /* ignore */ }
    };
    apply(t);
    $("themeBtn").addEventListener("click", () => apply(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  }

  /* ================================================================ boot */
  initTheme(); initRanker(); initSim();
  show(location.hash.slice(1) || "overview");
})();
