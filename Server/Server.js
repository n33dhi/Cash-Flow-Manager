const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const OnBoardRoute = require("./routes/OnBoardRoute");
const cashQuesterRoute = require("./routes/cashQuesterRoute");
const cashMasterRoute = require("./routes/cashMasterRoute");

const app = express();

//env variables
require('dotenv').config();

app.use(cookieParser());
app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'https://pettywallet-client.web.app'];
app.use(cors({
  credentials: true,
  origin: allowedOrigins
}));


//ROUTES
app.get("/", (req, res) => {
  res.send("Hello from PettyWallet Server!");
});

app.use("/", OnBoardRoute);
app.use("/cashQuester", cashQuesterRoute);
app.use("/cashMaster", cashMasterRoute);


//DB CONFIG
mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("Database Connection Establised");
    app.listen(process.env.PORT || 3002, () => {
      console.log(`Server listening at port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("DB Connection Failed!!!");
  });



