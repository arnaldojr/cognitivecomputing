document.addEventListener("DOMContentLoaded", async function () {
  const root = document.getElementById('llm-exercicio');
  if (!root) return;

  const statusEl = document.getElementById('status');
  const btn = document.getElementById('btnEnviar');

  function fail(msg) {
    statusEl.textContent = msg;
    console.error(msg);
  }

  // 1) Verifica se a lib Transformers.js já está disponível
  if (!window.transformers || !window.transformers.pipeline) {
    fail("Não foi possível carregar a biblioteca Transformers.js. Verifique 'extra_javascript' e CSP.");
    return;
  }

  const tr = window.transformers;

  // 2) Carrega o modelo (pode demorar na 1ª vez)
  statusEl.textContent = "Carregando modelo (pode demorar na 1ª vez)...";

  let pipe;
  try {
    // DICA: se CDN/HF estiver bloqueado, troque por um modelo hospedado localmente (veja nota abaixo)
    pipe = await tr.pipeline(
      "text-generation",
      "Xenova/TinyLlama-1.1B-Chat-v1.0",
      { dtype: "q8" }
    );
    statusEl.textContent = "Modelo pronto.";
  } catch (e) {
    console.error(e);
    fail("Falha ao baixar/carregar o modelo. Libere 'huggingface.co' na rede ou hospede o modelo localmente.");
    return;
  }

  async function gradeWithLLM(question, answer) {
    const prompt = `
Você é um corretor objetivo. Responda SOMENTE JSON válido:
{"correct": boolean, "score": number, "feedback": "texto curto"}
Regras: score em [0,1]; 2–4 frases curtas; nada de solução completa.
Se resposta vazia, score=0 e peça nova tentativa.

PERGUNTA:
${question}

RESPOSTA_DO_ALUNO:
${answer || "(vazia)"}

RÚBRICA:
- KNN usa distância (Euclidiana por padrão).
- Escalas diferentes distorcem proximidade.
- Z-score coloca features na mesma escala.
- Ponderação por distância é menção opcional.
`.trim();

    const out = await pipe(prompt, {
      max_new_tokens: 200,
      temperature: 0.2,
      top_p: 0.9,
      repetition_penalty: 1.1,
    });
    const text = (out?.[0]?.generated_text || "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}$/);
    let parsed;
    try { parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text); }
    catch { parsed = { correct:false, score:0, feedback:"Não consegui interpretar. Reformule sua resposta." }; }
    return {
      correct: !!parsed.correct,
      score: Math.max(0, Math.min(1, Number(parsed.score) || 0)),
      feedback: String(parsed.feedback || "").slice(0, 800)
    };
  }

  btn.addEventListener('click', async () => {
    const pergunta = document.getElementById('pergunta').innerText.trim();
    const resposta = document.getElementById('resposta').value.trim();
    statusEl.textContent = "Avaliando localmente...";

    try {
      const r = await gradeWithLLM(pergunta, resposta);
      document.getElementById('resultado').style.display = "block";
      document.getElementById('correto').textContent = r.correct ? "✅ Correta" : "❌ Incompleta/Imprecisa";
      document.getElementById('score').textContent = Math.round(r.score * 100) + "%";
      document.getElementById('feedback').textContent = r.feedback || "(sem feedback)";
      statusEl.textContent = "";
    } catch (e) {
      console.error(e);
      fail("Falha na avaliação local.");
    }
  });
});
