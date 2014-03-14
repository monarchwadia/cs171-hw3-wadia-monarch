        /**
         * Created by hen on 2/20/14.
         */
        var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;
        var xAxis, xScale, yAxis,  yScale, line_PopulationBureau;
        var allPopulationPoints = [];
        var allYears = [];
        var dataSet_PopulationBureau;
        var columnNames;
        var color = d3.scale.category10();
        var interpolationColor = d3.scale.linear()
                                    .domain([-1, 0, 1])
                                    .range(["red", "white", "green"]);
        var maximumPopulation;
        var minimumPopulation;
        var maximumYear;
        var minimumYear;
        var visFrame;
        var lineFunction = [];
        var path = [];
        var dataSetExtract = [];

        var startFlag = [];
        var endFlag = [];

        var theinterpolator = [];

        var selectedData = [];
        var indexMap = [];

        var indexPairs = [];

        margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        };

        width = 1250 - margin.left - margin.right;

        height = 700 - margin.bottom - margin.top;

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

        // d3.select("#tablediv").attr({max-height: 600px});


        d3.csv("../data.csv", function(data) {

            dataSet = data;
            dataSet.forEach(function(d){
                if(d!="") d.year = new Date(new Date("Jan 1").setUTCFullYear(d.year));

            });

            columnNames = d3.map(dataSet[0]).keys();
            columnNames.splice(columnNames.indexOf("year"), 1);

            dataSet.forEach(function(d){
                allPopulationPoints.push(d.HYDE, d.Maddison, d.PopulationBureau, d.UN, d.USCensus);
                allYears.push(d.year);
            });
            maximumPopulation = d3.max(allPopulationPoints, function(d){ if(d!="") return +d });
            minimumPopulation = d3.min(allPopulationPoints, function(d){ if(d!="") return +d });
            maximumYear = d3.max(allYears, function(d){if(d!="") return +d});
            minimumYear = d3.min(allYears, function(d){if(d!="") return +d});



            // create scales with minimum and maximum values

            xScale = d3.time.scale()
                    .domain([minimumYear, maximumYear])
                    .range([0, bbVis.w]);
            yScale = d3.scale.linear()
                    .domain([maximumPopulation, 0])
                    .range([0, bbVis.h]);
            // create Axes with scales
            yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickFormat(function(d){
                        x = d3.format(".3s");
                        return x(d).replace(/G/, 'B')
                    });

            xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(d3.time.years, 250)
                    .tickSize(-bbVis.h)
                    .tickFormat((function(d,i){
                        return d.getUTCFullYear();
                    }));

            //line function


            // example that translates to the bottom left of our vis space:
            visFrame = svg.append("g").attr({
                "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
                "class": "estimates"
            });

            visFrame.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, "+bbVis.h+")")
                    .call(xAxis)
                    .append("text")
                        .attr("y", +20)
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

            return createVis();

        });


        createVis = function() {

            
                                
            columnNames.forEach(function(n){

                theinterpolator[n] = d3.scale.linear();
                dataSetExtract[n] = [];

                indexMap[n] = [];
                dataSet.forEach(function(d,i){if(d[n]!=""){indexMap[n].push(i)}});
                startFlag[n] = d3.min(indexMap[n]);
                endFlag[n] = d3.max(indexMap[n]);

                indexPairs[n] = d3.pairs(indexMap[n]);





                indexPairs[n].forEach(function(d,i){
                    if(d[1]-d[0]>1){
                    theinterpolator[n]
                        .domain([d[0], d[1]])
                        .range([ dataSet[d[0]][n], dataSet[d[1]][n] ]);
                    for(x=d[0]+1; x<=d[1]-1; x++){
                        // console.log(dataSet[x][n], theinterpolator([n](x)));
                        dataSet[x][n] += theinterpolator[n](x);
                        dataSet[x]["interpolated"+n] = -1;
                    }
                }});

                for(i=startFlag[n]; i<=endFlag[n]; i++){
                    dataSetExtract[n].push(dataSet[i]);
                }

          


            lineFunction[n] = d3.svg.line()
                .x(function(d){return xScale(d["year"])})
                .y(function(d){return yScale(d[n])})
                ;

            
             
            svg
            .append("g")
                .append("svg:path")
                .attr("class", "path")
                .attr("id", n)
                .attr("d", lineFunction[n](dataSetExtract[n]))
                .attr("stroke", color(n))
                .attr("fill", "none")
                .attr("transform", "translate(" + bbVis.x + "," + "0)");

            svg.selectAll(".overview .dots")
                .data(dataSetExtract[n])
                .enter()
            .append("circle")
                .attr("class", "overview dots")
                .attr("cx", function(d,i){return xScale(d["year"])})
                .attr("cy", function(d,i){return yScale(d[n])})
                .attr("transform", "translate(" + bbVis.x + "," + "0)")
                .attr("r", 3)
                .style("fill", function(d){
                    if(d["interpolated"+n]) {
                        return interpolationColor(-1)
                    } else {
                        return interpolationColor(1);
                    }
                    
                })
                .attr("stroke", color(n))
            });
        };

        

