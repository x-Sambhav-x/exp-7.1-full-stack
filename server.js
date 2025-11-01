const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Express API!" });
});

app.post("/api/send", (req, res) => {
  const { name } = req.body;
  res.json({ reply: `Message received from ${name}` });
});

app.listen(5000, () => console.log("API running on http://localhost:5000"));
