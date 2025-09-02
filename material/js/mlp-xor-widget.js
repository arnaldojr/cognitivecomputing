document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const root = document.getElementById('mlp-xor-widget');
    if (!root) return;

    // ===== DOM =====
    const actSel = document.getElementById('mlp_act');
    const lrEl   = document.getElementById('mlp_lr');
    const epEl   = document.getElementById('mlp_ep');
    const batchSel = document.getElementById('mlp_batch');
    const lrVal  = document.getElementById('mlp_lrVal');
    const epVal  = document.getElementById('mlp_epVal');
    const shade  = document.getElementById('mlp_shade');
    const accEl  = document.getElementById('mlp_acc');
    const btnTrain = document.getElementById('mlp_btnTrain');
    const btnReset = document.getElementById('mlp_btnReset');

    const w11El = document.getElementById('mlp_w11');
    const w12El = document.getElementById('mlp_w12');
    const w21El = document.getElementById('mlp_w21');
    const w22El = document.getElementById('mlp_w22');
    const b1El  = document.getElementById('mlp_b1');
    const b2El  = document.getElementById('mlp_b2');
    const v1El  = document.getElementById('mlp_v1');
    const v2El  = document.getElementById('mlp_v2');
    const cEl   = document.getElementById('mlp_c');

    const canvas = document.getElementById('mlpCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ===== Espaço 2D =====
    let W=canvas.width, H=canvas.height;
    const pad=60, xmin=-0.2, xmax=1.2, ymin=-0.2, ymax=1.2;
    const x2px = x => pad + (x-xmin)*(W-2*pad)/(xmax-xmin);
    const y2px = y => H - pad - (y-ymin)*(H-2*pad)/(ymax-ymin);

    function resizeForDPR(){
      const dpr=Math.max(1,window.devicePixelRatio||1);
      const cssW=canvas.clientWidth, cssH=Math.round(cssW*0.58);
      canvas.style.height=cssH+"px";
      canvas.width=Math.round(cssW*dpr);
      canvas.height=Math.round(cssH*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      W=cssW; H=cssH;
    }
    window.addEventListener('resize', ()=>{ resizeForDPR(); drawAll(); });
    resizeForDPR();

    // ===== Dataset XOR =====
    const data = [
      {x1:0, x2:0, y:0},
      {x1:0, x2:1, y:1},
      {x1:1, x2:0, y:1},
      {x1:1, x2:1, y:0},
    ];

    // ===== Ativações =====
    function act(z, kind){
      if (kind==='relu') return Math.max(0,z);
      // tanh
      return Math.tanh(z);
    }
    function dact(z, a, kind){
      if (kind==='relu') return z>0 ? 1 : 0; // derivada w.r.t z
      // tanh': 1 - tanh(z)^2  (usa 'a' = tanh(z) já computado)
      return 1 - a*a;
    }
    function sigmoid(z){ return 1/(1+Math.exp(-z)); }
    function dsigmoid(a){ return a*(1-a); } // usando saída já ativada

    // ===== Forward & Loss =====
    function forward(x1,x2, params, kind){
      const {w11,w12,w21,w22,b1,b2,v1,v2,c} = params;
      // hidden pre-acts
      const z1 = w11*x1 + w21*x2 + b1;
      const z2 = w12*x1 + w22*x2 + b2;
      const a1 = act(z1, kind);
      const a2 = act(z2, kind);
      // output (sigmoid)
      const z3 = v1*a1 + v2*a2 + c;
      const yhat = sigmoid(z3);
      return {z1,z2,a1,a2,z3,yhat};
    }

    function accuracy(params, kind){
      let ok=0;
      for(const d of data){
        const {yhat} = forward(d.x1, d.x2, params, kind);
        const ypred = yhat>=0.5 ? 1:0;
        if (ypred===d.y) ok++;
      }
      return ok/data.length;
    }

    // ===== Backprop (MSE) =====
    function train(epochs, lr, kind, mode){
      let p = readParams();
      for (let ep=0; ep<epochs; ep++){
        const order = mode==='sgd' ? shuffle([0,1,2,3]) : [0,1,2,3];
        for(const idx of order){
          const d = data[idx];
          const {z1,z2,a1,a2,z3,yhat} = forward(d.x1,d.x2,p,kind);
          const y = d.y;

          // loss = 0.5*(yhat - y)^2  -> dL/dyhat = (yhat - y)
          const dL_dy = (yhat - y);

          // saída (sigmoid)
          const dy_dz3 = dsigmoid(yhat);
          const dL_dz3 = dL_dy * dy_dz3;

          // gradientes camada de saída
          const dL_dv1 = dL_dz3 * a1;
          const dL_dv2 = dL_dz3 * a2;
          const dL_dc  = dL_dz3;

          // back para camada oculta
          const dz3_da1 = p.v1;
          const dz3_da2 = p.v2;
          const da1_dz1 = dact(z1, a1, kind);
          const da2_dz2 = dact(z2, a2, kind);

          const dL_dz1 = dL_dz3 * dz3_da1 * da1_dz1;
          const dL_dz2 = dL_dz3 * dz3_da2 * da2_dz2;

          // gradientes cam. oculta
          const dL_dw11 = dL_dz1 * d.x1;
          const dL_dw21 = dL_dz1 * d.x2;
          const dL_db1  = dL_dz1;

          const dL_dw12 = dL_dz2 * d.x1;
          const dL_dw22 = dL_dz2 * d.x2;
          const dL_db2  = dL_dz2;

          // SGD passo
          p.v1 -= lr * dL_dv1; p.v2 -= lr * dL_dv2; p.c  -= lr * dL_dc;
          p.w11 -= lr * dL_dw11; p.w21 -= lr * dL_dw21; p.b1 -= lr * dL_db1;
          p.w12 -= lr * dL_dw12; p.w22 -= lr * dL_dw22; p.b2 -= lr * dL_db2;
        }
      }
      writeParams(p);
    }

    function shuffle(arr){
      const a = arr.slice();
      for(let i=a.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [a[i],a[j]] = [a[j],a[i]];
      }
      return a;
    }

    function readParams(){
      return {
        w11: parseFloat(w11El.value),
        w12: parseFloat(w12El.value),
        w21: parseFloat(w21El.value),
        w22: parseFloat(w22El.value),
        b1:  parseFloat(b1El.value),
        b2:  parseFloat(b2El.value),
        v1:  parseFloat(v1El.value),
        v2:  parseFloat(v2El.value),
        c:   parseFloat(cEl.value),
      };
    }
    function writeParams(p){
      w11El.value=p.w11.toFixed(2);
      w12El.value=p.w12.toFixed(2);
      w21El.value=p.w21.toFixed(2);
      w22El.value=p.w22.toFixed(2);
      b1El.value =p.b1.toFixed(2);
      b2El.value =p.b2.toFixed(2);
      v1El.value =p.v1.toFixed(2);
      v2El.value =p.v2.toFixed(2);
      cEl.value  =p.c.toFixed(2);
    }

    // ===== Desenho =====
    function drawAxes(){
      ctx.strokeStyle="#444"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(pad,H-pad); ctx.lineTo(W-pad,H-pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad,H-pad); ctx.lineTo(pad,pad); ctx.stroke();

      ctx.fillStyle="#444"; ctx.font="12px system-ui";
      for(let i=0;i<=6;i++){
        const xv=xmin+i*(xmax-xmin)/6, yv=ymin+i*(ymax-ymin)/6;
        const xp=x2px(xv), yp=y2px(yv);
        ctx.beginPath(); ctx.moveTo(xp,H-pad); ctx.lineTo(xp,H-pad+5); ctx.stroke();
        ctx.fillText(xv.toFixed(1), xp-10, H-pad+18);
        ctx.beginPath(); ctx.moveTo(pad-5,yp); ctx.lineTo(pad,yp); ctx.stroke();
        ctx.fillText(yv.toFixed(1), pad-35, yp+4);
      }
      ctx.fillText("x₁", W-pad+6, H-pad+2);
      ctx.fillText("x₂", pad-12, pad-6);
    }

    function drawGrid(){
      if(!shade.checked) return;
      // região de decisão (amostragem grossa)
      const p = readParams(), kind = actSel.value;
      const step=6;
      for(let py=pad; py<=H-pad; py+=step){
        for(let px=pad; px<=W-pad; px+=step){
          const x = xmin + (px-pad)*(xmax-xmin)/(W-2*pad);
          const y = ymin + (H-pad-py)*(ymax-ymin)/(H-2*pad);
          const { yhat } = forward(x,y,p,kind);
          const r = Math.min(1, Math.max(0, yhat));
          ctx.fillStyle = `rgba(214,39,40,${0.10*r})`;   // vermelho p~1
          ctx.fillRect(px,py,step,step);
          ctx.fillStyle = `rgba(31,119,180,${0.12*(1-r)})`; // azul p~0
          ctx.fillRect(px,py,step,step);
        }
      }
      // contorno p~0.5 (amostra 100 pontos)
      ctx.strokeStyle="#000"; ctx.lineWidth=1.2;
      ctx.beginPath();
      const N=100;
      for(let i=0;i<=N;i++){
        const x=xmin + i*(xmax-xmin)/N;
        // busca y com p~0.5 simples (varre 100 y's e pega mais próximo)
        let bestY=null, bestDiff=1e9;
        for(let j=0;j<=N;j++){
          const y=ymin + j*(ymax-ymin)/N;
          const {yhat}=forward(x,y,p,kind);
          const diff=Math.abs(yhat-0.5);
          if(diff<bestDiff){ bestDiff=diff; bestY=y; }
        }
        if(i===0) ctx.moveTo(x2px(x), y2px(bestY));
        else ctx.lineTo(x2px(x), y2px(bestY));
      }
      ctx.stroke();
    }

    function drawPoints(){
      for(const d of data){
        ctx.fillStyle = d.y ? "#d62728" : "#1f77b4";
        ctx.beginPath(); ctx.arc(x2px(d.x1), y2px(d.x2), 5, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle="rgba(0,0,0,.25)"; ctx.stroke();
      }
    }

    function drawAll(){
      lrVal.textContent = parseFloat(lrEl.value).toFixed(2);
      epVal.textContent = parseInt(epEl.value,10);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drawGrid();
      drawAxes();
      drawPoints();
      // acurácia
      const p = readParams();
      accEl.textContent = Math.round(accuracy(p, actSel.value)*100) + "%";
    }

    // ===== Eventos =====
    [actSel, lrEl, epEl, batchSel].forEach(el=>el.addEventListener('input', drawAll));
    shade.addEventListener('change', drawAll);
    [w11El,w12El,w21El,w22El,b1El,b2El,v1El,v2El,cEl].forEach(el=>el.addEventListener('change', drawAll));

    btnTrain.addEventListener('click', () => {
      btnTrain.disabled = true;
      train(parseInt(epEl.value,10), parseFloat(lrEl.value), actSel.value, batchSel.value);
      btnTrain.disabled = false;
      drawAll();
    });

    btnReset.addEventListener('click', () => {
      actSel.value = "tanh";
      lrEl.value  = "0.05";
      epEl.value  = "1";
      batchSel.value = "full";
      // preset razoável pra começar a aprender rápido
      w11El.value="2.00";  w12El.value="2.00";
      w21El.value="2.00";  w22El.value="2.00";
      b1El.value ="-0.50"; b2El.value ="-2.50";
      v1El.value ="1.00";  v2El.value ="0.00";
      cEl.value  ="-0.50";
      shade.checked = true;
      drawAll();
    });

    // start
    btnReset.click();
    resizeForDPR();
    drawAll();
  })();
});

