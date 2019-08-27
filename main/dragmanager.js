class DragManager {
  constructor() {
  }

  init(root) {
    let currentPos = [];
    let globalConnection = this.globalConnection;
    this.initEventListeners();

    let defaultX;
    let defaultY;

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
        defaultX = d.x;
        defaultY = d.y;
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
        // Set the position of the dragged circle to the mouse coord
          // Set circle position
          // To mouse coord
        // Get the nearest new parent
          // How?
            // Study the existing code
              // It used the mouseover pointer-events of the existing ghostCircle
                // Process
                  // For node detection!
                    // Create ghost circle
                    // Invisible by default
                    // Will show when a node is being dragged
                    // Then set the data if mouse is over it
                  // Line drawing
                    // Can be defer later?
                      // Alternative
                        // Make the new potential parent glow?
                      // Or just make it now
          // Should be compatible with change of sibling level
            // Implementation
              // If draggedNode.x < newParent.x
                // Swap sibling level
              // Has to be 

        // UI to identify which will be the potential parent
          // UI
            // Ghost aura?
            // Potential line
        // Cancellable
          // Return to its previous state
        setToMousePosition(d, this);
        
        function setToMousePosition(d, t) {
          let node = d3.select(t);
          d.x += d3.event.dy;
          d.y += d3.event.dx;
          node.attr("transform", `translate(${d.y},${d.x})`);
        }
      })
      .on("end", function(d) {
        hideDetectorCircle();
        enableTextPointerEvent(d, this);
        setNewParent(d, this, globalConnection);

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
            console.log("parent " + p.data.name);
            globalConnection.deleteNodeData(d);
            // globalConnection.onCreateNewChild(p, d.data.name);

            Event.dispatchEvent(Event.APPEND_NODE, {
              appendTo: p,
              toAppend: d
            });
          } else {
            // console.log("selected node undefined");
            let node = d3.select(t);
            d.x = defaultX;
            d.y = defaultY;
            node.attr("transform", `translate(${defaultY},${defaultX})`);
          }
          
        }
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

  initEventListeners() {
    // window.addEventListener(Event.APPEND_NODE_SUCCESS, (e) => {
    //   Event.dispatchEvent(Event.UPDATE_TREE, )
    //   let e = new CustomEvent(Event.UPDATE_TREE, {detail: {nodeSource: d.parent}});
    //   window.dispatchEvent(e);
    // });
  }
}