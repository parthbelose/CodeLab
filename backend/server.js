import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { ExecRouter } from "./routes/codeExecutionCont.js";
import { codeRouter } from "./routes/codeGeneratorRoute.js";
import { collaborationSockets } from "./sockets/collaboration.js";
import { AuthRouter } from "./routes/authRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows all origins (Not recommended for production)
    methods: ["GET", "POST"],
  },
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/editor", ExecRouter);
app.use("/editor", codeRouter);
app.use("/auth", AuthRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// Initialize Socket.io collaboration
collaborationSockets(io);

server.listen(port, () => {
  // console.log(`Server running on http://localhost:${port}`);
});

export default app;
