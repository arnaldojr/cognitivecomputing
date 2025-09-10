document.addEventListener("DOMContentLoaded", function () {
  (function(){
    const root = document.getElementById("cnn-widget");
    if (!root) return;

    // DOM refs
    const cvIn = document.getElementById("cnn_input");
    const ctxIn = cvIn.getContext("2d");
    const cvFeat = document.getElementById("cnn_feat");
    const ctxFeat = cvFeat.getContext("2d");
    const cvPool = document.getElementById("cnn_pool_canvas");
    const ctxPool = cvPool.getContext("2d");

    const btnClear = document.getElementById("cnn_clear");
    const btnNoise = document.getElementById("cnn_noise");
    const btnDemo = document.getElementById("cnn_demo");
    const btnApply = document.getElementById("cnn_apply");
    const btnReset = document.getElementById("cnn_reset");

    const selKernel = document.getElementById("cnn_kernel");
    const customWrap = document.getElementById("cnn_custom_wrap");
    const customInputs = Array.from(root.querySelectorAll("input.cnn_k"));

    const selPad = document.getElementById("cnn_padding");
    const inpStride = document.getElementById("cnn_stride");
    const selAct = document.getElementById("cnn_act");
    const selPool = document.getElementById("cnn_pool");

    const shapeConvEl = document.getElementById("cnn_shape_conv");
    const shapePoolEl = document.getElementById("cnn_shape_pool");
    const summaryEl  = document.getElementById("cnn_summary");

    // lógica imagem 28x28
    const N = 28;
    const SCALE = cvIn.width / N; // 196/28 = 7
    let img = new Float32Array(N*N); // valores [0..1]

    function idx(x,y){ return y*N + x; }
    function clamp01(v){ return Math.max(0, Math.min(1, v)); }

    // desenhar imagem de entrada (ampliada)
    function drawInput(){
      ctxIn.clearRect(0,0,cvIn.width,cvIn.height);
      for (let y=0;y<N;y++){
        for (let x=0;x<N;x++){
          const v = img[idx(x,y)];
          const g = Math.round(v*255);
          ctxIn.fillStyle = `rgb(${g},${g},${g})`;
          ctxIn.fillRect(x*SCALE, y*SCALE, SCALE, SCALE);
        }
      }
    }

    // ferramentas de desenho
    let drawing = false;
    cvIn.addEventListener("mousedown", e => { drawing = true; paint(e); });
    cvIn.addEventListener("mousemove", e => { if (drawing) paint(e); });
    window.addEventListener("mouseup", ()=> drawing=false);

    function paint(e){
      const rect = cvIn.getBoundingClientRect();
      const px = Math.floor((e.clientX - rect.left) / SCALE);
      const py = Math.floor((e.clientY - rect.top)  / SCALE);
      const r = 1; // raio de pincel (em pixels da grade 28x28)
      for (let y=py-r; y<=py+r; y++){
        for (let x=px-r; x<=px+r; x++){
          if (x>=0 && x<N && y>=0 && y<N){
            // pincel suave
            const dist = Math.hypot(x-px, y-py);
            if (dist <= r+0.001){
              img[idx(x,y)] = clamp01(img[idx(x,y)] + 0.4*(1 - dist/(r+0.001)));
            }
          }
        }
      }
      drawInput();
    }

    // kernels predefinidos
    const KER = {
      identity: [[0,0,0],[0,1,0],[0,0,0]],
      blur: [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]],
      sharpen: [[0,-1,0],[-1,5,-1],[0,-1,0]],
      edge_lap: [[0,-1,0],[-1,4,-1],[0,-1,0]],
      sobel_x: [[-1,0,1],[-2,0,2],[-1,0,1]],
      sobel_y: [[-1,-2,-1],[0,0,0],[1,2,1]],
      emboss: [[-2,-1,0],[-1,1,1],[0,1,2]]
    };

    function getKernel(){
      const k = selKernel.value;
      if (k === "custom"){
        const vals = customInputs.map(inp => parseFloat(inp.value||"0"));
        return [
          [vals[0], vals[1], vals[2]],
          [vals[3], vals[4], vals[5]],
          [vals[6], vals[7], vals[8]]
        ];
      }
      return KER[k];
    }

    selKernel.addEventListener("change", ()=>{
      customWrap.style.display = selKernel.value === "custom" ? "block" : "none";
    });

    // convolução
    function conv2d(src, W, padding="same", stride=1){
      const k = 3;
      const pad = (padding === "same") ? Math.floor(k/2) : 0;
      const outW = Math.floor((N + 2*pad - k)/stride) + 1;
      const outH = Math.floor((N + 2*pad - k)/stride) + 1;
      const out = new Float32Array(outW*outH);

      function at(x,y){
        if (x<0||x>=N||y<0||y>=N) return 0;
        return src[idx(x,y)];
      }

      for (let oy=0; oy<outH; oy++){
        for (let ox=0; ox<outW; ox++){
          let sum = 0;
          const ix = ox*stride - pad;
          const iy = oy*stride - pad;
          for (let ky=0; ky<3; ky++){
            for (let kx=0; kx<3; kx++){
              sum += W[ky][kx] * at(ix+kx, iy+ky);
            }
          }
          out[oy*outW + ox] = sum;
        }
      }
      return {data: out, W: outW, H: outH};
    }

    // ativação
    function activate({data,W,H}, act){
      if (act === "none") return {data,W,H};
      const out = new Float32Array(W*H);
      if (act === "relu"){
        for (let i=0;i<data.length;i++) out[i] = Math.max(0, data[i]);
      }
      return {data: out, W, H};
    }

    // pooling 2x2 stride 2
    function pool2x2({data,W,H}, type="none"){
      if (type === "none") return {data,W,H};
      const outW = Math.floor(W/2), outH = Math.floor(H/2);
      const out = new Float32Array(outW*outH);
      for (let oy=0; oy<outH; oy++){
        for (let ox=0; ox<outW; ox++){
          const i0 = (2*oy)*W + (2*ox);
          const v00 = data[i0];
          const v01 = data[i0+1] ?? v00;
          const v10 = data[i0+W] ?? v00;
          const v11 = data[i0+W+1] ?? v00;
          let v;
          if (type === "max") v = Math.max(v00,v01,v10,v11);
          else v = 0.25*(v00+v01+v10+v11);
          out[oy*outW + ox] = v;
        }
      }
      return {data: out, W: outW, H: outH};
    }

    // renderização escala de cinza (normalizando para display)
    function renderToCanvas({data,W,H}, ctx, cvs){
      // normaliza para 0..255 de forma robusta
      let min=Infinity, max=-Infinity;
      for (let i=0;i<data.length;i++){ const v=data[i]; if(v<min)min=v; if(v>max)max=v; }
      if (min===max){ min -= 1; max += 1; }
      const scale = 255/(max-min);

      const scaleX = Math.floor(cvs.width / W);
      const scaleY = Math.floor(cvs.height/ H);
      const S = Math.max(1, Math.min(scaleX, scaleY));

      ctx.clearRect(0,0,cvs.width,cvs.height);
      for (let y=0;y<H;y++){
        for (let x=0;x<W;x++){
          const v = data[y*W+x];
          const g = Math.round((v - min) * scale);
          ctx.fillStyle = `rgb(${g},${g},${g})`;
          ctx.fillRect(x*S, y*S, S, S);
        }
      }
    }

    // gerar entrada demo “7”
    function demoSeven(){
      // simples traço em 7
      img.fill(0);
      for (let x=5;x<23;x++) img[idx(x,6)] = 1;
      for (let d=0; d<14; d++) img[idx(18-d, 6+1+d)] = 1;
      blurInput(1);
      drawInput();
    }
    function blurInput(iters=1){
      const k = [[0,1/4,0],[1/4,1/4,1/4],[0,1/4,0]];
      for (let t=0;t<iters;t++){
        const next = new Float32Array(N*N);
        for (let y=0;y<N;y++){
          for (let x=0;x<N;x++){
            let s=0;
            for (let ky=0;ky<3;ky++)for(let kx=0;kx<3;kx++){
              const ix=x+kx-1, iy=y+ky-1;
              if(ix>=0&&ix<N&&iy>=0&&iy<N) s+=k[ky][kx]*img[idx(ix,iy)];
            }
            next[idx(x,y)] = s;
          }
        }
        img = next;
      }
    }

    // botões
    btnClear.addEventListener("click", ()=>{ img.fill(0); drawInput(); applyAll(); });
    btnNoise.addEventListener("click", ()=>{
      for(let i=0;i<img.length;i++) img[i] = Math.random()*0.3;
      drawInput(); applyAll();
    });
    btnDemo.addEventListener("click", ()=>{ demoSeven(); applyAll(); });
    btnReset.addEventListener("click", ()=>{
      selKernel.value = "identity";
      customWrap.style.display = "none";
      customInputs.forEach((inp,i)=> inp.value = (i===4?1:0));
      selPad.value = "same";
      inpStride.value = "1";
      selAct.value = "none";
      selPool.value = "none";
      applyAll();
    });

    btnApply.addEventListener("click", applyAll);

    // pipeline
    function applyAll(){
      const K = getKernel();
      const stride = Math.max(1, parseInt(inpStride.value||"1",10));
      const pad = selPad.value;        // "same" | "valid"
      const act = selAct.value;        // "none" | "relu"
      const pool = selPool.value;      // "none" | "max" | "avg"

      // conv -> act -> render
      const conv = conv2d(img, K, pad, stride);
      const actv = activate(conv, act);

      renderToCanvas(actv, ctxFeat, cvFeat);
      shapeConvEl.textContent = `${actv.H}×${actv.W}`;

      // pooling -> render
      const pooled = pool2x2(actv, pool);
      renderToCanvas(pooled, ctxPool, cvPool);
      shapePoolEl.textContent = `${pooled.H}×${pooled.W}`;

      summaryEl.textContent =
        `kernel 3×3 • stride ${stride} • padding ${pad} • act ${act} • pool ${pool}`;
    }

    // init
    (function init(){
      img.fill(0);
      drawInput();
      applyAll();
    })();
  })();
});
