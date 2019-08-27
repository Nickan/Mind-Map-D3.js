class DragManager {
  constructor() {
  }

  init(root) {
    let currentPos = [];
    let globalConnection = this.globalConnection;
    this.initEventListeners();

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
    
    let dx = 0;
    let dy = 0;
    d3.selectAll('circle.node')
    .call(d3.drag()
      .on("start", function(d) {
        showDetectorCircle();
        disableTextPointerEvent(d, this);

        function showDetectorCircle() {
          d3.selectAll(".detectorCircle")
          .style("display", "block");
        }

        function disableTextPointerEvent(d, node) {
          d3.selectAll(".text-rect")
          .style("pointer-events", "none");
          d3.selectAll(".text-wrap")
          .style("pointer-events", "none");

          d3.select(node)
          .style("pointer-events", "none");
        }
          
      })
      .on("drag", function(d) {
        setToMousePosition(d, this);
        setDescendantsVisibility(d, false);
        
        function setToMousePosition(d, t) {
          let node = d3.select(t);
          dx += d3.event.dy;
          dy += d3.event.dx;
          node.attr("transform", `translate(${dy},${dx})`);
        }
      })
      .on("end", function(d) {
        // setDescendantsVisibility(d, true);
        resetCirclePosition(this);
        hideDetectorCircle();
        enableTextPointerEvent(d, this);
        setNewParent(d, this, globalConnection);
        

        function resetCirclePosition(dNode) {
          dx = 0;
          dy = 0;
          let e = d3.select(dNode);
          e.attr("transform", `translate(${dy},${dx})`);
        }

        function hideDetectorCircle() {
          d3.selectAll(".detectorCircle")
          .style("display", "none");
        }

        function enableTextPointerEvent(d, node) {
          d3.selectAll(".text-rect")
          .style("pointer-events", "auto");
          d3.selectAll(".text-wrap")
          .style("pointer-events", "auto");
          d3.select(node)
          .style("pointer-events", "auto");
        }

        function setNewParent(d, t, globalConnection) {
          let p = globalConnection.selectedNode;
          if (p != undefined && p != d) {
            globalConnection.deleteNodeData(d);
            Event.dispatchEvent(Event.APPEND_NODE, {
              appendTo: p,
              toAppend: d
            });
          } else {
            let node = d3.select(t);
            d.x = 0;
            d.y = 0;
            node.attr("transform", `translate(${d.y},${d.x})`);
          }
          
        }
      })
    );

    function setDescendantsVisibility(nodeD, visible) {
      setNodeDDescendantsVisibility(nodeD, visible);
      d3.selectAll(".detectorCircle")
      .style("display", function(d) {
        if (d.data.visible == undefined)
          return "block";

        if (d.data.visible)
          return "block";
        return "none";
      });
      
      function setNodeDDescendantsVisibility(nodeD, visible) {
        let c = nodeD.children;
        if (c != undefined) {
          for (let i = 0; i < c.length; i++) {
            let child = c[i];
            child.data.visible = visible;
            setNodeDDescendantsVisibility(child, visible);
          }
        }
      }
    }

    

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

  initEventListeners() {
    // window.addEventListener(Event.APPEND_NODE_SUCCESS, (e) => {
    //   Event.dispatchEvent(Event.UPDATE_TREE, )
    //   let e = new CustomEvent(Event.UPDATE_TREE, {detail: {nodeSource: d.parent}});
    //   window.dispatchEvent(e);
    // });
  }
}