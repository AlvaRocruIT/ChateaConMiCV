// main.js

const resBox = document.getElementById("response");
const inputBox = document.getElementById("userInput");

// Puedes alternar entre modo test y producción
const WEBHOOK_URL = "https://alvarovargas.app.n8n.cloud/webhook-test/ChateaConMiCV"; // ← Usa webhook-test para desarrollo

async function sendMessage() {
  const input = inputBox.value.trim();
  if (!input) {
    resBox.innerText = "¿Podrías escribir una pregunta o comentario?";
    return;
  }
  
 animarPensando();

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: input }) // ← Asegúrate que n8n lea "pregunta"
    });

    const data = await response.json();
    resBox.innerText = data.respuesta || "No se recibió respuesta.";

    guardarHistorial(input, data.respuesta);
  } catch (error) {
    resBox.innerText = "Ups, algo no salió bien. ¿Quieres intentar con otra pregunta?";
    console.error("Error en la solicitud:", error);
  }
}

// 🎯 Funciones complementarias

function animarPensando() {
  resBox.innerText = "Estoy reflexionando sobre eso... dame un momento.";
}

function guardarHistorial(pregunta, respuesta) {
  console.log("Historial:", { pregunta, respuesta });
  // Aquí podrías guardar en localStorage, enviar a una API, etc.
}

// 🎯 Evento de envío
document.querySelector("button").addEventListener("click", sendMessage);
