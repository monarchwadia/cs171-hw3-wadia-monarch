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
        var columnNames2 = ["USCensus","PopulationBureau","UN","HYDE","Maddison"]
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

        var brush;
        var BFormat = function(x){
            var billionsFormat = d3.format(".3s");
            return billionsFormat(x).replace(/G/, 'B')
        }
        

        var table = d3.select("table");

        margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        };

        width = 900 - margin.left - margin.right;

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




        d3.csv("../data.csv", function(data) {

            dataSet = data;
            dataSet.forEach(function(d, i){
                if(d!="") d.year = new Date(new Date("Jan 1").setUTCFullYear(d.year));
                d["thisindex"] = i;

            });

            columnNames = d3.map(dataSet[0]).keys();
            // columnNames.splice(columnNames.indexOf("year"), 1);
            columnNames.splice(columnNames.indexOf("thisindex"), 1);

            dataSet.forEach(function(d){
                allPopulationPoints.push(d.HYDE, d.Maddison, d.PopulationBureau, d.UN, d.USCensus);
                allYears.push(d.year);
            });
            maximumPopulation = d3.max(allPopulationPoints, function(d){ if(d!="") return +d });
            minimumPopulation = d3.min(allPopulationPoints, function(d){ if(d!="") return +d });
            maximumYear = d3.max(allYears, function(d){if(d!="") return +d});
            minimumYear = d3.min(allYears, function(d){if(d!="") return +d});



            // create scales with minimum and maximum values

            xScale = d3.scale.linear()
                    .domain([0,dataSet.length-1])
                    .range([0, bbVis.w]);
            yScale = d3.scale.linear()
                    .domain([maximumPopulation, minimumPopulation])
                    .range([0, bbVis.h]);
            // create Axes with scales
            yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(dataSet.length-1)
                    .tickSize(-bbVis.w)
                    .tickFormat((function(d,i){
                        if(i%2 == 0 || i==dataSet.length) {
                         
                        return BFormat(d);
                        }
                    }));

            xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(dataSet.length-1)
                    .tickSize(-bbVis.h)
                    .tickFormat((function(d,i){
                        if(i%4 == 0) return dataSet[i]["year"].getUTCFullYear();
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

            brush = d3.svg.brush()
            .x(xScale)
            // .y(yScale)
            .on("brush", function(){
                if(brush.empty()==true){
                    
                } else {
                    doBrush();
                }
            });

            svg.select("g").append("g").attr("class", "brush").call(brush)
            .selectAll("rect").attr({
                height: bbVis.h + margin.top,
                transform: "translate("+0+","+ (margin.top-margin.bottom) +")"
            });

            return createVis();

        });

        function doBrush(){
            var extent1 = brush.extent()[0];
            var extent2 = brush.extent()[1];
            // leftB = extent1[0];
            // bottomB = extent1[1];
            // rightB = extent2[0];
            // topB = extent2[1];
            leftB=extent1;
            rightB=extent2;



            // console.log(topB, leftB, rightB, bottomB);
            // var returnObject = [];
            // d3.selectAll("circle").filter(function(d,i){
            selectionObject = [];
            dataSet.forEach(function(d,i){
                // console.log(d);
                var selections = [];
                for(x=0; x<columnNames.length; x++){
                    if((1==1) 
                        && (+d["thisindex"] >=leftB && +d["thisindex"] <= rightB)) {
                        selections.push(columnNames[x])
                    }
                }
                returnObject = {};
                for(x=0; x<selections.length; x++){
                    returnObject[selections[x]] = d[selections[x]];
                    returnObject["thisindex"] = d["thisindex"];
                    if(d["interpolated"+selections[x]]){ returnObject["interpolated"+selections[x]] = d["interpolated"+selections[x]]};
                }
                if(returnObject["thisindex"]) selectionObject.push(returnObject);

            });
            // console.log(selectionObject);
            createTable(selectionObject)
                

        }

        function createTable(selectionObject) {

            table.html("");
            thead = table.append("thead");
            thead.append("tr").html(function(){
                        var returnString = "";
                        columnNames.forEach(function(e,j){
                             returnString += "<th>"+ e+"</th>";
                        });
                        return returnString;
            })
            tbody = table.append("tbody");
            rows = tbody.selectAll("tr")
                .data(selectionObject)
                .enter()
                    .append("tr")
                    .html(function(d,i){
                        var returnString = "";
                        columnNames.forEach(function(e,j){
                            if(j==0){
                                x = d[e].getUTCFullYear();
                            } else {
                            x = BFormat(Math.floor(d[e]) || "");
                        }
                            if(x == 0)x="";
                             returnString += "<td>"+ x+"</td>";
                        });
                        return returnString;
                    });



       
        }


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

            
             
            // svg
            // .append("g")
            //     .append("svg:path")
            //     .attr("class", "path")
            //     .attr("id", n)
            //     .attr("d", lineFunction[n](dataSetExtract[n]))
            //     .attr("stroke", color(n))
            //     .attr("fill", "none")
            //     .attr("transform", "translate(" + bbVis.x + "," + "0)");

            svg.selectAll(".overview .dots")
                .data(dataSetExtract[n])
                .enter()
            .append("circle")
                .attr("class", function(d,i){return "overview dots " + n + " " + d[n]})
                .attr("cx", function(d,i){return xScale(d["thisindex"])})
                .attr("cy", function(d,i){return yScale(d[n])})
                .attr("transform", "translate(" + bbVis.x + "," + "0)")
                .attr("r", 3)
                .style("fill", color(n))
                .attr("stroke", color(n))
            });
        };

        

