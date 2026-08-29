import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test backend
app.get("/", (req, res) => {
  res.send("🚀 Space Mission Agent Backend is Running!");
});

// Analyze mission
app.post("/api/analyze", async (req, res) => {
  try {
    const {
      battery,
      temperature,
      communication,
      fuel
    } = req.body;

    // -----------------------------
    // AI AGENT PROMPT
    // -----------------------------

    const prompt = `
You are a Space Mission Decision Agent.

Analyze the following spacecraft telemetry:

Battery: ${battery}%
Temperature: ${temperature}°C
Communication: ${communication}
Fuel: ${fuel}%

Perform these steps:

1. Analyze the spacecraft condition.
2. Identify possible risks.
3. Determine the mission risk level.
4. Make a mission decision.
5. Recommend specific actions.

Return the result in this format:

RISK LEVEL:
DECISION:

ACTIONS:
1.
2.
3.
4.

REASON:
`;

    // -----------------------------
    // TRY OPENAI
    // -----------------------------

    try {

      const response = await client.responses.create({
        model: "gpt-5.6",
        input: prompt,
      });

      console.log("🤖 OpenAI Agent used");

      return res.json({
        success: true,
        result: response.output_text,
        source: "AI"
      });

    } catch (aiError) {

      console.log(
        "⚠️ OpenAI unavailable. Using local mission agent."
      );

      // -----------------------------
      // LOCAL AGENT
      // -----------------------------

      let risk = "LOW";

      let decision =
        "Continue normal mission operations.";

      const actions = [];

      // Battery analysis
      if (Number(battery) < 20) {

        risk = "HIGH";

        actions.push(
          "Enter power-saving mode."
        );

        actions.push(
          "Disable non-essential systems."
        );
      }

      // Temperature analysis
      if (Number(temperature) > 80) {

        risk = "HIGH";

        actions.push(
          "Reduce spacecraft workload."
        );

        actions.push(
          "Monitor temperature closely."
        );
      }

      // Communication analysis
      if (
        communication === "Weak" ||
        communication === "Lost"
      ) {

        risk = "HIGH";

        actions.push(
          "Attempt communication recovery."
        );

        actions.push(
          "Send emergency telemetry."
        );
      }

      // Fuel analysis
      if (Number(fuel) < 25) {

        risk = "HIGH";

        actions.push(
          "Reduce unnecessary maneuvers."
        );

        actions.push(
          "Conserve remaining fuel."
        );
      }

      // If no risks
      if (actions.length === 0) {

        actions.push(
          "Continue monitoring spacecraft telemetry."
        );

        actions.push(
          "Maintain normal mission operations."
        );
      }

      // Mission decision
      if (risk === "HIGH") {

        decision =
          "Activate mission safety protocol.";

      }

      // -----------------------------
      // CREATE MISSION REPORT
      // -----------------------------

      const result = `
RISK LEVEL:
${risk}

DECISION:
${decision}

ACTIONS:
${actions
  .map((action, index) => `${index + 1}. ${action}`)
  .join("\n")}

REASON:
The mission agent analyzed the spacecraft telemetry and identified the most important operational risks.

AGENT WORKFLOW:
Telemetry analyzed
↓
Risks evaluated
↓
Mission decision made
↓
Actions generated

AGENT MODE:
Local Mission Agent
`;

      return res.json({
        success: true,
        result: result,
        source: "LOCAL_AGENT"
      });
    }

  } catch (error) {

    console.error("❌ Server Error:", error);

    res.status(500).json({
      success: false,
      error: "Mission analysis failed."
    });
  }
});

// -----------------------------
// START SERVER
// -----------------------------

app.listen(5000, () => {

  console.log(
    "🚀 Backend running at http://localhost:5000"
  );

});