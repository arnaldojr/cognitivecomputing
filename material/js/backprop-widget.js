document.addEventListener("DOMContentLoaded", function () {
  (function(){
    const root = document.getElementById("backprop-widget");
    if (!root) return;

    // DOM
    const lrEl = document.getElementById("bp_lr");
    const lrVal = document.getElementById("bp_lrVal");
    const actSel = document.getElementById("bp_act");
    const btnNext = document.getElementById("bp_next");
    const btnAuto = document.getElementById("bp_auto");
    const btnReset = document.getElementById("bp_reset");

    const epochEl = document.getElementById("bp_epoch");
    const errEl = document.getElementById("bp_err");
    const outEl = document.getElementById("bp_out");
    const gradsEl = document.getElementById("bp_grads");

    const canvas = document.getElementById("bp_canvas");
    const ctx = canvas.getContext("2d");

    // Problema: entrada [1,0] saída esperada [1]
    const X = [1, 0];
    const y_true = 1;

    // Estrutura: 2-2-1
    let W1, b1, W2, b2;
    let epoch = 0;

    // Ativações
    function sigmoid(z){ return 1/(1+Math.exp(-z)); }
    function dsigmoid(a){ return a*(1-a); }
    function tanh(z){ return Math.tanh(z); }
    function dtanh(a){ return 1 - a*a; }
    function relu(z){ return Math.max(0,z); }
    function drelu(a){ return a>0 ? 1 : 0; }

    function getActFns(){
      if(actSel.value === "sigmoid") return [sigmoid, dsigmoid];
      if(actSel.value === "tanh") return [tanh, dtanh];
      return [relu, drelu];
    }

    // Inicialização
    function init(){
      W1 = [[Math.random()*2-1, Math.random()*2-1],
            [Math.random()*2-1, Math.random()*2-1]];
      b1 = [Math.random()*2-1, Math.random()*2-1];
      W2 = [Math.random()*2-1, Math.random()*2-1];
      b2 = Math.random()*2-1;
      epoch = 0;
      drawNetwork();
      updateInfo();
    }

    // Forward + Backprop
    function step(){
      const [act, dact] = getActFns();
      const lr = parseFloat(lrEl.value);

      // Forward
      const z1 = [W1[0][0]*X[0] + W1[0][1]*X[1] + b1[0],
                  W1[1][0]*X[0] + W1[1][1]*X[1] + b1[1]];
      const a1 = [act(z1[0]), act(z1[1])];
      const z2 = W2[0]*a1[0] + W2[1]*a1[1] + b2;
      const a2 = act(z2);

      // Erro
      const err = 0.5 * (y_true - a2)**2;

      // Backprop
      const dz2 = (a2 - y_true) * dact(a2);
      const dW2 = [dz2 * a1[0], dz2 * a1[1]];
      const db2 = dz2;

      const dz1 = [
        dz2 * W2[0] * dact(a1[0]),
        dz2 * W2[1] * dact(a1[1])
      ];
      const dW1 = [
        [dz1[0]*X[0], dz1[0]*X[1]],
        [dz1[1]*X[0], dz1[1]*X[1]]
      ];
      const db1_ = [dz1[0], dz1[1]];

      // Atualização
      for(let i=0;i<2;i++){
        W2[i] -= lr * dW2[i];
        for(let j=0;j<2;j++){
          W1[i][j] -= lr * dW1[i][j];
        }
        b1[i] -= lr * db1_[i];
      }
      b2 -= lr * db2;

      epoch++;
      drawNetwork(a1, a2);
      updateInfo(err, a2, {dW1, db1: db1_, dW2, db2});
    }

    function drawNetwork(a1=[], a2=null){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";

      const xIn = 60, xHid = 200, xOut = 340;
      const yTop = 80, yGap = 80;

      // Inputs
      ctx.fillStyle = "#1f77b4";
      ctx.beginPath();
      ctx.arc(xIn, yTop, 20, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText("x1=1", xIn, yTop+4);

      ctx.fillStyle = "#1f77b4";
      ctx.beginPath();
      ctx.arc(xIn, yTop+yGap, 20, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText("x2=0", xIn, yTop+yGap+4);

      // Hidden
      for(let i=0;i<2;i++){
        ctx.fillStyle = "#ff7f0e";
        ctx.beginPath();
        ctx.arc(xHid, yTop + i*yGap, 20, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(a1[i]!==undefined ? a1[i].toFixed(2) : "h"+(i+1),
                     xHid, yTop+i*yGap+4);
      }

      // Output
      ctx.fillStyle = "#2ca02c";
      ctx.beginPath();
      ctx.arc(xOut, yTop+40, 25, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(a2!==null ? a2.toFixed(2) : "ŷ", xOut, yTop+44);

      // Conexões
      ctx.strokeStyle = "#999";
      for(let i=0;i<2;i++){
        for(let j=0;j<2;j++){
          ctx.beginPath();
          ctx.moveTo(xIn, yTop+i*yGap);
          ctx.lineTo(xHid, yTop+j*yGap);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(xHid, yTop+i*yGap);
        ctx.lineTo(xOut, yTop+40);
        ctx.stroke();
      }
    }

    function updateInfo(err=NaN, out=NaN, grads=null){
      lrVal.textContent = parseFloat(lrEl.value).toFixed(2);
      epochEl.textContent = epoch;
      errEl.textContent = isNaN(err) ? "—" : err.toFixed(4);
      outEl.textContent = isNaN(out) ? "—" : out.toFixed(4);
      if(grads){
        gradsEl.textContent = JSON.stringify(grads, null, 2);
      } else {
        gradsEl.textContent = "—";
      }
    }

    // Eventos
    btnNext.addEventListener("click", step);
    btnAuto.addEventListener("click", () => {
      let i=0;
      const id = setInterval(()=>{
        step();
        if(i++>50) clearInterval(id);
      }, 200);
    });
    btnReset.addEventListener("click", init);
    lrEl.addEventListener("input", ()=>{ lrVal.textContent=parseFloat(lrEl.value).toFixed(2); });

    init();
  })();
});
