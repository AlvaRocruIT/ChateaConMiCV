// main.js

// Elementos del DOM según la nueva estructura
const inputBox = document.getElementById("userInput");
const currentResponse = document.getElementById("currentResponse");
const historyBox = document.getElementById("historyBox");

const PROD_URL = "https://alvarovargas.app.n8n.cloud/webhook/ChateaConMiCV";
const TEST_URL = "https://alvarovargas.app.n8n.cloud/webhook-test/ChateaConMiCV";

function getPreferredEndpoint() {
  const params = new URLSearchParams(window.location.search);
  const env = (params.get("env") || params.get("mode") || "").toLowerCase();
  return env === "test" ? TEST_URL : PROD_URL;
}

async function postToEndpoint(endpoint, payload, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const raw = await response.text();
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch (_) {
      // no-op, non-JSON response
    }
    return { response, data, raw };
  } finally {
    clearTimeout(timeoutId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  historyBox.value = localStorage.getItem("chatHistory") || "";
  historyBox.style.display = "none";
});

// Función principal para enviar el mensaje
async function sendMessage() {
  const input = inputBox.value.trim();
  if (!input) {
    currentResponse.value = "¿Podrías escribir una pregunta o comentario?";
    return;
  }

  const previous = localStorage.getItem("chatHistory") || "";
  currentResponse.value = "🤖 Pensando...";

  const payload = { text: input };
  let endpoint = getPreferredEndpoint();

  try {
    let { response, data, raw } = await postToEndpoint(endpoint, payload);

    if (response.status === 404) {
      // Fallback automático a test si prod no está activo
      if (endpoint === PROD_URL) {
        ({ response, data, raw } = await postToEndpoint(TEST_URL, payload));
        endpoint = TEST_URL;
      }
    }

    if (!response.ok) {
      const detail = data?.message || raw || `HTTP ${response.status}`;
      throw new Error(detail);
    }

    const reply =
      data?.respuesta || data?.reply || data?.message || data?.text ||
      "No se recibió respuesta.";

    const updatedHistory = previous + `\n👤 Tú: ${input}\n🤖 ÁlvaroBot: ${reply}\n`;
    currentResponse.value = reply;
    historyBox.value = updatedHistory;
    localStorage.setItem("chatHistory", updatedHistory);
  } catch (error) {
    const msg = String(error?.message || error || "Error desconocido");
    let hint = "";

    if (msg.includes("webhook") || msg.includes("404")) {
      if (endpoint === PROD_URL) {
        hint =
          "Activa el workflow en n8n (URL de producción). Para pruebas usa ?env=test y pulsa ‘Execute workflow’ en el canvas antes de enviar.";
      } else {
        hint =
          "Pulsa ‘Execute workflow’ en n8n para habilitar temporalmente el webhook de prueba (?env=test).";
      }
    } else if (msg.includes("AbortError")) {
      hint = "Se agotó el tiempo de espera. El servidor tardó demasiado en responder.";
    }

    const fallback = `Ups, algo no salió bien. ${hint}`.trim();
    const updatedHistory = previous + `\n👤 Tú: ${input}\n🤖 ÁlvaroBot: ${fallback}\n`;
    currentResponse.value = fallback;
    historyBox.value = updatedHistory;
    localStorage.setItem("chatHistory", updatedHistory);
  }

  // Limpiar input después de enviar
  inputBox.value = "";
}

function toggleHistory() {
  const btn = document.getElementById("toggleHistoryBtn");
  const isHidden = historyBox.style.display === "none";
  historyBox.style.display = isHidden ? "block" : "none";
  if (btn) btn.textContent = isHidden ? "Ocultar historial" : "Mostrar historial";
}

// Exponer funciones al HTML
window.sendMessage = sendMessage;
window.toggleHistory = toggleHistory;
