const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   LOGIN ROUTE
========================= */

app.post("/login", async (req, res) => {

  try {

    const response = await axios.post(
      "http://10.0.2.67:5000/login",
      req.body
    );

    res.json(response.data);

  } catch (err) {

    res.status(401).json({ message: "Invalid credentials" });

  }

});

/* =========================
   PAYMENT ROUTE
========================= */

app.post("/pay", async (req, res) => {

  try {

    const response = await axios.post(
      "http://10.0.2.67:5000/pay",
      req.body
    );

    res.json(response.data);

  } catch (err) {

    res.status(500).send(err.message);

  }

});

/* =========================
   GET TRANSACTIONS
========================= */

app.get("/transactions/:account_id", async (req, res) => {

  try {

    const response = await axios.get(
      `http://10.0.2.67:5000/transactions/${req.params.account_id}`
    );

    res.json(response.data);

  } catch (err) {

    res.status(500).send(err.message);

  }

});

/* =========================
   HEALTH CHECK (Optional)
========================= */

app.get("/", (req, res) => {
  res.send("API Service is running");
});

/* =========================
   START SERVER
========================= */

app.listen(4000, () => {
  console.log("API Service running on port 4000");
});