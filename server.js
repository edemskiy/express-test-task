const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const foremansRouter = require("./src/js/routes/foremans");

require("dotenv").config();
const app = express();
const port = process.env.port || 5000;

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
/*
app.post("/foremans", (req, res) => {
  const allowedKeys = Object.keys(req.body[0]);
  Foreman.deleteMany({}, err => {
    if (err) console.log(err);

    Foreman.insertMany(
      req.body.map(foreman => Utils.convertForemanDataTypes(foreman))
    )
      .then(data => {
        let filtered = data.map(foreman =>
          Object.keys(foreman.toJSON())
            .filter(key => allowedKeys.includes(key))
            .reduce((obj, key) => {
              const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              };
              obj[key] =
                foreman[key] instanceof Date
                  ? foreman[key]
                      .toLocaleDateString("ru", options)
                      .split("-")
                      .reverse()
                      .join(".")
                      .replace(/\//g, ".")
                  : foreman[key];
              return obj;
            }, {})
        );
        res.status(200).json(filtered);
      })
      .catch(err => console.log(err));
  });
});

app.get("/foremans", (req, res) => {
  Foreman.find(
    {},
    {
      "Дата приема на работу": 1,
      Прораб: 1,
      "Дата увольнения": 1,
      "Количество слетов": 1,
      "Количество успешных объектов": 1,
      _id: 0
    }
  ).then(foremans => res.json(foremans));
});
*/

app.listen(port, () => console.log(`listening on port ${port}`));
