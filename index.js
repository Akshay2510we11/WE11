const express = require("express");
const app = express();

// Home route
app.get("/", (req, res) => {
  res.send("WE11 App Running Successfully 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});