document.addEventListener("DOMContentLoaded", function () {
  (function () {
    // ===== DOM =====
    const elK = document.getElementById('k');
    const kVal = document.getElementById('kVal');
    const elNoise = document.getElementById('noise');
    const noiseVal = document.getElementById('noiseVal');
    const wDistChk = document.getElementById('wdist');
    const shadeChk = document.getElementById('shade');
    const accEl = document.getElementById('acc');
    const btnRegen = document.getElementById('btnRegen');
    const btnReset = document.getElementById('btnReset');
    const canvas = document.getElementById('knnCanvas');
    if (!canvas) return;            // proteção: só roda se existir
    const ctx = canvas.getContext('2d');

    // ===== Espaço / canvas (HiDPI) =====
    let W = canvas.width, H = canvas.height;
    const pad = 48;
    const xmin = 0, xmax = 10, ymin = 0, ymax = 10;
    const x2px = x => pad + (x - xmin) * (W - 2 * pad) / (xmax - xmin);
    const y2px = y => H - pad - (y - ymin) * (H - 2 * pad) / (ymax - ymin);
    const px2x = px => xmin + (px - pad) * (xmax - xmin) / (W - 2 * pad);
    const py2y = py => ymin + (H - pad - py) * (ymax - ymin) / (H - 2 * pad);

    function resizeForDPR() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = canvas.clientWidth;
      const cssH = Math.round(cssW * 0.586);
      canvas.style.height = cssH + "px";
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = cssW; H = cssH;
    }
    window.addEventListener('resize', () => { resizeForDPR(); drawAll(); });

    // ===== RNG =====
    let seed = 42;
    function rand() { seed = (1664525 * seed + 1013904223) % 4294967296; return seed / 4294967296; }
    function randn() { let u = 0, v = 0; while (u === 0) u = rand(); while (v === 0) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

    // ===== Dataset =====
    let data = []; 
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function genData(noise = 1.0, nPerClass = 60) {
      const out = [];
      const c0 = { x: 3.2, y: 6.5 }, c1 = { x: 6.8, y: 3.5 };
      const baseStd = 0.9 * noise;
      for (let i = 0; i < nPerClass; i++) {
        out.push({ x: clamp(c0.x + randn() * baseStd, xmin, xmax), y: clamp(c0.y + randn() * baseStd, ymin, ymax), label: 0 });
        out.push({ x: clamp(c1.x + randn() * baseStd, xmin, xmax), y: clamp(c1.y + randn() * baseStd, ymin, ymax), label: 1 });
      }
      return out;
    }

    // ===== KNN =====
    function dist2(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
    function predictKNN(pt, k, weightByDist) {
      const ds = data.map(d => [dist2(pt, d), d.label]).sort((a, b) => a[0] - b[0]);
      let w0 = 0, w1 = 0;
      for (let i = 0; i < k && i < ds.length; i++) {
        const d2i = ds[i][0], lab = ds[i][1];
        let w = 1;
        if (weightByDist) w = 1.0 / (Math.sqrt(d2i) + 1e-9);
        if (lab === 0) w0 += w; else w1 += w;
      }
      return (w1 > w0) ? 1 : 0;
    }
    function accuracy(k, weightByDist) {
      let ok = 0;
      for (const d of data) {
        const backup = data;
        data = backup.filter(p => p !== d);
        const pred = predictKNN(d, k, weightByDist);
        data = backup;
        if (pred === d.label) ok++;
      }
      return ok / data.length;
    }

    // ===== Desenho =====
    function drawAxes() {
      ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(pad, pad); ctx.stroke();
      ctx.strokeStyle = "#eee";
      for (let i = 1; i < 10; i++) {
        const gx = pad + i * (W - 2 * pad) / 10;
        const gy = pad + i * (H - 2 * pad) / 10;
        ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, H - pad); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(W - pad, gy); ctx.stroke();
      }
      ctx.fillStyle = "#444"; ctx.font = "12px system-ui";
      ctx.fillText("x₁", W - pad + 6, H - pad + 2);
      ctx.fillText("x₂", pad - 12, pad - 6);
    }
    function drawRegion(k, weightByDist) {
      if (!shadeChk.checked) return;
      const step = 6;
      for (let py = pad; py <= H - pad; py += step) {
        for (let px = pad; px <= W - pad; px += step) {
          const x = px2x(px + step / 2), y = py2y(py + step / 2);
          const pred = predictKNN({ x, y }, k, weightByDist);
          ctx.fillStyle = (pred === 1) ? "rgba(214,39,40,.08)" : "rgba(31,119,180,.10)";
          ctx.fillRect(px, py, step, step);
        }
      }
    }
    function drawPoints() {
      for (const d of data) {
        ctx.fillStyle = (d.label === 1) ? "#d62728" : "#1f77b4";
        ctx.beginPath(); ctx.arc(x2px(d.x), y2px(d.y), 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.2)"; ctx.stroke();
      }
    }
    function drawAll() {
      const k = parseInt(elK.value, 10);
      const wdist = wDistChk.checked;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRegion(k, wdist);
      drawAxes();
      drawPoints();
      const acc = accuracy(k, wdist);
      accEl.textContent = (acc * 100).toFixed(1) + "%";
    }

    // ===== Eventos =====
    function updateK() { kVal.textContent = elK.value; drawAll(); }
    function updateNoise() { const nv = parseFloat(elNoise.value); noiseVal.textContent = nv.toFixed(2); data = genData(nv); drawAll(); }

    elK.addEventListener('input', updateK);
    elNoise.addEventListener('input', updateNoise);
    wDistChk.addEventListener('change', drawAll);
    shadeChk.addEventListener('change', drawAll);
    btnRegen.addEventListener('click', () => { seed = Math.floor(Math.random() * 1e9); data = genData(parseFloat(elNoise.value)); drawAll(); });
    btnReset.addEventListener('click', () => {
      elK.value = 5; kVal.textContent = "5";
      elNoise.value = 1.0; noiseVal.textContent = "1.00";
      wDistChk.checked = false; shadeChk.checked = true;
      seed = 42; data = genData(1.0); drawAll();
    });

    // ===== start =====
    data = genData(1.0);   
    resizeForDPR();        
    drawAll();          
  })();
});
