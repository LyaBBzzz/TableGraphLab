function createArrGraph(data, key, states) {
    let groupObj = d3.group(data, d => d[key]); // группа по ключу 
    let arrGraph = [];

    for (let entry of groupObj) {
        let values = entry[1].map(d => d['Высота']); //массив высот
        let result = [];

        //инимум максимум в зависимости от флагов
        if (states[0]) result.push(d3.min(values)); // мин
        if (states[1]) result.push(d3.max(values)); // макс

        arrGraph.push({ labelX: entry[0], values: result }); // объект с меткой и значениями
    }

    return arrGraph;
}

//отрисовка графика
function drawGraph(data) {
    const keyX = d3.select("input[name='oxvalue']:checked").attr("value"); //выбранное значение по оси X
    const states = [
        document.getElementById("minis").checked, // включен мин
        document.getElementById("maxis").checked  // включен ли макс
    ];

    let flag = states.some(i => i); //проверяем выбрано ли значение
    if (!flag) {
        //ошибкв
        d3.select("input[name='oyvalue']").node().parentNode.classList.add("error");
        return;
    }

    d3.select("input[name='oyvalue']").node().parentNode.classList.remove("error");

    //данные для графика
    let arrGraph = createArrGraph(data, keyX, states);

    // если ось X — год сортируем по возрастанию
    if (keyX === "Год") {
        arrGraph = arrGraph.sort((a, b) => +a.labelX - +b.labelX);
    }

    //инициализация свг
    let svg = d3.select("svg");
    svg.selectAll('*').remove(); // очищаем график
    svg.style("width", 800)
       .style("height", 400);

    //параметры области графика
    let attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    };

    //создаем оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area);

    //график
    createChart(svg, arrGraph, scX, scY, attr_area, ["blue", "red"], states, d3.select("select").node().value);
}

//создание осей графика
function createAxis(svg, data, attr_area) {
    const flatValues = data.flatMap(d => d.values);
    const [min, max] = d3.extent(flatValues); // находим мин и макс значения

    // шкала по оси X
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.1);

    // шкала по оси Y
    let scaleY = d3.scaleLinear()
        .domain([Math.floor(min * 0.85), Math.ceil(max * 1.15)])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // ось X
    let axisX = d3.axisBottom(scaleX);
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");

    // ось Y
    let axisY = d3.axisLeft(scaleY);
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

//построение на графике
function createChart(svg, data, scaleX, scaleY, attr_area, colors, states, type) {
    const r = 4; 

    if (type == 0) { // если выбран тип с точками
        for (let i in states) {
            if (states[i]) {
                svg.selectAll(".dot" + i)
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("r", r)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", d => scaleY(d.values[states[0] && states[1] ? i : 0]))
                    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
                    .style("fill", colors[i]);
            }
        }
    } else { //если гистограмма 
        for (let i in states) {
            if (states[i]) {
                svg.selectAll(".line" + i)
                    .data(data)
                    .enter()
                    .append("line")
                    .attr("x1", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("x2", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("y1", d => scaleY(d.values[states[0] && states[1] ? i : 0]))
                    .attr("y2", d => 300) 
                    .attr("transform", `translate(${attr_area.marginX + (i * 2 - 1) * 2.5}, ${attr_area.marginY})`)
                    .style("stroke", colors[i])
                    .style("stroke-width", "5px");
            }
        }
    }
}

// удал ошибки при изменении чекбоксов
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("minis").addEventListener("change", function () {
        d3.select("input[name='oyvalue']").node().parentNode.classList.remove("error");
    });
    document.getElementById("maxis").addEventListener("change", function () {
        d3.select("input[name='oyvalue']").node().parentNode.classList.remove("error");
    });
});
