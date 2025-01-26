import express from "express";
import { authToken } from "../controllers/authCtrl.js";
const AuthRouter = express.Router();

AuthRouter.get("/authToken", authToken);

export { AuthRouter };
