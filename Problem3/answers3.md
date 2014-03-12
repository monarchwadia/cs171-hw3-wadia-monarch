1. Name the HTML element (type and class) that represents the interactive area.
  * The interactive area is represented by "rect", of class "background", whose visibility is set to "hidden" and cursor is set to "crosshair"
2. Name the HTML element (type and class) that is used for representing the selection.
  * The selection area is also represented by "rect", of class "extent", and cursor is set to "move". This element's visibility is set to "visible"
3. What are the other DOM elements for?
The elements can be represented as follows:
  * <g class="brush"> - this is the container. the "pointer event" changes to "none" 
    * <rect class="background">
    * <rect class="extent">
    * <g class="resize e">
      * <rect>
    * <g class="resize w">
      * <rect>
