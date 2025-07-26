import { createClient } from "https://unpkg.com/multisynq?module";

const chatBox = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const playersDiv = document.getElementById("players");

const username = "user_" + Math.floor(Math.random() * 1000);
const client = await createClient("crazy-chat-room");

let players = {};

client.on("state", (state) => {
  players = state.players || {};
  updatePlayers();
});

client.on("message", (msg) => {
  addMessage(msg.username, msg.text);
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  client.send({ username, text });
  input.value = "";
}

function addMessage(user, text) {
  const div = document.createElement("div");
  div.textContent = `${user}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updatePlayers() {
  playersDiv.innerHTML = "Players:<br>" + Object.keys(players).join("<br>");
}

client.setState({ players: { ...players, [username]: true } });
