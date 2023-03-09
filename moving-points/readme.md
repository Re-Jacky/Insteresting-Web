# Moving Points
This is a short demo that uses the Canvas to draw some points and lines that connect them.
We have the following properties to control the graph:
1. <b>count</b>: the total number of the points
2. <b>threshold</b>: the minimum distance between the points that make them connect with each other
3. <b>speed</b>: the moving speed of all the points

You can call <b><i>graph.move()</i></b> and <b><i>graph.stop()</i></b> to control the animation of the points.
And you can hover on a point and drag it to another place.

### Note: Since the whole thing is on the canvas, I redraw the whole canvas on every move, so the performance could be bad when:
1. The total point count becomes large
2. When you drag a point and move quickly