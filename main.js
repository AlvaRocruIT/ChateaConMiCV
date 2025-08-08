// main.js

const resBox = document.getElementById("response");
const inputBox = document.getElementById("userInput");

// Recuperar historial al cargar
window.onload = () => {
  const history = localStorage.getItem("chatHistory");
  if (history) resBox.innerText = history;
};

async function sendMessage() {
  const input = inputBox.value.trim();
  if (!input) {
    resBox.innerText = "¿Podrías escribir una pregunta o comentario?";
    return;
  }

  const previous = localStorage.getItem("chatHistory") || "";
  resBox.innerText = previous + `\n👤 Tú: ${input}\n🤖 Pensando...\n`;

  try {
    const response = await fetch("https://alvarovargas.app.n8n.cloud/webhook-test/ChateaConMiCV", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await response.json();
    const reply = data.respuesta || "No se recibió respuesta.";
    const updatedHistory = previous + `\n👤 Tú: ${input}\n🤖 ÁlvaroBot: ${reply}\n`;

    resBox.innerText = updatedHistory;
    localStorage.setItem("chatHistory", updatedHistory);
  } catch (error) {
    const fallback = "Ups, algo no salió bien. ¿Quieres intentar con otra pregunta?";
    const updatedHistory = previous + `\n👤 Tú: ${input}\n🤖 ÁlvaroBot: ${fallback}\n`;

    resBox.innerText = updatedHistory;
    localStorage.setItem("chatHistory", updatedHistory);
  }
}

  resBox.innerText = "Estoy reflexionando sobre eso... dame un momento.";

  try {
    const response = await fetch("https://alvarovargas.app.n8n.cloud/webhook-test/ChateaConMiCV", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await response.json();
    resBox.innerText = data.respuesta || "No se recibió respuesta.";
  } catch (error) {
    resBox.innerText = "Ups, algo no salió bien. ¿Quieres intentar con otra pregunta?";
  }
}

// Puedes agregar más funciones aquí:
// - modoPropósito()
// - modoTécnico()
// - animarPensando()
// - guardarHistorial()

document.querySelector("button").addEventListener("click", sendMessage);
