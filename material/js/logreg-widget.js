document.addEventListener("DOMContentLoaded", function () {
  (function(){
    // DOM
    const w1El = document.getElementById('w1');
    const w2El = document.getElementById('w2');
    const bEl  = document.getElementById('b');
    const w1Val = document.getElementById('w1Val');
    const w2Val = document.getElementById('w2Val');
    const bVal  = document.getElementById('bVal');
    const accEl = document.getElementById('accLr');
    const shadeChk = document.getElementById('shadeLr');
    const fitBtn = document.getElementById('btnFitLr');
    const resetBtn = document.getElementById('btnResetLr');
    const canvas = document.getElementById('logregCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Espaço 2D
    let W=canvas.width, H=canvas.height;
    const pad=48, xmin=0, xmax=10, ymin=0, ymax=10;
    const x2px = x => pad + (x-xmin)*(W-2*pad)/(xmax-xmin);
    const y2px = y => H - pad - (y-ymin)*(H-2*pad)/(ymax-ymin);
    const px2x = px => xmin + (px-pad)*(xmax-xmin)/(W-2*pad);
    const py2y = py => ymin + (H-pad-py)*(ymax-ymin)/(H-2*pad);

    function resizeForDPR(){
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = canvas.clientWidth;
      const cssH = Math.round(cssW*0.586);
      canvas.style.height = cssH + "px";
      canvas.width  = Math.round(cssW*dpr);
      canvas.height = Math.round(cssH*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      W=cssW; H=cssH;
    }
    window.addEventListener('resize', ()=>{ resizeForDPR(); drawAll(); });

    // Dataset (duas blobs)
    let seed=7;
    function rand(){ seed=(1664525*seed+1013904223)%4294967296; return seed/4294967296; }
    function randn(){ let u=0,v=0; while(!u) u=rand(); while(!v) v=rand(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
    function clamp(v,a,b){ return Math.max(a, Math.min(b,v)); }
    let data=[];
    function genData(noise=1.0, nPerClass=60){
      const out=[], c0={x:3.2,y:6.4}, c1={x:6.8,y:3.6}, std=0.9*noise;
      for(let i=0;i<nPerClass;i++){
        out.push({x:clamp(c0.x+randn()*std,xmin,xmax), y:clamp(c0.y+randn()*std,ymin,ymax), ytrue:0});
        out.push({x:clamp(c1.x+randn()*std,xmin,xmax), y:clamp(c1.y+randn()*std,ymin,ymax), ytrue:1});
      }
      return out;
    }

    // Logística
    function sigmoid(z){ return 1/(1+Math.exp(-z)); }
    function prob(x1,x2,w1,w2,b){ return sigmoid(w1*x1 + w2*x2 + b); }
    function accuracy(w1,w2,b){
      let ok=0;
      for(const p of data){
        const yhat = prob(p.x,p.y,w1,w2,b) >= 0.5 ? 1:0;
        if (yhat===p.ytrue) ok++;
      }
      return ok/data.length;
    }

    // Desenho
    function drawAxes(){
      ctx.strokeStyle="#444"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(pad,H-pad); ctx.lineTo(W-pad,H-pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad,H-pad); ctx.lineTo(pad,pad); ctx.stroke();
      ctx.strokeStyle="#eee";
      for(let i=1;i<10;i++){
        const gx=pad+i*(W-2*pad)/10, gy=pad+i*(H-2*pad)/10;
        ctx.beginPath(); ctx.moveTo(gx,pad); ctx.lineTo(gx,H-pad); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad,gy); ctx.lineTo(W-pad,gy); ctx.stroke();
      }
      ctx.fillStyle="#444"; ctx.font="12px system-ui";
      ctx.fillText("x₁", W-pad+6, H-pad+2);
      ctx.fillText("x₂", pad-12, pad-6);
    }
    function drawRegion(w1,w2,b){
      if(!shadeChk.checked) return;
      const step=6;
      for(let py=pad; py<=H-pad; py+=step){
        for(let px=pad; px<=W-pad; px+=step){
          const x=px2x(px+step/2), y=py2y(py+step/2);
          const p=prob(x,y,w1,w2,b);
          ctx.fillStyle = `rgba(214,39,40,${0.08*p})`;
          ctx.fillRect(px,py,step,step);
          // azul claro no complementar
          ctx.fillStyle = `rgba(31,119,180,${0.10*(1-p)})`;
          ctx.fillRect(px,py,step,step);
        }
      }
      // fronteira p=0.5 -> w1*x + w2*y + b = 0
      // desenha como linha: y = -(w1/w2)x - b/w2 (se w2!=0)
      if (Math.abs(w2)>1e-6){
        const yA = x => (-(w1*x + b))/w2;
        ctx.strokeStyle="#000"; ctx.lineWidth=1.5;
        ctx.beginPath();
        ctx.moveTo(x2px(xmin), y2px(yA(xmin)));
        ctx.lineTo(x2px(xmax), y2px(yA(xmax)));
        ctx.stroke();
      }
    }
    function drawPoints(){
      for(const p of data){
        ctx.fillStyle = p.ytrue? "#d62728" : "#1f77b4";
        ctx.beginPath(); ctx.arc(x2px(p.x), y2px(p.y), 3, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle="rgba(0,0,0,.2)"; ctx.stroke();
      }
    }
    function drawAll(){
      const w1=parseFloat(w1El.value), w2=parseFloat(w2El.value), b=parseFloat(bEl.value);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drawRegion(w1,w2,b);
      drawAxes();
      drawPoints();
      accEl.textContent = (accuracy(w1,w2,b)*100).toFixed(1) + "%";
      w1Val.textContent = w1.toFixed(2);
      w2Val.textContent = w2.toFixed(2);
      bVal.textContent  = b.toFixed(2);
    }

    // Fit (gradiente) — poucas iterações, didático
    function fitLogisticGD(epochs=200, lr=0.05){
      let w1=parseFloat(w1El.value), w2=parseFloat(w2El.value), b=parseFloat(bEl.value);
      for(let ep=0; ep<epochs; ep++){
        let g1=0, g2=0, gb=0;
        for(const p of data){
          const z = w1*p.x + w2*p.y + b;
          const yhat = sigmoid(z);
          const err = yhat - p.ytrue; // derivada BCE w.r.t z
          g1 += err * p.x;
          g2 += err * p.y;
          gb += err;
        }
        g1/=data.length; g2/=data.length; gb/=data.length;
        w1 -= lr*g1; w2 -= lr*g2; b -= lr*gb;
      }
      w1El.value = w1.toFixed(2);
      w2El.value = w2.toFixed(2);
      bEl.value  = b.toFixed(2);
      drawAll();
    }

    // Eventos
    [w1El,w2El,bEl].forEach(el=>el.addEventListener('input', drawAll));
    shadeChk.addEventListener('change', drawAll);
    fitBtn.addEventListener('click', ()=>fitLogisticGD(300,0.08));
    resetBtn.addEventListener('click', ()=>{
      w1El.value="-1.00"; w2El.value="1.00"; bEl.value="0.00";
      shadeChk.checked=true; seed=7; data=genData(1.0); drawAll();
    });

    // start
    data = genData(1.0);
    resizeForDPR();
    drawAll();
  })();
});
