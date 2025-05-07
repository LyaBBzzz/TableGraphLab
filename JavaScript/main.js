document.addEventListener("DOMContentLoaded", function() {
    showTable('build', buildings);

    d3.select("input[value='Построить'").on("click", function(){
       drawGraph(buildings);
    });
})