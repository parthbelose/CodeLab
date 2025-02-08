import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const languageSuffix = {
  python: ".py",
  javascript: ".js",
  cpp: ".cpp",
  java: ".java",
};
const codeExecution = async (req, res) => {
  const { code, input, language } = req.body;
  const options = {
    method: "POST",
    url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      language: language,
      stdin: input,
      files: [
        {
          name: `index${languageSuffix[language]}`,
          content: code,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
};

export { codeExecution };
