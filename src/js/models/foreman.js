const mongoose = require("mongoose");

const foremanShema = new mongoose.Schema({
  Прораб: { type: String, required: true },
  "Дата приема на работу": { type: Date, required: true },
  "Дата увольнения": { type: Date },
  "Количество слетов": { type: Number },
  "Количество успешных объектов": { type: Number },
  created_at: { type: Date, default: Date.now }
});

const Foreman = mongoose.model("Foreman", foremanShema);
module.exports = Foreman;
