const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

let messages = [
  {
    role: "system",
    content: "You are Catalogue AI, a tool that answers based strictly on uploaded tool catalogues. If unsure, say 'Not found'."
  }
];

function append(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  append("user", question);
  userInput.value = "";
  messages.push({ role: "user", content: question });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();
  append("bot", data.reply || "No response.");
  messages.push({ role: "assistant", content: data.reply });
});
