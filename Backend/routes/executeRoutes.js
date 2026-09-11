// routes/executeRoutes.js
import express from "express";
import axios from "axios";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";
const JUDGE0_URL = `https://${JUDGE0_HOST}/submissions`;
const C_LANGUAGE_ID = 50; // C (GCC 9.2.0) on Judge0 CE

router.post("/", protect, async (req, res) => {
  const { code, stdin = "" } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "No code provided." });
  }

  try {
    // wait=true makes Judge0 hold the request until execution finishes,
    // so you get the result in one round trip instead of polling.
    const response = await axios.post(
      `${JUDGE0_URL}?base64_encoded=true&wait=true`,
      {
        source_code: Buffer.from(code).toString("base64"),
        language_id: C_LANGUAGE_ID,
        stdin: Buffer.from(stdin).toString("base64"),
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": JUDGE0_HOST,
        },
        timeout: 15000,
      },
    );

    const result = response.data;
    const decode = (b64) =>
      b64 ? Buffer.from(b64, "base64").toString("utf-8") : "";

    const stdout = decode(result.stdout);
    const stderr = decode(result.stderr);
    const compileOutput = decode(result.compile_output);

    // status.id: 6 = Compilation Error, 3 = Accepted, others = runtime issues
    if (result.status.id === 6) {
      return res.json({
        success: false,
        stage: "compile",
        stderr: compileOutput,
      });
    }

    if (result.status.id !== 3) {
      return res.json({
        success: false,
        stage: "runtime",
        stdout,
        stderr,
        statusDescription: result.status.description, // e.g. "Runtime Error", "Time Limit Exceeded"
      });
    }

    return res.json({
      success: true,
      stdout,
      stderr,
      time: result.time,
      memory: result.memory,
    });
  } catch (err) {
    console.error("Judge0 execution error:", err.response?.data || err.message);
    return res.status(502).json({
      error: "Execution engine unavailable. Try again shortly.",
    });
  }
});

export default router;
