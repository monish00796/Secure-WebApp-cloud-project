const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   DATABASE CONNECTION
========================= */

const db = mysql.createConnection({
  host: "database-1.c74e0usig97j.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "CloudProject5",
  database: "cloud_project", // change if using different DB
  port: 3306
});

db.connect(err => {
  if (err) {
    console.log("Database connection error:", err);
  } else {
    console.log("Connected to RDS");
  }
});

/* =========================
   LOGIN (DB VALIDATION)
========================= */

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (err, results) => {

    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    // ⚠️ For demo (plain password)
    if (user.password !== password) {

      /* LOG SECURITY EVENT */
      db.query(
        "INSERT INTO security_events (user_id, event_type, description) VALUES (?, ?, ?)",
        [user.user_id, "FAILED_LOGIN", "Invalid password attempt"]
      );

      return res.status(401).json({ message: "Invalid password" });
    }

    /* LOG AUDIT EVENT */
    db.query(
      "INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)",
      [user.user_id, "LOGIN_SUCCESS", req.ip]
    );

    res.json({
      message: "Login successful",
      user_id: user.user_id
    });

  });

});

/* =========================
   CREATE PAYMENT
========================= */

app.post("/pay", (req, res) => {

  const { account_id, amount, merchant_name } = req.body;

  if (!account_id || !amount) {
    return res.status(400).json({ message: "Missing payment data" });
  }

  const transactionQuery =
    "INSERT INTO transactions (amount, transaction_type, status) VALUES (?,?,?,?)";

  db.query(
    transactionQuery,
    [ amount, "payment", "success"],
    (err, result) => {

      if (err) return res.status(500).send(err);

      const transaction_id = result.insertId;

      const paymentQuery =
        "INSERT INTO payments (transaction_id, merchant_name, amount, status) VALUES (?,?,?,?)";

      db.query(
        paymentQuery,
        [transaction_id, merchant_name, amount, "completed"],
        (err2) => {

          if (err2) return res.status(500).send(err2);

          /* AUDIT LOG */
          db.query(
            "INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)",
            [1, "PAYMENT_MADE", req.ip] // replace 1 with actual user_id if available
          );

          res.json({
            message: "Payment Successful",
            transaction_id
          });

        }
      );

    }
  );

});

/* =========================
   FETCH TRANSACTIONS
========================= */

app.get("/transactions/:account_id", (req, res) => {

  const query = `
    SELECT
      t.transaction_id,
      t.amount,
      t.transaction_type,
      t.status,
      t.created_at,
      p.merchant_name
    FROM transactions t
    LEFT JOIN payments p
    ON t.transaction_id = p.transaction_id
    WHERE t.account_id = ?
    ORDER BY t.created_at DESC
  `;

  db.query(query, [req.params.account_id], (err, result) => {

    if (err) return res.status(500).send(err);

    res.json(result);

  });

});

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("Payment Service is running");
});

/* =========================
   START SERVER
========================= */

app.listen(5000, "0.0.0.0", () => {
  console.log("Payment Service running on port 5000");
});
