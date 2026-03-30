const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection (Railway auto variables use करेगा)
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Table create
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
  );
`);

// Home Page
app.get("/", (req, res) => {
  res.send(`
    <h2>WE11 Login</h2>
    <form action="/login" method="POST">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button>Login</button>
    </form>

    <h2>Signup</h2>
    <form action="/signup" method="POST">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button>Signup</button>
    </form>
  `);
});

// Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hash]
    );
    res.send("User Registered ✅");
  } catch (err) {
    res.send("Username already exists ❌");
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if (result.rows.length === 0) {
    return res.send("User not found ❌");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    res.send("Login Successful 🚀");
  } else {
    res.send("Wrong Password ❌");
  }
});

app.listen(3000, () => {
  console.log("Server running");
});