import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { codeRouter as codeGeneratorRouter } from "./routes/codeGeneratorRoute.js";
import {ExecRouter as codeExecutionRouter} from "./routes/codeExecutionCont.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // CORS with default settings
app.use(express.json()); // Parse JSON bodies
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logging for development
}

// Routes
app.use("/editor", codeGeneratorRouter,codeExecutionRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// Server listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
