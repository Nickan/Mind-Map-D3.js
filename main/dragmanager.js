class DragManager {
  constructor() {
  }

  init(root) {
    let currentPos = [];

    d3.select('body')
      .call(d3.drag()
        .on('start', function() {
          let m = d3.mouse(this);
          currentPos[0] = m[0];
          currentPos[1] = m[1];
        })
        .on("drag", function() {
          dragScreen(this);
          
        })
        .on("end", function() {

        })
      );

    d3.selectAll('g.node')
    .call(d3.drag()
      .on("start", function(d) {
        // ???
        console.log('start');
        d.x0 = d.x;
        d.y0 = d.y;
        console.log(`${d.x0}, ${d.y0}`);
      })
      .on("drag", function(d) {
        console.log('drag');
        // Set the position of the dragged circle to the mouse coord
          // Set circle position
          // To mouse coord
        // UI to identify which will be the potential parent
          // UI
            // Ghost aura?
            // Potential line
        // Cancellable
          // Return to its previous state
        setToMousePosition(d, this);

        function setToMousePosition(d, t) {
          let node = d3.select(t);
          d.x0 += d3.event.dy;
          d.y0 += d3.event.dx;
          node.attr("transform", `translate(${d.y0},${d.x0})`);
          // console.log(d3.event.dy);
          // console.log(`${d.x}, ${d.y}`);
        }
      })
      .on("end", function() {
        console.log("end");
        // Detect cancellation of changing parent
          // How to detect
      })
    );

    function dragScreen(owner) {
      let g = d3.select('g')
      let t = getTranslation(g);
      let diff = getDiffVar(currentPos, owner);

      let newX = t[0] + diff[0];
      let newY = t[1] + diff[1];
      g.attr('transform', `translate(${newX}, ${newY})`);


      function getDiffVar(currentPos, owner) {
        let m = d3.mouse(owner);
        let diff = getDiff(currentPos, m);
        currentPos[0] = m[0];
        currentPos[1] = m[1];
        return diff;
      }

      function getDiff(currentPos, mPos) {
        let xDiff = mPos[0] - currentPos[0];
        let yDiff = mPos[1] - currentPos[1];
        return [xDiff, yDiff];
      }
  
      function getTranslation(owner) {
        let transform = owner.attr('transform');
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttributeNS(null, "transform", transform);
        var matrix = g.transform.baseVal.consolidate().matrix;
        return [matrix.e, matrix.f];
      }
    }
  }
}