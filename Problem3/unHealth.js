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
    left: 100
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
        .domain([0, dataWomensHealthMax])
        .range([bbOverview.y + bbOverview.h + margin.top, 0 + margin.top]);

    yScaleDetail = d3.scale.linear()
        .domain([0, dataWomensHealthMax])
        .range([bbDetail.y + bbDetail.h + margin.top, bbOverview.y + bbOverview.h + 30]);
        // .range([ bbDetail.y, bbDetail.h + (-bbOverview.h) + (-bbDetail.y)]);

    xScale = d3.time.scale()
        // .domain([0, dataSetDates.length])
        .domain([dataSetDatesMin, dataSetDatesMax])
        .range([0, width]);

    overviewLine = d3.svg.line()
        .x(function(d,i){var object; console.log(object = new Date(dataSet[i]["Analysis Date"])); return xScale(object)})
        .y(function(d,i){return yScaleOverview(parseInt(dataSet[i]["Women's Health"]))})

    detailLine = d3.svg.area()
        .x(function(d,i){var object; console.log(object = new Date(dataSet[i]["Analysis Date"])); return xScale(object)})
        .y1(function(d,i){return yScaleDetail(parseInt(dataSet[i]["Women's Health"]))})
        .y0(bbDetail.y + bbDetail.h + margin.top)
    // .y1(function(d) { return y(d.y); });




    yAxisOverview = d3.svg.axis()
        .scale(yScaleOverview)
        .orient("left")
        .ticks(3)
        .tickSize(0)
        .tickPadding(8);

    yAxisDetail = d3.svg.axis()
        .scale(yScaleDetail)
        .orient("left")
        .ticks(5)
        .tickSize(0)
        .tickPadding(8);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(d3.time.months, 3)
        // .tickFormat(d3.time.format('%a %d'))
        .tickSize(0)
        .tickPadding(8);



    svg.append("svg:defs").append("svg:marker")
        .attr("id", "circleMarker")
        .attr("viewBox", "-20 -20 50 50")
        .attr("refX", "5")
        .attr("refY", "5")
        .attr("markerWidth", "4")
        .attr("markerHeight", "4")
        .append("circle")
        .attr("cx", "6")
        .attr("cy", "6")
        .attr("r", "20")
        .style("stroke-width", "1")
        .style("fill", "blue")
        .style("stroke", "blue");

    //Drawing Axes
    detailGraph.append("g")
        .attr("class", "x axis")
        .attr("id", "detailAxis")
        .attr("transform", "translate(0, "+(bbDetail.y + bbDetail.h + margin.top)+")")
        .call(xAxis);

    overviewGraph.append("g")
        .attr("class", "x axis")
        .attr("id", "overviewAxis")
        .attr("transform", "translate(0, "+(bbOverview.y + bbOverview.h + margin.top)+")")
        .call(xAxis);

    overviewGraph.append("g")
        .attr("class", "y axis")
        .attr("id", "overviewAxisY")
        .call(yAxisOverview);

    detailGraph.append("g")
        .attr("class", "y axis")
        .attr("id", "overviewAxisY")
        .call(yAxisDetail);


    overviewGraph.append("svg:path")
        .attr("d", overviewLine(dataSetWomensHealth))
        .attr("id", "overviewLine");

    detailGraph.append("svg:path")
        .attr("d", detailLine(dataSetWomensHealth))
        .attr("id", "detailArea");        


    overviewGraph.selectAll(".dots")
        .data(dataSet)
        .enter()
    .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i){return xScale(new Date(d["Analysis Date"]))})
        .attr("cy", function(d,i){return yScaleOverview(d["Women's Health"])})
        .attr("r", 2)
        .style("fill", "navy")
        .style("stroke", "navy")

    detailGraph.selectAll(".dots")
        .data(dataSet)
        .enter()
    .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i){return xScale(new Date(d["Analysis Date"]))})
        .attr("cy", function(d,i){return yScaleDetail(d["Women's Health"])})
        .attr("r", 2)
        .style("fill", "navy")
        .style("stroke", "navy")


 }