var convertToInt;
convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};


var bbDetail, bbOverview, dataSet, detaSetNoHeader, svg, detailGraph, overviewGraph, dataSetDates, dataSetWomensHealth;
var yScaleDetail,
    yScaleOverview,
    xScale,
    overviewLine,
    detailLine;

var dataSetDatesMin,
    dataSetDatesMax,
    dataWomensHealthMin,
    dataWomensHealthMax;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;


bbOverview = {
    x: 0,
    y: 25,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};



dataSet = [];


svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + 0 + ")"
    });

detailGraph = svg.append("g").attr({
    transform: "translate(" + bbDetail.x + "," + bbDetail.y + ")"
});

overviewGraph = svg.append("g").attr({
    transform: "translate(" + bbOverview.x + "," + bbOverview.y + ")"
});


d3.csv("unHealth.csv", function(data) {
    console.log(dataSet = data);
    dataSetDates = data.map(function(d,i){
        var object = new Date(d["Analysis Date"]);
        return object;
    });
    dataSetWomensHealth = data.map(function(d,i){
        var object = parseInt(d["Women's Health"]);
        return object;
    });
    // console.log(dataSet);
    dataSetDatesMin = d3.min(dataSetDates);
    dataSetDatesMax = d3.max(dataSetDates);
    dataWomensHealthMin = d3.min(dataSetWomensHealth);
    dataWomensHealthMax = d3.max(dataSetWomensHealth);
    createVis();
});





function createVis(){
    svg.data(dataSet);
    console.log(dataSet);
    // console.log(dataWomensHealthMin, dataWomensHealthMax);
    yScaleOverview = d3.scale.linear()
        .domain([dataWomensHealthMin, dataWomensHealthMax])
        .range([bbOverview.y + bbOverview.h + margin.top, 0 + margin.top + bbOverview.h]);

    yScaleDetail = d3.scale.linear()
        .domain([dataWomensHealthMin, dataWomensHealthMax])
        .range([bbDetail.y + bbDetail.h + margin.top, 0 + margin.top + bbDetail.h]);
        // .range([ bbDetail.y, bbDetail.h + (-bbOverview.h) + (-bbDetail.y)]);

    xScale = d3.time.scale()
        // .domain([0, dataSetDates.length])
        .domain([dataSetDatesMin, dataSetDatesMax])
        .range([0, width]);

    overviewLine = d3.svg.line()
        .x(function(d,i){var object; console.log(object = new Date(dataSet[i]["Analysis Date"])); return xScale(object)})
        .y(function(d,i){return yScaleOverview(parseInt(dataSet[i]["Women's Health"]))})

    detailLine = d3.svg.line()
        .x(function(d,i){var object; console.log(object = new Date(dataSet[i]["Analysis Date"])); return xScale(object)})
        .y(function(d,i){return yScaleDetail(parseInt(dataSet[i]["Women's Health"]))})



    overviewGraph.append("svg:path")
        .attr("d", overviewLine(dataSetWomensHealth))
        .attr("id", "overviewLine");
    detailGraph.append("svg:path")
        .attr("d", detailLine(dataSetWomensHealth))
        .attr("id", "overviewLine");

    yAxisDetail = d3.svg.axis()
        .scale(yScaleDetail)
        .orient("left");

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(d3.time.months, 3)
        .tickSize(0)
        .tickPadding(8);;

    detailGraph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, "+bbDetail.h+")")
        .call(xAxis)
        .append("text")
        .attr("y", 25)
        .attr("x", width/2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Year");

 }