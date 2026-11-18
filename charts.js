/* Tiny dependency-free SVG charts (works fully offline, no CDN).
 * xyChart   : line | area | stack (stacked area) | bar | stackbar
 * radarChart: multi-series radar
 * waterfall : yearly increments building to a total
 */
(function (root) {
  "use strict";

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function niceScale(max, ticks) {
    ticks = ticks || 5;
    if (max <= 0) return { max: 1, step: 0.2 };
    const raw = max / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    return { max: Math.ceil(max / step) * step, step };
  }

  function legend(series) {
    return '<div class="legend">' + series.map(s =>
      `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("") + "</div>";
  }

  function tooltipEl(host) {
    let t = host.querySelector(".tip");
    if (!t) { t = document.createElement("div"); t.className = "tip"; host.appendChild(t); }
    return t;
  }
  function placeTip(host, tip, html, px, py) {
    tip.innerHTML = html; tip.style.display = "block";
    const hw = host.clientWidth, tw = tip.offsetWidth;
    let x = px + 14; if (x + tw > hw) x = px - tw - 14;
    tip.style.left = Math.max(4, x) + "px"; tip.style.top = Math.max(4, py - 10) + "px";
  }

  /* ------------------------------------------------------------- XY */
  function xyChart(host, o) {
    const mode = o.mode || "line";
    const W = host.clientWidth || 600, H = o.height || 300;
    const m = { l: 48, r: 16, t: 10, b: 28 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const n = o.labels.length, S = o.series;
    const stacked = mode === "stack" || mode === "stackbar";
    const isBar = mode === "bar" || mode === "stackbar";
    const fmt = o.yFmt || (v => v);

    // stack baselines
    const base = S.map(() => new Array(n).fill(0));
    if (stacked) for (let i = 0; i < n; i++) { let acc = 0; S.forEach((s, k) => { base[k][i] = acc; acc += s.values[i] || 0; }); }
    let dmax = 0;
    for (let i = 0; i < n; i++) {
      if (stacked) dmax = Math.max(dmax, S.reduce((a, s) => a + (s.values[i] || 0), 0));
      else S.forEach(s => { dmax = Math.max(dmax, s.values[i] || 0); });
    }
    const sc = niceScale(o.yMax || dmax * 1.04, 5);
    const y = v => m.t + ih - (v / sc.max) * ih;
    const x = i => isBar ? m.l + (i + 0.5) * (iw / n) : m.l + (n === 1 ? iw / 2 : i * iw / (n - 1));
    const bw = Math.min(46, (iw / n) * 0.62);

    let g = "";
    for (let v = 0; v <= sc.max + 1e-9; v += sc.step) {
      g += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>` +
           `<text class="ax" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`;
    }
    const skip = Math.ceil(n / Math.max(1, Math.floor(iw / 48)));
    o.labels.forEach((l, i) => {
      if (i % skip === 0) g += `<text class="ax" x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(l)}</text>`;
    });

    let body = "";
    S.forEach((s, k) => {
      if (isBar) {
        for (let i = 0; i < n; i++) {
          const v = s.values[i]; if (v == null) continue;
          const b0 = stacked ? base[k][i] : 0;
          const proj = o.projFrom != null && i >= o.projFrom;
          const bx = stacked ? x(i) - bw / 2 : x(i) - bw / 2 + (k * bw) / S.length;
          const w = stacked ? bw : bw / S.length - 1;
          body += `<rect x="${bx}" y="${y(b0 + v)}" width="${w}" height="${Math.max(0, y(b0) - y(b0 + v))}" rx="2" fill="${s.color}" opacity="${proj ? 0.5 : 1}"/>`;
        }
      } else {
        const top = s.values.map((v, i) => [x(i), y((stacked ? base[k][i] : 0) + (v || 0))]);
        if (mode === "area" || mode === "stack") {
          const bot = s.values.map((v, i) => [x(i), y(stacked ? base[k][i] : 0)]).reverse();
          const d = "M" + top.concat(bot).map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
          body += `<path d="${d}" fill="${s.color}" opacity="${mode === "stack" ? 0.88 : 0.16}"/>`;
        }
        if (mode !== "stack") {
          const cut = s.dashFrom != null ? s.dashFrom : n;       // index where dashed segment begins
          const solid = top.slice(0, Math.max(cut, 1));
          body += `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" points="${solid.map(p => p.join(",")).join(" ")}"/>`;
          if (cut < n) body += `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-dasharray="5 5" points="${top.slice(cut - 1).map(p => p.join(",")).join(" ")}"/>`;
          top.forEach((p, i) => { body += `<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="${s.color}" ${i >= cut ? 'fill-opacity="0.4"' : ""}/>`; });
        } else {
          const stroke = top.map(p => p.join(",")).join(" ");
          body += `<polyline fill="none" stroke="${s.color}" stroke-width="1" points="${stroke}" opacity=".9"/>`;
        }
      }
    });

    const guide = isBar ? "" : `<line class="guide" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" style="display:none"/>`;
    host.innerHTML = (o.legend === false ? "" : legend(S)) +
      `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.aria || "chart")}">${g}${body}${guide}` +
      `<rect class="hit" x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent"/></svg>`;

    const svg = host.querySelector("svg"), hit = svg.querySelector(".hit"), gl = svg.querySelector(".guide");
    const tip = tooltipEl(host);
    hit.addEventListener("mousemove", e => {
      const r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
      let i = isBar ? Math.floor((px - m.l) / (iw / n)) : Math.round((px - m.l) / (iw / (n - 1 || 1)));
      i = Math.max(0, Math.min(n - 1, i));
      if (gl) { gl.setAttribute("x1", x(i)); gl.setAttribute("x2", x(i)); gl.style.display = ""; }
      const tot = stacked ? `<div class="tr tot"><span>Total</span><b>${(o.tipFmt || fmt)(S.reduce((a, s) => a + (s.values[i] || 0), 0))}</b></div>` : "";
      const html = `<div class="th">${esc(o.labels[i])}${o.projFrom != null && i >= o.projFrom ? " (projection)" : ""}</div>` +
        S.map(s => `<div class="tr"><span><i style="background:${s.color}"></i>${esc(s.name)}</span><b>${s.values[i] == null ? "n/a" : (o.tipFmt || fmt)(s.values[i])}</b></div>`).join("") + tot;
      placeTip(host, tip, html, e.clientX - host.getBoundingClientRect().left, e.clientY - host.getBoundingClientRect().top);
    });
    hit.addEventListener("mouseleave", () => { tip.style.display = "none"; if (gl) gl.style.display = "none"; });
  }

  /* ------------------------------------------------------------- Radar */
  function radarChart(host, o) {
    const size = Math.min(host.clientWidth || 340, 380), H = size;
    const cx = size / 2, cy = H / 2 + 4, R = size / 2 - 84, n = o.axes.length, max = o.max || 10;
    const ang = i => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const pt = (i, v) => [cx + Math.cos(ang(i)) * R * v / max, cy + Math.sin(ang(i)) * R * v / max];
    let g = "";
    [0.25, 0.5, 0.75, 1].forEach(f => {
      g += `<polygon class="ring" points="${o.axes.map((_, i) => pt(i, max * f).join(",")).join(" ")}"/>`;
      g += `<text class="ax" x="${cx + 3}" y="${cy - R * f + 11}" style="font-size:9.5px">${+(max * f).toFixed(1)}</text>`;
    });
    o.axes.forEach((a, i) => {
      const p = pt(i, max), l = pt(i, max * 1.3);
      g += `<line class="grid" x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}"/>`;
      const anchor = Math.abs(l[0] - cx) < 6 ? "middle" : l[0] > cx ? "start" : "end";
      g += `<text class="axl" x="${l[0] + (anchor === "start" ? 2 : anchor === "end" ? -2 : 0)}" y="${l[1] + 4}" text-anchor="${anchor}">${esc(a)}</text>`;
    });
    o.series.forEach(s => {
      const pts = s.values.map((v, i) => pt(i, v));
      g += `<polygon points="${pts.map(p => p.join(",")).join(" ")}" fill="${s.color}" fill-opacity=".14" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round"/>`;
      pts.forEach(p => { g += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${s.color}"/>`; });
    });
    host.innerHTML = `<svg viewBox="0 0 ${size} ${H}" width="${size}" height="${H}" role="img" aria-label="${esc(o.aria || "radar chart")}">${g}</svg>`;
  }

  /* ------------------------------------------------------------- Waterfall */
  function waterfall(host, o) {
    const W = host.clientWidth || 500, H = o.height || 300;
    const m = { l: 52, r: 12, t: 22, b: 28 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    const vals = o.values, n = vals.length + 1;
    const total = vals.reduce((a, b) => a + b, 0);
    const sc = niceScale(Math.max(total, 1) * 1.08, 5);
    const y = v => m.t + ih - (v / sc.max) * ih;
    const band = iw / n, bw = Math.min(54, band * 0.62);
    const fmt = o.yFmt || (v => v);
    let g = "";
    for (let v = 0; v <= sc.max + 1e-9; v += sc.step)
      g += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`;
    let acc = 0;
    vals.forEach((v, i) => {
      const cx = m.l + (i + 0.5) * band;
      g += `<rect x="${cx - bw / 2}" y="${y(acc + v)}" width="${bw}" height="${Math.max(1, y(acc) - y(acc + v))}" rx="2" fill="${o.color}"/>`;
      if (i < vals.length - 1 || true) g += `<line class="conn" x1="${cx + bw / 2}" x2="${cx + band - bw / 2}" y1="${y(acc + v)}" y2="${y(acc + v)}"/>`;
      g += `<text class="val" x="${cx}" y="${y(acc + v) - 5}" text-anchor="middle">${(o.valFmt || fmt)(v)}</text>`;
      g += `<text class="ax" x="${cx}" y="${H - 8}" text-anchor="middle">${esc(o.labels[i])}</text>`;
      acc += v;
    });
    const cx = m.l + (n - 0.5) * band;
    g += `<rect x="${cx - bw / 2}" y="${y(total)}" width="${bw}" height="${Math.max(1, y(0) - y(total))}" rx="2" fill="${o.totalColor}"/>`;
    g += `<text class="val" x="${cx}" y="${y(total) - 5}" text-anchor="middle" style="font-weight:700">${(o.valFmt || fmt)(total)}</text>`;
    g += `<text class="ax" x="${cx}" y="${H - 8}" text-anchor="middle">5-yr total</text>`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.aria || "waterfall chart")}">${g}</svg>`;
  }

  root.Charts = { xyChart, radarChart, waterfall, legend };
})(window);
