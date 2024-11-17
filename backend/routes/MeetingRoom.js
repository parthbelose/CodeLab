import express from "express";
import { createMeetingToken } from "../controllers/generateToken.js";
const MeetingRouter = express.Router();

MeetingRouter.post("/generateRoom", createMeetingToken);

export { MeetingRouter };
