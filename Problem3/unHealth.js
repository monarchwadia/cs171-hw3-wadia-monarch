var convertToInt;
convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};
var x;

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
}).style({
    float: "left"
}).append("g").attr({
        transform: "translate(" + margin.left + "," + 0 + ")"
    });


d3.select("html").append("h1").text("Major Events");
var event1 = d3.select("html").append("div");
event1.append("h2").text(" Feb 8, 2012: Women's Heart Disease Prevention -").style({"color": "black", cursor:"pointer"});
event1.append("p").style({"color": "black", cursor:"pointer"}).text("As part of American Heart Month, on Wednesday, Feb. 8, 2012, the National Heart, Lung, and Blood Institute's (NHLBI's) The Heart Truth campaign, with the support of the Foundation for the National Institutes of Health (FNIH), will showcase its signature event, the Red Dress Collection 2012 at Mercedes-Benz Fashion Week in New York City. As part of its 10th anniversary this year, The Heart Truth has partnered with Million Hearts, a national initiative of the U.S. Department of Health and Human Services, to prevent one million heart attacks and strokes over the next five years.");
event1.on("click", function(){
    goToEvent("Nov 23, 2011", "Apr 25, 2012")
});



var event2 = d3.select("html").append("div");
event2.append("h2").text("July 31, 2012:  Health care law gives free preventive services to 47 million women").style({"color": "black", cursor:"pointer"});
event2.append("p").style({"color": "black", cursor:"pointer"}).text("Previously some insurance companies did not cover these preventive services for women at all under their health plans, while some women had to pay deductibles or copays for the care they needed to stay healthy. The new rules in the health care law requiring coverage of these services take effect at the next renewal date – on or after Aug. 1, 2012—for most health insurance plans. For the first time ever, women will have access to even more life-saving preventive care free of charge.");
event2.on("click", function(){
    goToEvent("June 21, 2012", "Aug 30, 2012")
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
        .range([0, width])
        .clamp(true);
    overviewLine = d3.svg.line()
        .x(function(d,i){var object; object = new Date(d["Analysis Date"]); return xScaleOverview(object)})
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
        .tickSize(-width)
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

    overviewGraph.selectAll(".overview .dots")
        .data(dataSet)
        .enter()
    .append("circle")
        .attr("class", "overview dots")
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
    
    dataSetParameter = dataSet;

    // startDate = new Date(brushEvent[0]);
    // startYear = startDate.getUTCFullYear();
    // startMonth = startDate.getUTCMonth();
    // startDate = startDate.getUTCDate();
    // startFlag = false;
    // endDate = new Date(brushEvent[1]);
    // endYear = endDate.getUTCFullYear();
    // endMonth = endDate.getUTCMonth();
    // endDate = endDate.getUTCDate();
    // endFlag = false;

    // for(d=0; d<dataSet.length; d++){
    //     var thisDate = new Date(dataSet[d]["Analysis Date"]);
    //     thisYear = thisDate.getUTCFullYear();
    //     thisMonth = thisDate.getUTCMonth();
    //     thisDate = thisDate.getUTCDate();
    //     if(startYear == thisYear && startMonth == thisMonth && startDate == thisDate){
    //         startFlag = true;
    //     }
    //     if(endYear == thisYear && endMonth == thisMonth && endDate == thisDate){
    //         endFlag = true;
    //     }

    //     if(startFlag == true){
    //         dataSetParameter.push(dataSet[d]);
    //         if(endFlag == true){

    //         }
    //     }


    // };


    dataSetDatesP = dataSetParameter.map(function(d,i){
        var object = new Date(d["Analysis Date"]);
        return object;
    });
    dataSetWomensHealthP = dataSetParameter.map(function(d,i){
        var object = parseInt(d["Women's Health"]);
        return object;
    });

    dataSetDatesMinP = d3.min(dataSetDatesP);
    dataSetDatesMaxP = d3.max(dataSetDatesP);
    dataWomensHealthMinP = d3.min(dataSetWomensHealthP);
    dataWomensHealthMaxP = d3.max(dataSetWomensHealthP);

    detailGraph = svg.append("g").attr({
        transform: "translate(" + bbDetail.x + "," + bbDetail.y + ")"
    });

    xScaleDetail = d3.time.scale()
        .domain([dataSetDatesMinP, dataSetDatesMaxP])
        .range([0, width]);
    yScaleDetail = d3.scale.linear()
        .domain([0, dataWomensHealthMaxP])
        .range([bbDetail.y + bbDetail.h + margin.top, bbOverview.y + bbOverview.h + 30]);
    detailLine = d3.svg.area()
        .x(function(d,i){var object; object = new Date(d["Analysis Date"]); return xScaleDetail(object)})
        .y1(function(d,i){return yScaleDetail(parseInt(d["Women's Health"]))})
        .y0(bbDetail.y + bbDetail.h + margin.top);



    xAxisDetail = d3.svg.axis()
        .scale(xScaleDetail)
        .orient("bottom")
        // .ticks(d3.time.months, 3)
        // .tickFormat(d3.time.format('%m %y'))
        .tickSize(0)
        .tickPadding(8);

    yAxisDetail = d3.svg.axis()
        .scale(yScaleDetail)
        .orient("left")
        .ticks(5)
        .tickSize(-width)
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
        .attr("d", detailLine(dataSetParameter))
        .attr("id", "detailArea");        

    detailGraph.selectAll(".dots")
        .data(dataSetParameter)
        .enter()
    .append("circle")
        .attr("class", "detail dots")
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

 function doBrush(){
    leftScale = brush.extent()[0];
    rightScale = brush.extent()[1];
    xScaleDetail
        .domain([leftScale, rightScale])
        .clamp(true);

    d3.select("#detailArea")
        .attr("d", detailLine(dataSet))
        .attr("transform", null)
    .transition()
        .ease("linear");

    d3.selectAll(".detail.dots")
        .attr("cx", function(d,i){return xScaleDetail(new Date(d["Analysis Date"]))})
        .attr("transform", null)
    .transition()
        .ease("linear")

    d3.select("#detailAxis")
        .call(xAxisDetail)
        .attr("transform", null)
        .attr("transform", "translate(0, "+(bbDetail.y + bbDetail.h + margin.top)+")")
    .transition()
        .ease("linear")




  //   drawDetail(brush.extent());

  //   dataSet = dataSet.map(function(d,i){if(i<5){return d}})
  //   detailGraph.select("g")
  //   .attr("d", detailLine(dataSet))
  //   .attr("transform", null)
  // .transition()
  //   .ease("linear")


 }

 function goToEvent(date1, date2){
    x = new Date(date1);
    y = new Date(date2);
    brush.extent([x, y]);
    d3.selectAll(".brush").call(brush);
    doBrush();
 }