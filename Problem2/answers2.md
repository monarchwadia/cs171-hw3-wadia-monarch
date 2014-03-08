  1. Look at the data given in the Wiki table. Describe the data types. What is different from the datasets you've used before?
  
    * Looking at the Wikipedia entry [World population estimates](http://en.wikipedia.org/wiki/World_population_estimates)
      * The tabular data lists multiple estimated values for the same data point. 
      * The "Year" column is of Quantitative/Ratio type. The data provided, however, is not regularly spaced. Rather, it jumps multiple years (or even centuries or millennia). It contains values which can be negative (for BC).
      * The population estimates themselves are of the statistical type Quantitative/Ratio. However, it should be noted that in some instances, the data point is a range rather than a discrete number. For example, Durand population estimate for 1970 is "3,600,000,000 to 3,700,000,000"). A computer program, or the person cleaning the data, will have to adjust for this.
      * The datasets given to us in the past were neatly ordered into computer-readable data. The Github data in particular was easy to deal with since it was already arranged in JSON formatting. This dataset, however, is meant to be human readable and hence contains all sorts of irregularities (commas in numbers; range of numbers instead of discrete values; links and special formatting in header names). It will have to be cleaned before being used in a visualization program.





  2. Take a look at the DOM tree for the Wikipedia table. Formulate in jQuery selector syntax the selection that would give you the DOM element for the second row in the Wikipedia table. Write down in selection syntax how you would get all table rows that are not the header row.
    * Selection for the second row in the Wikipedia table (the one right after the "Headers"):
      *  $(".wikitable tr:nth-child(2)")
    * All table rows that are not the header row
      *  $(".wikitable tr + tr")
