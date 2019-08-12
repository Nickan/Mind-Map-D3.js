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