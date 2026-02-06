const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const data = require("./data");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

/* ===== AUTH ===== */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = data.users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: "mock-token",
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  });
});

app.post("/api/register", (req, res) => {
  res.json({ message: "Registered (mock)" });
});

/* ===== ROUTES ===== */
app.get("/api/routes", (req, res) => {
  res.json(data.routes);
});

/* ===== INCIDENTS ===== */
app.get("/api/incidents", (req, res) => {
  res.json(data.incidents);
});

/* ===== NOTIFICATIONS ===== */
app.get("/api/notifications", (req, res) => {
  res.json([]);
});

/* ===== SOCKET.IO (MOCK) ===== */
io.on("connection", socket => {
  console.log("Client connected");

  socket.on("sendLocation", coords => {
    socket.broadcast.emit("receiveLocation", coords);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

/* ===== START SERVER ===== */
server.listen(3000, () => {
  console.log("Mock backend running at http://localhost:3000");
});
