// main.js

// Elementos del DOM según la nueva estructura
const inputBox = document.getElementById("userInput");
const currentResponse = document.getElementById("currentResponse");
const historyBox = document.getElementById("historyBox");

// Función principal para enviar el mensaje
async function sendMessage() {
  const input = inputBox.value.trim();
  if (!input) {
    currentResponse.value = "¿Podrías escribir una pregunta o comentario?";
    return;
  }

  const previous = localStorage.getItem("chatHistory") || "";
  currentResponse.value = "🤖 Pensando...";

  try {
    const response = await fetch("https://alvarovargas.app.n8n.cloud/webhook-test/ChateaConMiCV", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await response.json();
    const reply = data.respuesta || "No se recibió respuesta.";
    const updatedHistory = previous + `\n👤 Tú: ${input}\n🤖 ÁlvaroBot: ${reply}\n`;

    currentResponse.value = reply;
    historyBox.value = updatedHistory;
    localStorage.setItem("chatHistory", updatedHistory);
  } catch (error) {
    const fallback = "Ups, algo no salió bien. ¿Quieres intentar con otra pregunta?";
    const updatedHistory = previous + `\n👤 Tú: ${input}\n🤖 ÁlvaroBot: ${fallback}\n`;

    currentResponse.value = fallback;
    historyBox.value = updatedHistory;
    localStorage.setItem("chatHistory", updatedHistory);
  }

  // Limpiar input después de enviar
  inputBox.value = "";
}

// Función para mostrar/ocultar el historial al hacer clic
window.toggleHistory = () => {
  historyBox.style.display = historyBox.style.display === "none" ? "block" : "none";
};

// Exponer funciones al HTML
window.sendMessage = sendMessage;
window.toggleHistory = toggleHistory;
