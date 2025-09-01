document.addEventListener("DOMContentLoaded", function () {
  // se a página não tem o widget, não faz nada
  const canvas = document.getElementById('plot');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return; // (defensivo) se o browser não deu contexto

  // ===== Elementos do DOM =====
  const elW = document.getElementById('w');
  const elB = document.getElementById('b');
  const wVal = document.getElementById('wVal');
  const bVal = document.getElementById('bVal');
  const mseEl = document.getElementById('mse');
  const eqnEl = document.getElementById('eqn');
  const residChk = document.getElementById('resid');
  const btnFit = document.getElementById('btnFit');
  const btnReset = document.getElementById('btnReset');

  // ===== Dataset (peso vs mpg) =====
  const data = [
    [1.9,36],[2.1,34],[2.2,33],[2.4,31],[2.6,30],
    [2.8,28],[3.0,27],[3.2,25],[3.4,24],[3.6,23],
    [3.8,22],[4.0,21],[4.2,20],[4.4,19],[4.6,18],
    [4.8,17],[5.0,16],[5.2,15],[5.4,15],[5.6,14]
  ];
  const xs = data.map(d=>d[0]), ys = data.map(d=>d[1]);

  // ===== Escalas =====
  const pad = 55;
  let W = canvas.width, H = canvas.height;

  // HiDPI/retina: ajusta pixel ratio
  function resizeForDPR() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth;
    const cssH = Math.round(cssW * 0.48); // proporção
    canvas.style.height = cssH + "px";
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = cssW; H = cssH;
  }
  resizeForDPR();
  window.addEventListener('resize', () => { resizeForDPR(); update(); });

  const xmin = Math.min(...xs)-0.2, xmax = Math.max(...xs)+0.2;
  const ymin = Math.min(...ys)-2,  ymax = Math.max(...ys)+2;
  const x2px = x => pad + (x - xmin) * (W-2*pad) / (xmax-xmin);
  const y2px = y => H - pad - (y - ymin) * (H-2*pad) / (ymax-ymin);

  // ===== Métricas e OLS =====
  function mse(w,b){
    let s = 0;
    for (const [x,y] of data){
      const e = y - (w*x + b);
      s += e*e;
    }
    return s / data.length;
  }
  function mean(a){ return a.reduce((p,c)=>p+c,0)/a.length; }
  function olsFit(){
    const mx = mean(xs), my = mean(ys);
    let num=0, den=0;
    for (let i=0;i<xs.length;i++){
      const dx = xs[i]-mx, dy = ys[i]-my;
      num += dx*dy; den += dx*dx;
    }
    const w = num/den;
    const b = my - w*mx;
    return {w,b};
  }

  // ===== Desenho =====
  function drawGrid(){
    ctx.save();
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    const xticks = 8, yticks = 6;
    for(let i=0;i<=xticks;i++){
      const xv = xmin + i*(xmax-xmin)/xticks;
      const xp = x2px(xv);
      ctx.beginPath(); ctx.moveTo(xp, pad); ctx.lineTo(xp, H-pad); ctx.stroke();
    }
    for(let i=0;i<=yticks;i++){
      const yv = ymin + i*(ymax-ymin)/yticks;
      const yp = y2px(yv);
      ctx.beginPath(); ctx.moveTo(pad, yp); ctx.lineTo(W-pad, yp); ctx.stroke();
    }
    ctx.restore();
  }
  function drawAxes(){
    ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
    // x
    ctx.beginPath(); ctx.moveTo(pad, H-pad); ctx.lineTo(W-pad, H-pad); ctx.stroke();
    // y
    ctx.beginPath(); ctx.moveTo(pad, H-pad); ctx.lineTo(pad, pad); ctx.stroke();

    // ticks + labels
    ctx.fillStyle = "#444"; ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
    const xticks = 8, yticks = 6;
    for(let i=0;i<=xticks;i++){
      const xv = xmin + i*(xmax-xmin)/xticks;
      const xp = x2px(xv);
      ctx.beginPath(); ctx.moveTo(xp, H-pad); ctx.lineTo(xp, H-pad+5); ctx.stroke();
      ctx.fillText(xv.toFixed(1), xp-10, H-pad+18);
    }
    for(let i=0;i<=yticks;i++){
      const yv = ymin + i*(ymax-ymin)/yticks;
      const yp = y2px(yv);
      ctx.beginPath(); ctx.moveTo(pad-5, yp); ctx.lineTo(pad, yp); ctx.stroke();
      ctx.fillText(yv.toFixed(0), pad-35, yp+4);
    }
  }
  function drawPoints(){
    ctx.fillStyle = "#1f77b4";
    for(const [x,y] of data){
      ctx.beginPath();
      ctx.arc(x2px(x), y2px(y), 3, 0, Math.PI*2);
      ctx.fill();
    }
  }
  function drawLine(w,b){
    const xA = xmin, yA = w*xA + b;
    const xB = xmax, yB = w*xB + b;
    ctx.strokeStyle = "#d62728"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x2px(xA), y2px(yA));
    ctx.lineTo(x2px(xB), y2px(yB));
    ctx.stroke();
  }
  function drawResiduals(w,b){
    if (!residChk.checked) return;
    ctx.save();
    ctx.strokeStyle = "rgba(214,39,40,.45)";
    ctx.lineWidth = 1;
    for (const [x,y] of data){
      const yh = w*x + b;
      ctx.beginPath();
      ctx.moveTo(x2px(x), y2px(y));
      ctx.lineTo(x2px(x), y2px(yh));
      ctx.stroke();
    }
    ctx.restore();
  }

  // ===== Atualização =====
  function update(){
    const w = parseFloat(elW.value), b = parseFloat(elB.value);
    wVal.textContent = w.toFixed(2);
    bVal.textContent = b.toFixed(2);
    eqnEl.textContent = `y = ${w.toFixed(2)}·x + ${b.toFixed(2)}`;
    mseEl.textContent = mse(w,b).toFixed(3);

    // draw
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save(); // trabalhar em coordenadas CSS (não em pixels do dpr)
    drawGrid();
    drawAxes();
    drawResiduals(w,b);
    drawPoints();
    drawLine(w,b);
    ctx.restore();
  }

  elW.addEventListener('input', update);
  elB.addEventListener('input', update);
  residChk.addEventListener('change', update);

  btnFit.addEventListener('click', () => {
    const {w,b} = olsFit();
    elW.value = w.toFixed(2);
    elB.value = b.toFixed(2);
    update();
  });

  btnReset.addEventListener('click', () => {
    elW.value = "-6.5";
    elB.value = "46.0";
    residChk.checked = false;
    update();
  });

  // start
  update();
});
