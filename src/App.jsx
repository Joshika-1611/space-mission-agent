
import { useState } from "react";
import "./App.css";

function App() {
  // =========================
  // TELEMETRY STATE
  // =========================

  const [battery, setBattery] = useState("");
  const [temperature, setTemperature] = useState("");
  const [communication, setCommunication] = useState("Strong");
  const [fuel, setFuel] = useState("");

  // =========================
  // AGENT STATE
  // =========================

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentStep, setAgentStep] = useState("");

  // =========================
  // MISSION HISTORY
  // =========================

  const [history, setHistory] = useState([]);
  const [missionName, setMissionName] = useState("Custom Mission");

  // =========================
  // MISSION SCENARIOS
  // =========================

  const scenarios = {
    satellite: {
      battery: 18,
      temperature: 82,
      communication: "Weak",
      fuel: 64,
    },

    lunar: {
      battery: 72,
      temperature: 55,
      communication: "Strong",
      fuel: 48,
    },

    mars: {
      battery: 31,
      temperature: 76,
      communication: "Weak",
      fuel: 28,
    },
  };

  // =========================
  // LOAD SCENARIO
  // =========================

  const loadScenario = (type) => {
    const scenario = scenarios[type];

    setBattery(scenario.battery);
    setTemperature(scenario.temperature);
    setCommunication(scenario.communication);
    setFuel(scenario.fuel);

    if (type === "satellite") {
      setMissionName("Satellite");
    }

    if (type === "lunar") {
      setMissionName("Lunar Mission");
    }

    if (type === "mars") {
      setMissionName("Mars Rover");
    }

    setResult("");
    setAgentStep("");
  };

  // =========================
  // ANALYZE MISSION
  // =========================

  const analyzeMission = async () => {
    if (
      battery === "" ||
      temperature === "" ||
      fuel === ""
    ) {
      setResult(
        "⚠️ Please enter all mission telemetry values."
      );

      return;
    }

    setLoading(true);
    setResult("");

    // STEP 1
    setAgentStep(
      "🔍 Analyzer Agent: Reading telemetry..."
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    // STEP 2
    setAgentStep(
      "🧠 Decision Agent: Evaluating risks..."
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            battery,
            temperature,
            communication,
            fuel,
          }),
        }
      );

      const data = await response.json();

      // STEP 3
      setAgentStep(
        "⚙️ Action Agent: Generating actions..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      if (data.success) {
        setResult(data.result);

        // Detect risk
        const detectedRisk =
          data.result.includes("HIGH")
            ? "HIGH"
            : data.result.includes("MEDIUM")
            ? "MEDIUM"
            : "LOW";

        // Save mission to history
        const newMission = {
          mission: missionName,
          battery: battery,
          temperature: temperature,
          communication: communication,
          fuel: fuel,
          risk: detectedRisk,
          time: new Date().toLocaleTimeString(),
        };

        setHistory((previousHistory) => [
          newMission,
          ...previousHistory,
        ]);

        setAgentStep(
          "✅ All agents completed successfully"
        );
      } else {
        setResult(
          "❌ Mission analysis failed."
        );

        setAgentStep(
          "❌ Agent execution failed"
        );
      }
    } catch (error) {
      console.error(error);

      setResult(
        "❌ Could not connect to backend."
      );

      setAgentStep(
        "❌ Backend connection failed"
      );
    }

    setLoading(false);
  };

  // =========================
  // EXTRACT RISK
  // =========================

  const getRisk = () => {
    if (result.includes("HIGH")) {
      return "HIGH";
    }

    if (result.includes("MEDIUM")) {
      return "MEDIUM";
    }

    return "LOW";
  };

  // =========================
  // EXTRACT DECISION
  // =========================

  const getDecision = () => {
    if (!result.includes("DECISION:")) {
      return "";
    }

    const part = result.split("DECISION:")[1];

    return part
      .split("ACTIONS:")[0]
      .trim();
  };

  // =========================
  // EXTRACT ACTIONS
  // =========================

  const getActions = () => {
    if (!result.includes("ACTIONS:")) {
      return [];
    }

    const part = result.split("ACTIONS:")[1];

    const actionsPart = part.split("REASON:")[0];

    return actionsPart
      .split("\n")
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "")
          .trim()
      )
      .filter((line) => line !== "");
  };

  const risk = getRisk();
  const decision = getDecision();
  const actions = getActions();

  // =========================
  // UI
  // =========================

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div>
          <h1>
            🚀 SPACE MISSION CONTROL
          </h1>

          <p>
            AI-Powered Autonomous Mission Monitoring
          </p>
        </div>

        <div className="online">
          ● SYSTEM ONLINE
        </div>

      </header>

      {/* =========================
          DASHBOARD
      ========================= */}

      <main className="dashboard">

        {/* =========================
            TELEMETRY
        ========================= */}

        <section className="card">

          <h2>
            🛰️ Mission Telemetry
          </h2>

          <p className="description">
            Select a mission scenario or enter
            spacecraft conditions.
          </p>

          {/* SCENARIOS */}

          <div className="scenarios">

            <button
              className="scenario-btn"
              onClick={() =>
                loadScenario("satellite")
              }
            >
              🛰️ Satellite
            </button>

            <button
              className="scenario-btn"
              onClick={() =>
                loadScenario("lunar")
              }
            >
              🌕 Lunar Mission
            </button>

            <button
              className="scenario-btn"
              onClick={() =>
                loadScenario("mars")
              }
            >
              🔴 Mars Rover
            </button>

          </div>

          {/* BATTERY */}

          <div className="input-group">

            <label>
              🔋 Battery Level
            </label>

            <input
              type="number"
              value={battery}
              onChange={(e) =>
                setBattery(e.target.value)
              }
              placeholder="Example: 18"
            />

            <span>%</span>

          </div>

          {/* TEMPERATURE */}

          <div className="input-group">

            <label>
              🌡️ Temperature
            </label>

            <input
              type="number"
              value={temperature}
              onChange={(e) =>
                setTemperature(e.target.value)
              }
              placeholder="Example: 82"
            />

            <span>°C</span>

          </div>

          {/* COMMUNICATION */}

          <div className="input-group">

            <label>
              📡 Communication
            </label>

            <select
              value={communication}
              onChange={(e) =>
                setCommunication(e.target.value)
              }
            >
              <option>Strong</option>
              <option>Weak</option>
              <option>Lost</option>
            </select>

          </div>

          {/* FUEL */}

          <div className="input-group">

            <label>
              ⛽ Fuel Level
            </label>

            <input
              type="number"
              value={fuel}
              onChange={(e) =>
                setFuel(e.target.value)
              }
              placeholder="Example: 64"
            />

            <span>%</span>

          </div>

          {/* ANALYZE BUTTON */}

          <button
            className="analyze-btn"
            onClick={analyzeMission}
            disabled={loading}
          >
            {loading
              ? "🤖 AGENTS WORKING..."
              : "🚀 ANALYZE MISSION"}
          </button>

        </section>

        {/* =========================
            AGENT ACTIVITY
        ========================= */}

        <section className="card agent-card">

          <h2>
            🤖 Agent Activity
          </h2>

          <p className="description">
            Autonomous decision-making pipeline.
          </p>

          {/* ANALYZER */}

          <div className="agent-step">

            <div className="step-icon">
              🔍
            </div>

            <div>
              <strong>
                Analyzer Agent
              </strong>

              <p>
                Reads spacecraft telemetry
              </p>
            </div>

          </div>

          <div className="line"></div>

          {/* DECISION */}

          <div className="agent-step">

            <div className="step-icon">
              🧠
            </div>

            <div>
              <strong>
                Decision Agent
              </strong>

              <p>
                Evaluates mission risks
              </p>
            </div>

          </div>

          <div className="line"></div>

          {/* ACTION */}

          <div className="agent-step">

            <div className="step-icon">
              ⚙️
            </div>

            <div>
              <strong>
                Action Agent
              </strong>

              <p>
                Generates mission actions
              </p>
            </div>

          </div>

          {/* STATUS */}

          {agentStep && (
            <div className="agent-status">
              {agentStep}
            </div>
          )}

        </section>

        {/* =========================
            MISSION RESULT
        ========================= */}

        {result && (

          <section className="mission-result">

            {/* RISK */}

            <div className="risk-card">

              <div className="result-icon">

                {risk === "HIGH"
                  ? "🔴"
                  : risk === "MEDIUM"
                  ? "🟡"
                  : "🟢"}

              </div>

              <div>

                <p className="result-label">
                  MISSION RISK
                </p>

                <h2>
                  {risk}
                </h2>

              </div>

            </div>

            {/* DECISION */}

            <div className="decision-card">

              <div className="card-icon">
                🧠
              </div>

              <div>

                <p className="result-label">
                  MISSION DECISION
                </p>

                <h3>
                  {decision}
                </h3>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="actions-card">

              <div className="card-icon">
                ⚙️
              </div>

              <div className="actions-content">

                <p className="result-label">
                  RECOMMENDED ACTIONS
                </p>

                {actions.map(
                  (action, index) => (

                    <div
                      className="action-item"
                      key={index}
                    >

                      <span>
                        ✓
                      </span>

                      <p>
                        {action}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* RAW REPORT */}

            <details className="raw-report">

              <summary>
                View complete agent report
              </summary>

              <pre>
                {result}
              </pre>

            </details>

          </section>

        )}

        {/* =========================
            MISSION HISTORY
        ========================= */}

        {history.length > 0 && (

          <section className="history-card">

            <h2>
              📋 Mission History
            </h2>

            <p className="description">
              Previous autonomous mission decisions.
            </p>

            <div className="history-list">

              {history.map(
                (item, index) => (

                  <div
                    className="history-item"
                    key={index}
                  >

                    <div>

                      <strong>
                        {item.mission}
                      </strong>

                      <p>
                        🔋 {item.battery}%
                        {" | "}
                        🌡️ {item.temperature}°C
                        {" | "}
                        📡 {item.communication}
                        {" | "}
                        ⛽ {item.fuel}%
                      </p>

                    </div>

                    <div className="history-right">

                      <span
                        className={
                          item.risk === "HIGH"
                            ? "risk-high"
                            : item.risk === "MEDIUM"
                            ? "risk-medium"
                            : "risk-low"
                        }
                      >
                        {item.risk}
                      </span>

                      <small>
                        {item.time}
                      </small>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;