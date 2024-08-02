const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const OnBoardRoute = require("./routes/OnBoardRoute");
const cashQuesterRoute = require("../Server/routes/cashQuesterRoute");
const cashMasterRoute = require("../Server/routes/cashMasterRoute");

const app = express();

//env variables
require('dotenv').config();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000",],
  credentials: true
}));
app.use(cookieParser());

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



