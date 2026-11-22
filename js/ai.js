
/* =========================================
   ESH AI — Groq Integration
========================================= */

const ESHAI = (() => {
    const API_URL =
        'https://api.groq.com/openai/v1/chat/completions';

    const MODEL = 'openai/gpt-oss-20b';

    let apiKey = '';

    function init() {
        const keyInput = document.getElementById('esh-ai-api-key');
        const activateBtn = document.getElementById('esh-ai-activate');
        const keyStatus = document.getElementById('esh-ai-key-status');
        const questionInput = document.getElementById('esh-ai-question');
        const sendBtn = document.getElementById('esh-ai-send');
        const loading = document.getElementById('esh-ai-loading');
        const responseBox = document.getElementById('esh-ai-response');

        if (
            !keyInput || !activateBtn || !keyStatus ||
            !questionInput || !sendBtn || !loading || !responseBox
        ) return;

        activateBtn.addEventListener('click', () => {
            const enteredKey = keyInput.value.trim();

            if (!enteredKey) {
                keyStatus.textContent = 'Introduce una API Key válida.';
                return;
            }

            apiKey = enteredKey;

            keyInput.value = '';
            keyInput.disabled = true;
            activateBtn.disabled = true;

            questionInput.disabled = false;
            sendBtn.disabled = false;

            keyStatus.textContent = 'ESH AI está activado correctamente.';
            responseBox.textContent =
                'Hola. Soy ESH AI. ¿Qué quieres saber?';
        });

        sendBtn.addEventListener('click', sendQuestion);

        questionInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendQuestion();
            }
        });

        async function sendQuestion() {
            const question = questionInput.value.trim();

            if (!apiKey) {
                responseBox.textContent =
                    'Primero activa ESH AI con tu API Key.';
                return;
            }

            if (!question) {
                responseBox.textContent =
                    'Escribe una pregunta antes de enviar.';
                return;
            }

            sendBtn.disabled = true;
            loading.hidden = false;
            responseBox.textContent = '';

            try {
                const systemPrompt = `
Eres ESH AI, el asistente virtual oficial de ESH STORE.

Tu función es ayudar a los visitantes a conocer el proyecto
musical ESH y orientarlos dentro de su tienda oficial.

Contexto del proyecto:
- ESH es un proyecto musical independiente.
- Su propuesta combina Reggaetón, Dancehall, R&B,
  Hip Hop, Indie y Regional Mexicano.
- Su identidad visual trabaja con la dualidad,
  la inocencia, un ángel caído y elementos como
  murciélagos y palomas.
- La tienda comercializa merchandising oficial.

Instrucciones:
- Responde en español, de forma clara y natural.
- Mantén una personalidad creativa y cercana.
- No inventes precios, existencias ni características
  de productos que no estén confirmadas.
- Si no conoces un dato, dilo con honestidad.
- Mantén tus respuestas relacionadas con ESH,
  su música, identidad y tienda.
`;

                const apiResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: question }
                        ],
                        max_completion_tokens: 1024
                    })
                });

                const data = await apiResponse.json();

                if (!apiResponse.ok) {
                    throw new Error(
                        data.error?.message ||
                        `Error de Groq: HTTP ${apiResponse.status}`
                    );
                }

                const answer =
                    data.choices?.[0]?.message?.content;

                if (!answer) {
                    throw new Error(
                        'Groq no devolvió una respuesta de texto.'
                    );
                }

                responseBox.textContent = answer;
                questionInput.value = '';

            } catch (error) {
                console.error('[ESHAI] Error:', error);
                responseBox.textContent =
                    `No se pudo completar la solicitud: ${error.message}`;
            } finally {
                loading.hidden = true;
                sendBtn.disabled = false;
            }
        }
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    ESHAI.init();
});
