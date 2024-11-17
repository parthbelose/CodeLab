import express from "express";
import { codeExecution } from "../controllers/codeExecution.js";

const ExecRouter = express.Router();

ExecRouter.post("/executeCode", codeExecution);

export { ExecRouter };
