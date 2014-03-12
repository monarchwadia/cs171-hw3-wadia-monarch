1. Name the HTML element (type and class) that represents the interactive area.
  * The interactive area is represented by "rect", of class "background", whose visibility is set to "hidden" and cursor is set to "crosshair"
2. Name the HTML element (type and class) that is used for representing the selection.
  * The selection area is also represented by "rect", of class "extent", and cursor is set to "move". This element's visibility is set to "visible"
3. What are the other DOM elements for?
 * The elements can be represented as follows:
```
  * <g class="brush"> - this is the container element for the brush. the "pointer event" changes to "none" on mousedown and "all" on mouseup, preventing any inadvertant drag-highlighting by the user. The opacity is set to 0 to make this "invisible"
    * <rect class="background"> - this is a mouse-interactive element that allows us to click and drag the brush, resizing it to suit our needs.
    * <rect class="extent"> - this is the visible portion of the brush itself, and graphically represents the brush selection.
    * <g class="resize e"> - this is a grouping element that contains the right-hand-side handlebar
      * <rect> - this is the right-hand-side handlebar of the element that lets us resize the brush
    * <g class="resize w"> - this is a grouping element that contains the left-hand-side handlebar
      * <rect> - this is the left-hand-side handlebar of the element that lets us resize the brush
```
