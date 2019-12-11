const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const foremansRouter = require("./src/js/routes/foremans");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/css", express.static(path.join(__dirname + "/src/css")));
app.use("/js", express.static(path.join(__dirname + "/src/js")));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .catch(err => console.log(`mongoConnectionError: ${err.message}`));

const db = mongoose.connection;
db.once("open", () => {
  console.log("Sucessfully connected to MongoDB");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/html/index.html"));
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/html/upload.html"));
});

app.get("/info", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/html/info.html"));
});

app.use("/foremans", foremansRouter);

app.listen(port, () => console.log(`listening on port ${port}`));
