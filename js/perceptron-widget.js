document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const root = document.getElementById('perceptron-widget');
    if (!root) return;

    // ===== DOM =====
    const w1El = document.getElementById('p_w1');
    const w2El = document.getElementById('p_w2');
    const bEl  = document.getElementById('p_b');
    const w1Val = document.getElementById('p_w1Val');
    const w2Val = document.getElementById('p_w2Val');
    const bVal  = document.getElementById('p_bVal');

    const lrEl = document.getElementById('p_lr');
    const epEl = document.getElementById('p_ep');
    const lrVal = document.getElementById('p_lrVal');
    const epVal = document.getElementById('p_epVal');

    const probSel = document.getElementById('p_problem');
    const accEl = document.getElementById('p_acc');
    const showGridChk = document.getElementById('p_showGrid');
    const btnTrain = document.getElementById('p_btnTrain');
    const btnReset = document.getElementById('p_btnReset');

    const canvas = document.getElementById('perceptronCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ===== Espaço / escalas =====
    let W = canvas.width, H = canvas.height;
    const pad = 60;
    const xmin = -0.2, xmax = 1.2, ymin = -0.2, ymax = 1.2;

    const x2px = x => pad + (x - xmin) * (W - 2 * pad) / (xmax - xmin);
    const y2px = y => H - pad - (y - ymin) * (H - 2 * pad) / (ymax - ymin);

    function resizeForDPR() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = canvas.clientWidth;
      const cssH = Math.round(cssW * 0.58);
      canvas.style.height = cssH + "px";
      canvas.width  = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = cssW; H = cssH;
    }
    window.addEventListener('resize', () => { resizeForDPR(); drawAll(); });
    resizeForDPR();

    // ===== Datasets lógicos =====
    function datasetAND() { // (x1,x2) -> y
      return [
        {x1:0, x2:0, y:0},
        {x1:0, x2:1, y:0},
        {x1:1, x2:0, y:0},
        {x1:1, x2:1, y:1},
      ];
    }
    function datasetOR() {
      return [
        {x1:0, x2:0, y:0},
        {x1:0, x2:1, y:1},
        {x1:1, x2:0, y:1},
        {x1:1, x2:1, y:1},
      ];
    }
    function datasetXOR() {
      return [
        {x1:0, x2:0, y:0},
        {x1:0, x2:1, y:1},
        {x1:1, x2:0, y:1},
        {x1:1, x2:1, y:0},
      ];
    }
    function getData() {
      const p = probSel.value;
      if (p === 'AND') return datasetAND();
      if (p === 'OR')  return datasetOR();
      return datasetXOR();
    }

    // ===== Perceptron =====
    function step(z) { return z >= 0 ? 1 : 0; }
    function predict(x1, x2, w1, w2, b) { return step(w1 * x1 + w2 * x2 + b); }
    function accuracy(w1, w2, b) {
      const data = getData();
      let ok = 0;
      for (const d of data) ok += (predict(d.x1, d.x2, w1, w2, b) === d.y) ? 1 : 0;
      return ok / data.length;
    }
    function trainPerceptron(epochs, lr) {
      let w1 = parseFloat(w1El.value);
      let w2 = parseFloat(w2El.value);
      let b  = parseFloat(bEl.value);
      const data = getData();

      for (let ep = 0; ep < epochs; ep++) {
        for (const d of data) {
          const yhat = predict(d.x1, d.x2, w1, w2, b);
          const err = d.y - yhat;
          // regra do perceptron
          w1 += lr * err * d.x1;
          w2 += lr * err * d.x2;
          b  += lr * err;
        }
      }
      // atualiza sliders
      w1El.value = w1.toFixed(2);
      w2El.value = w2.toFixed(2);
      bEl.value  = b.toFixed(2);
    }

    // ===== Desenho =====
    function drawAxes() {
      ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
      // eixos
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(pad, pad); ctx.stroke();

      // ticks
      ctx.fillStyle = "#444"; ctx.font = "12px system-ui";
      for (let i = 0; i <= 6; i++) {
        const xv = xmin + i * (xmax - xmin) / 6;
        const yv = ymin + i * (ymax - ymin) / 6;
        const xp = x2px(xv), yp = y2px(yv);
        // x
        ctx.beginPath(); ctx.moveTo(xp, H - pad); ctx.lineTo(xp, H - pad + 5); ctx.stroke();
        ctx.fillText(xv.toFixed(1), xp - 10, H - pad + 18);
        // y
        ctx.beginPath(); ctx.moveTo(pad - 5, yp); ctx.lineTo(pad, yp); ctx.stroke();
        ctx.fillText(yv.toFixed(1), pad - 35, yp + 4);
      }

      // rótulos
      ctx.fillText("x₁", W - pad + 6, H - pad + 2);
      ctx.fillText("x₂", pad - 12, pad - 6);
    }

    function drawGrid() {
      if (!showGridChk.checked) return;
      ctx.strokeStyle = "#eee"; ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        const gx = pad + i * (W - 2 * pad) / 6;
        const gy = pad + i * (H - 2 * pad) / 6;
        ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, H - pad); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(W - pad, gy); ctx.stroke();
      }
    }

    function drawPoints() {
      const data = getData();
      for (const d of data) {
        ctx.fillStyle = d.y ? "#d62728" : "#1f77b4";
        ctx.beginPath();
        ctx.arc(x2px(d.x1), y2px(d.x2), 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.2)"; ctx.stroke();
      }
    }

    function drawDecisionBoundary(w1, w2, b) {
      // linha: w1*x + w2*y + b = 0 -> y = -(w1/w2)x - b/w2 (se w2 != 0)
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1.6;
      if (Math.abs(w2) > 1e-8) {
        const yA = x => (-(w1 * x + b)) / w2;
        ctx.beginPath();
        ctx.moveTo(x2px(xmin), y2px(yA(xmin)));
        ctx.lineTo(x2px(xmax), y2px(yA(xmax)));
        ctx.stroke();
      } else {
        // linha vertical: x = -b/w1
        const xV = -b / (w1 || 1e-8);
        ctx.beginPath();
        ctx.moveTo(x2px(xV), y2px(ymin));
        ctx.lineTo(x2px(xV), y2px(ymax));
        ctx.stroke();
      }
    }

    function drawAll() {
      const w1 = parseFloat(w1El.value);
      const w2 = parseFloat(w2El.value);
      const b  = parseFloat(bEl.value);

      w1Val.textContent = w1.toFixed(2);
      w2Val.textContent = w2.toFixed(2);
      bVal.textContent  = b.toFixed(2);
      lrVal.textContent = parseFloat(lrEl.value).toFixed(2);
      epVal.textContent = parseInt(epEl.value, 10);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawAxes();
      drawPoints();
      drawDecisionBoundary(w1, w2, b);

      const acc = accuracy(w1, w2, b);
      accEl.textContent = (acc * 100).toFixed(0) + "%";
    }

    // ===== Eventos =====
    [w1El, w2El, bEl, lrEl, epEl].forEach(el => el.addEventListener('input', drawAll));
    probSel.addEventListener('change', drawAll);
    showGridChk.addEventListener('change', drawAll);

    btnTrain.addEventListener('click', () => {
      btnTrain.disabled = true;
      trainPerceptron(parseInt(epEl.value, 10), parseFloat(lrEl.value));
      btnTrain.disabled = false;
      drawAll();
    });

    btnReset.addEventListener('click', () => {
      // preset bom para AND: w1=1, w2=1, b=-1.5
      w1El.value = "-0.7";
      w2El.value = "1.23";
      bEl.value  = "-0.27";
      lrEl.value = "0.05";
      epEl.value = "1";
      probSel.value = "AND";
      showGridChk.checked = true;
      drawAll();
    });

    // start
    btnReset.click();
    resizeForDPR();
    drawAll();
  })();
});
