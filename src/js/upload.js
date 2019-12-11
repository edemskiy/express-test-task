const url = `https://spreadsheets.google.com/feeds/cells/
1ZZhIPNGGUjFd2AUqUpvxDYmuUJyCNlu4tEQHKkFdFWY/1/public/full?alt=json`;

window.addEventListener("load", () => {
  document.body
    .querySelector("button")
    .addEventListener("click", downloadFromGoogleSheets.bind(null, url));
});

function downloadFromGoogleSheets(url) {
  fetch(url)
    .then(data => data.json())
    .then(data => {
      const foremans = [];
      const entry = data.feed.entry;
      const numOfRows = +entry[entry.length - 1].gs$cell.row;
      const numOfCols = +entry[entry.length - 1].gs$cell.col;

      for (let i = 1; i < numOfRows; i++) {
        let foreman = {};
        for (let j = 0; j < numOfCols; j++) {
          foreman[entry[j].gs$cell.$t] = entry[i * numOfCols + j].gs$cell.$t;
        }
        foremans.push(foreman);
      }
      return new Promise(resolve => resolve(foremans));
    })
    .then(foremans => uploadToMongo(foremans))
    .then(response => response.json())
    .then(foremans => createTableOfForemans(foremans));
}

function uploadToMongo(data) {
  return fetch("/foremans", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function createTableOfForemans(foremans) {
  const colsNames = Object.keys(foremans[0]);
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
    for (let col of colsNames) {
      let td = document.createElement("td");
      let content = document.createTextNode(foreman[col] || "");
      td.appendChild(content);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}
