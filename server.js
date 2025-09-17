const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { json } = require("stream/consumers");

const app = express();
const PORT = 3000;

app.use(cors());           // <<< Разрешаем запросы с фронта
app.use(express.json());   // Чтобы понимать JSON

const USERS_FILE = "users.json";

// Чтение файла
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
  }
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(data);
}

// Запись файла
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Главная
app.get("/", (req, res) => {
  res.send("✅ Сервер работает и CORS включён!");
});

// Получить всех пользователей
app.get("/users", (req, res) => {
  const users = readUsers();
  res.json(users);
});

// Добавить пользователя
app.post("/users", (req, res) => {
  const users = readUsers();
  const newUser = req.body;
  newUser.id = Date.now();
  users.push(newUser);
  writeUsers(users);
  res.json({ message: "✅ Пользователь добавлен", user: newUser });
});

// Удалить пользователя
app.delete("/users/:id", (req, res) => {
  let users = readUsers();
  const userId = Number(req.params.id);
  users = users.filter(u => u.id !== userId);
  writeUsers(users);
  res.json({ message: "🗑 Пользователь удалён", id: userId });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🔥 Сервер запущен: http://localhost:${PORT}`);
});