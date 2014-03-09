/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    width = 960 - margin.left - margin.right;

    height = 300 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: -height,
        w: width - 100,
        h: height
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


    d3.csv("../data.csv", function(data) {

        dataSet = data;
        console.log(dataSet);

        return createVis();
    });

    createVis = function() {
        var xAxis, xScale, yAxis,  yScale;
        var allPopulationPoints = [];
        var allYears = [];

        // determine maximum and minimum populations

        dataSet.forEach(function(d){allPopulationPoints.push(d.HYDE, d.Maddison, d.PopulationBureau, d.UN, d.USCensus)});
        var maximumPopulation = d3.max(allPopulationPoints, function(d){ if(d!="") return +d });
        var minimumPopulation = d3.min(allPopulationPoints, function(d){ if(d!="") return +d });

        // determine maximum and minimum dates

        dataSet.forEach(function(d){ allYears.push(d.year)});
        var maximumYear = new Date(Date.UTC(0,0,1)).setUTCFullYear( d3.max(allYears, function(d){if(d!="") return +d}));
        var minimumYear = new Date(Date.UTC(0,0,1)).setUTCFullYear( d3.min(allYears, function(d){if(d!="") return +d}));

        // create scales with minimum and maximum values

        xScale = d3.time.scale()
            .domain([minimumYear, maximumYear])
            .range([0, bbVis.w]);
        yScale = d3.scale.linear()
            .range([0, bbVis.h])
            .domain([minimumPopulation, maximumPopulation]);

        // create Axes with scales
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");


		// example that translates to the bottom left of our vis space:
		var visFrame = svg.append("g").attr({
		    "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
            "class": "estimates",

		  //....	  
		});
		  // visFrame.append("rect");
		  //....
		  
        //attach the x  
        visFrame.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, "+bbVis.h+")")
            .call(xAxis)
        .append("text")
            .attr("y", 25)
            .attr("x", width/2)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Year");

        visFrame.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");




    };
