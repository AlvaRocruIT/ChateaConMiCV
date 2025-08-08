// main.js

const resBox = document.getElementById("response");
const inputBox = document.getElementById("userInput");

async function sendMessage() {
  const input = inputBox.value.trim();
  if (!input) {
    resBox.innerText = "¿Podrías escribir una pregunta o comentario?";
    return;
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
