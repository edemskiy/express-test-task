const Foreman = require("../models/foreman");
const Utils = require("../utils");

const foremansRouter = require("express").Router();

foremansRouter.route("/").get((req, res) => {
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

foremansRouter.route("/").post((req, res) => {
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

module.exports = foremansRouter;
