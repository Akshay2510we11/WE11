const express = require("express");
const app = express();

app.use(express.json());

// IMPORTANT PORT FIX
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("WE11 App Running Successfully 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});