import dotenv from "dotenv";
dotenv.config();

const authToken = async (req, res) => {
  try {
    const token = process.env.VIDEO_SDK_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Token not found in environment variables" });
    }
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while fetching the token" });
  }
};

export { authToken };
