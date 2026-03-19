const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

/* LOGIN ROUTE */

app.post("/login", async (req, res) => {
  try {
    const response = await axios.post(
      "http://10.0.1.70:4000/login",
      req.body
    );

    res.json(response.data);

  } catch (err) {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

/* PAYMENT ROUTE */

app.post("/pay", async (req, res) => {
  try {
    const response = await axios.post(
      "http://10.0.1.70:4000/pay",
      req.body
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* GET TRANSACTIONS */

app.get("/transactions/:account_id", async (req, res) => {
  try {
    const response = await axios.get(
      `http://10.0.1.70:4000/transactions/${req.params.account_id}`
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("Web App running on port 3000");
});
/*
app.post("/pay", async (req,res)=>{

  try{

    const response = await axios.post(
      "http://10.0.2.199:4000/pay",
      req.body
    )

    res.json(response.data)

  }catch(err){

    res.status(500).send(err.message)

  }

})

app.post("/payment", (req, res) => {
    const { amount, description } = req.body;

    const transaction = {
        id: Date.now(),
        amount,
        description,
        status: "success"
    };

    transactions.push(transaction);

    res.json(transaction);
});
*/

  
 