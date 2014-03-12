var convertToInt;
convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};


var bbDetail, bbOverview, dataSet, detaSetNoHeader, svg, detailGraph, overviewGraph, dataSetDates, dataSetWomensHealth;
var yScaleDetail,
    yScaleOverview,
    xScaleOverview,
    xScaleDetail,
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
    // console.log(dataWomensHealthMin, dataWomensHealthMax);
    yScaleOverview = d3.scale.linear()
        .domain([0, dataWomensHealthMax])
        .range([bbOverview.y + bbOverview.h + margin.top, 0 + margin.top]);
    xScaleOverview = d3.time.scale()
        // .domain([0, dataSetDates.length])
        .domain([dataSetDatesMin, dataSetDatesMax])
        .range([0, width]);
    overviewLine = d3.svg.line()
        .x(function(d,i){var object; console.log(object = new Date(d["Analysis Date"])); return xScaleOverview(object)})
        .y(function(d,i){return yScaleOverview(parseInt(d["Women's Health"]))});





    brush = d3.svg.brush().x(xScaleOverview).on("brush", doBrush);



    //Drawing Axes
    xAxisOverview = d3.svg.axis()
        .scale(xScaleOverview)
        .orient("bottom")
        .ticks(d3.time.months, 3)
        // .tickFormat(d3.time.format('%a %d'))
        .tickSize(0)
        .tickPadding(8);

    yAxisOverview = d3.svg.axis()
        .scale(yScaleOverview)
        .orient("left")
        .ticks(3)
        .tickSize(0)
        .tickPadding(8);

    overviewGraph.append("g")
        .attr("class", "x axis")
        .attr("id", "overviewAxis")
        .attr("transform", "translate(0, "+(bbOverview.y + bbOverview.h + margin.top)+")")
        .attr("pointer-events", "none")
        .call(xAxisOverview);

    overviewGraph.append("g")
        .attr("class", "y axis")
        .attr("id", "overviewAxisY")
        .call(yAxisOverview);

    overviewGraph.append("svg:path")
        .attr("d", overviewLine(dataSet))
        .attr("id", "overviewLine");

    overviewGraph.selectAll(".dots")
        .data(dataSet)
        .enter()
    .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i){return xScaleOverview(new Date(d["Analysis Date"]))})
        .attr("cy", function(d,i){return yScaleOverview(d["Women's Health"])})
        .attr("r", 2)
        .style("fill", "navy")
        .style("stroke", "navy");

        drawDetail();
 }
function drawDetail(){

    if (detailGraph) {
        detailGraph.remove();
    }

    detailGraph = svg.append("g").attr({
        transform: "translate(" + bbDetail.x + "," + bbDetail.y + ")"
    });
    
    xScaleDetail = d3.time.scale()
        .domain([dataSetDatesMin, dataSetDatesMax])
        .range([0, width]);
    yScaleDetail = d3.scale.linear()
        .domain([0, dataWomensHealthMax])
        .range([bbDetail.y + bbDetail.h + margin.top, bbOverview.y + bbOverview.h + 30]);
    detailLine = d3.svg.area()
        .x(function(d,i){var object; console.log(object = new Date(d["Analysis Date"])); return xScaleDetail(object)})
        .y1(function(d,i){return yScaleDetail(parseInt(d["Women's Health"]))})
        .y0(bbDetail.y + bbDetail.h + margin.top);



    xAxisDetail = d3.svg.axis()
        .scale(xScaleDetail)
        .orient("bottom")
        .ticks(d3.time.months, 3)
        // .tickFormat(d3.time.format('%a %d'))
        .tickSize(0)
        .tickPadding(8);

    yAxisDetail = d3.svg.axis()
        .scale(yScaleDetail)
        .orient("left")
        .ticks(5)
        .tickSize(0)
        .tickPadding(8);   

    detailGraph.append("g")
        .attr("class", "x axis")
        .attr("id", "detailAxis")
        .attr("transform", "translate(0, "+(bbDetail.y + bbDetail.h + margin.top)+")")
        .call(xAxisDetail);
    detailGraph.append("g")
        .attr("class", "y axis")
        .attr("id", "overviewAxisY")
        .call(yAxisDetail);
    detailGraph.append("svg:path")
        .attr("d", detailLine(dataSet))
        .attr("id", "detailArea");        

    detailGraph.selectAll(".dots")
        .data(dataSet)
        .enter()
    .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i){return xScaleDetail(new Date(d["Analysis Date"]))})
        .attr("cy", function(d,i){return yScaleDetail(d["Women's Health"])})
        .attr("r", 2)
        .style("fill", "navy")
        .style("stroke", "navy");

    detailGraph.append("g").attr("class", "brush").call(brush)
        .selectAll("rect").attr({
            height: bbOverview.h + margin.top,
            transform: "translate(0, "+ (-margin.top) +")"
        })
    detailGraph.select(".background").attr({
            height: bbOverview.h + margin.top + 20,
            transform: "translate(0, "+ (-margin.top) +")"
        })
}
 function doBrush(e){
    console.log(brush.extent());

 }