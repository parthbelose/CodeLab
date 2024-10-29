import express from "express";
import { generateCode } from "../controllers/codeGeneratorControllers.js";

const codeRouter = express.Router();

codeRouter.post("/generatecode", generateCode);

export { codeRouter };
