const convertForemanDataTypes = foreman => ({
  ...foreman,
  "Дата приема на работу": strToDate(foreman["Дата приема на работу"]),
  "Дата увольнения": strToDate(foreman["Дата увольнения"]),
  "Количество слетов": +foreman["Количество слетов"],
  "Количество успешных объектов": +foreman["Количество успешных объектов"]
});

const strToDate = str =>
  new Date(
    str
      .split(".")
      .reverse()
      .join("-")
  );

module.exports = { convertForemanDataTypes };
