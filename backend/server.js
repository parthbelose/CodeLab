import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { ExecRouter } from "./routes/codeExecutionCont.js";
import { codeRouter } from "./routes/codeGeneratorRoute.js";
import { collaborationSockets } from "./sockets/collaboration.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Restrict to requests from localhost:5173
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/editor", ExecRouter);
app.use("/editor", codeRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// Initialize Socket.io collaboration
collaborationSockets(io);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
