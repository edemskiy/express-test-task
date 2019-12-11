window.addEventListener("load", () => {
  document.querySelector("input").addEventListener("keyup", e => {
    filterForemans(e);
  });
  fetch("/foremans")
    .then(res => res.json())
    .then(foremans => createInfoTable(foremans));
});

function createInfoTable(foremans) {
  const colsNames = [
    "Фамилия",
    "Имя",
    "Отчество",
    "Дата приема на работу",
    "Дата увольнения",
    "Количество рабочих дней",
    "Количество слетов",
    "Количество успешных объектов",
    "Всего объектов",
    "% Слетов"
  ];
  const table = document.createElement("table");

  document.body.appendChild(table);
  trHead = document.createElement("tr");

  for (let col of colsNames) {
    let th = document.createElement("th");
    let content = document.createTextNode(col);

    th.appendChild(content);
    trHead.appendChild(th);
    table.appendChild(trHead);
  }

  for (let foreman of foremans) {
    const tr = document.createElement("tr");

    const [surname, name, middleName] = foreman["Прораб"].split(" ");
    const firstDay = new Date(foreman["Дата приема на работу"]);
    const lastDay = new Date(foreman["Дата увольнения"]);
    const numOfDays = (lastDay - firstDay) / (1000 * 3600 * 24);
    const numOfFails = +foreman["Количество слетов"];
    const numOfSuccess = +foreman["Количество успешных объектов"];
    const totalProjects = numOfFails + numOfSuccess;
    const failRate = Math.floor(100 * (numOfFails / totalProjects)) + "%";

    let formatForeman = {
      Фамилия: surname,
      Имя: name,
      Отчество: middleName,
      "Дата приема на работу": firstDay.toLocaleDateString(),
      "Дата увольнения": lastDay.toLocaleDateString(),
      "Количество рабочих дней": numOfDays,
      "Количество слетов": numOfFails,
      "Количество успешных объектов": numOfSuccess,
      "Всего объектов": totalProjects,
      "% Слетов": failRate
    };
    for (let colName of colsNames) {
      let td = document.createElement("td");
      let content = document.createTextNode(formatForeman[colName] || "");
      td.appendChild(content);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function filterForemans(e) {
  const input = e.target;
  const filter = input.value.toLowerCase();
  const table = document.querySelector("table");
  let trCollection = table.getElementsByTagName("tr");

  for (let tr of trCollection) {
    let surname_td = tr.getElementsByTagName("td")[0];
    let name_td = tr.getElementsByTagName("td")[1];
    let middleName_td = tr.getElementsByTagName("td")[2];

    if (surname_td || name_td || middleName_td) {
      let surnameValue = surname_td.textContent || surname_td.innerText;
      let nameValue = name_td.textContent || name_td.innerText;
      let middleNameValue =
        middleName_td.textContent || middleName_td.innerText;
      if (
        surnameValue.toLowerCase().indexOf(filter) > -1 ||
        nameValue.toLowerCase().indexOf(filter) > -1 ||
        middleNameValue.toLowerCase().indexOf(filter) > -1
      ) {
        tr.style.display = "";
      } else {
        tr.style.display = "none";
      }
    }
  }
}
