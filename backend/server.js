// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Submissions file
const SUB_FILE = path.join(__dirname, "submissions.json");
if (!fs.existsSync(SUB_FILE)) fs.writeFileSync(SUB_FILE, "[]", "utf8");

// POST /api/contact  (expects JSON: { name, company, email, phone, message })
app.post("/api/contact", (req, res) => {
  const { name, company, email, phone, message } = req.body;
  if (!name || !email || !phone) return res.status(400).json({ success: false, message: "Name, email and phone are required." });

  const submission = {
    id: Date.now(),
    name,
    company: company || "",
    email,
    phone,
    message: message || "",
    receivedAt: new Date().toISOString(),
  };

  try {
    const raw = fs.readFileSync(SUB_FILE, "utf8");
    const arr = JSON.parse(raw || "[]");
    arr.push(submission);
    fs.writeFileSync(SUB_FILE, JSON.stringify(arr, null, 2), "utf8");
    return res.json({ success: true, message: "Submission received." });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Optional: get submissions for testing (remove in production)
app.get("/api/submissions", (req, res) => {
  try {
    const raw = fs.readFileSync(SUB_FILE, "utf8");
    res.json({ success: true, submissions: JSON.parse(raw || "[]") });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to read submissions." });
  }
});

// Catch-all to serve frontend (works for static multi-page site)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
