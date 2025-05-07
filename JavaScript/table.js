// создание таблицы
let showTable = (idTable, data) => {
    let table = d3.select("#" + idTable);

    // создание строк таблицы (столько, сколько элементов в массиве)
    let rows = table
        .selectAll("tr")
        .data(data)
        .enter()
        .append('tr')
        .style("display", "");

    // создание ячеек каждой строки на основе каждого элемента массива
    let cells = rows
        .selectAll("td")
        .data(d => Object.values(d))
        .enter()
        .append("td")
        .text(d => d);

    // создание шапки таблицы
    let head = table
        .insert("tr", "tr")
        .selectAll("th")
        .data(d => Object.keys(data[0]))
        .enter()
        .append("th")
        .text(d => d);
}


//вкл/выкл таблу 
function showHideTable(idTable, dataForm) {
    const btnValues = ["Показать таблицу", "Скрыть таблицу"];
    const newInd = 1 - btnValues.indexOf(dataForm.tableManager.value);

    let newValue = btnValues[newInd];
    dataForm.tableManager.value = newValue;

    let displayState = "";
    if(newInd === 0) {
        displayState = "none";
    }
    let table = d3.select("#" + idTable);
    table.style("display", displayState);
}