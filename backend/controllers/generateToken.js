import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VIDEO_SDK_API_KEY;
const SECRET = process.env.VIDEO_SDK_SECRET;

const options = {
  expiresIn: "120m",
  algorithm: "HS256",
};

// const token = jwt.sign(payload, SECRET, options);
// console.log(token);
const createMeetingToken = async (req, res) => {
  const { roomId } = req.body;
  const payload = {
    apikey: API_KEY,
    permissions: [`allow_join`], // `ask_join` || `allow_mod`
    version: 2, //OPTIONAL
    roomId: roomId, //OPTIONAL //OPTIONAL
    roles: ["crawler", "rtc"], //OPTIONAL
  };
  const token = jwt.sign(payload, SECRET, options);
  res.json(token);
};

export { createMeetingToken };
