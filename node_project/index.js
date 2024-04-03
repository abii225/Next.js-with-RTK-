const express = require("express");
require("dotenv").config();
const { authRouter } = require("./Routes/auth.route");
const { connection } = require("./DB/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

/**
 *
 */
const port = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
// app.use(cors())

app.get("/", (req, res) => {
  res.send("homePage");
});

app.use("/", authRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("DB connected");
    console.log("server is running", `http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
});
