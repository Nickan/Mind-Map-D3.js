class ElonComponent {
  constructor() {
    this.textManager = new TextManager();
  }

  init() {
    return d3.json('testing.json')
    .then((json) => {
      let margin = {
        top: 20,
        right: 90,
        bottom: 30,
        left: 90
      }

      let width = $(document).width();
      let height = $(document).height();

      // let width = 960 - margin.left - margin.right;
      // let height = 500 - margin.top - margin.bottom;

      let treeContainer = d3.select('#tree-container')
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('id', 'svg')
        .append('g')
        .attr('transform', "translate("
          + margin.left + "," + margin.top + ")");
        // .attr('transform', "translate("
        //   + 0 + "," + 0 + ")");

      let root;

      // let treemap = d3.tree()
      //   .size([height, width]);
      let treemap = d3.tree()
        .nodeSize([30, 140]);

      root = d3.hierarchy(json, function(d) { return d.children; });
      root.x0 = height / 2;
      root.y0 = 0;

      root.treeContainer = treeContainer;
      root.treemap = treemap;
      return root;
    });
  }

  update(source, root) {
    this.root = root;
    let treeContainer = root.treeContainer;
    let treemap = root.treemap;

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);
  
    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      // d.x = d.height * 180;
      // d.y = d.depth * 120;
    });
  
    // ****************** Nodes section ***************************
    let duration = 750;
    // Update the nodes...
    let node = initNodes(treeContainer, nodes, root);
    let nodeEnter = positionNewNodeInParentPreviousPosition(node, source);
    let width = 100;
    initCircle(nodeEnter, root, this);
    initTextArea(nodeEnter, this, width);

    let nodeUpdate = nodeEnter.merge(node);
    animateNodePosition(nodeUpdate, duration);
    updateCircleNode(nodeUpdate);
    updateTextNode(nodeUpdate, width, wrap);
    let nodeExit = removeExistingNodes(node, source, duration);
    exitCircle(nodeExit);
    exitText(nodeExit);

    let link = updateLinks(treeContainer, links);
    let linkEnter = enterLinkToParentPreviousPosition(link, source, diagonal);
    let linkUpdate = linkEnter.merge(link);
    linkTransitionBackToParentElementPosition(linkUpdate, duration);
    let linkExit = removeExitingLinks(link, duration, source, diagonal);
    nodes = storeOldPositionForTransition(nodes);

    return root;
  
    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;
    }
  
    // Toggle children on click.
    function click(d, root, e) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      e.update(d, root);
    }

    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0.25, //parseFloat(text.attr("dy")),
          tspan1 = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
        
        let tspan = tspan1;
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            ++lineNumber;
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", lineHeight + "em")
                        .text(word);
          }
        }
  
        if (lineNumber > 0) 
          tspan1.attr("dy", (dy - (0.5 * lineNumber)) + "em");
      });
    }

    function initNodes(treeContainer, nodes, root) {
      let i = 0;
      return treeContainer.selectAll('g.node')
        .data(nodes, (d) => {
          root.lastNodeId = d.id || (d.id = ++i);
          return root.lastNodeId; 
        })
        .attr('background-color', d3.rgb('#151515'));
    }

    function positionNewNodeInParentPreviousPosition(node, source) {
      return node.enter().append('g')
      .attr('class', 'node')
      .attr('id', function(d) {
        return "g-" + d.id;
      })
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
    }

    function initCircle(nodeEnter, root, ec) {
      // Add Circle for the nodes
      nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      })
      .on('click', (d) => {
        click(d, root, ec);
      });
    }

    function initTextArea(nodeEnter, ec, width) {
      let textManager = ec.textManager;
      let height = 25;
      initRect(nodeEnter, textManager, ec, width, height);
      initLabels(nodeEnter, textManager, ec, width);

      function initRect(nodeEnter, textManager, ec, width, height) {
        nodeEnter.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 13)
        .attr("y", function(d) {
          return height * -0.5;
        })
        .attr('class', 'text-rect')
        .on('click', (d) => {
          textManager.onNodeSelected(d);
        })
        .on('dblclick', function(d) {
          textManager.onOpenTextEdit(ec, d);
        });
      }
  
      function initLabels(nodeEnter, textManager, ec, width) {
        nodeEnter.append('text')
        .attr('class', 'node')
        .attr("dy", ".35em")
        .attr("x", function(d) {
          return 15;
        })
        .attr("text-anchor", function(d) {
          return "start";
        })
        .on('click', (d) => {
          
        })
        .on('dblclick', function(d) {
          textManager.onOpenTextEdit(ec, d);
        })
        .text(function(d) { return d.data.name; })
        .style("fill", "white")
        .call(wrap, width);
      }
    }

    function animateNodePosition(nodeUpdate, duration) {
      nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")";
      });
    }

    function updateCircleNode(nodeUpdate) {
      nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      })
      .attr('cursor', 'pointer');
    }

    function updateTextNode(nodeUpdate, width, wrapFn) {
      nodeUpdate.select('text.node')
      .text(function(d) { return d.data.name; })
      .call(wrapFn, width);
    }

    function removeExistingNodes(node, source, duration) {
      return node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();
    }

    function exitCircle(nodeExit) {
      nodeExit.select('circle')
      .attr('r', 1e-6);
    }

    function exitText(nodeExit) {
      nodeExit.select('text')
      .style('fill-opacity', 1e-6);
    }

    function updateLinks(treeContainer, links) {
      return treeContainer.selectAll('path.link')
      .data(links, function(d) { return d.id; });
    }

    function enterLinkToParentPreviousPosition(link, source, diagonalFn) {
      return link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonalFn(o, o)
      });
    }

    function linkTransitionBackToParentElementPosition(linkUpdate, duration) {
      linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });
    }

    function removeExitingLinks(link, duration, source, diagonalFn) {
      return link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonalFn(o, o)
      })
      .remove();
    }

    function storeOldPositionForTransition(nodes) {
      nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  }


  processTextInput() {
    let t = jQuery(`#text-input`)
    if (t.length > 0) {
      // console.log(t.val());
      this.textManager.onTextEdit();
      t.remove();
      this.update(this.textManager.d, this.root);
    }
  }

  createNewChild() {
    let newNodeId = ++this.root.lastNodeId;
    this.textManager.onCreateNewChild(newNodeId);
    this.update(this.textManager.selectedNode, this.root);
  }
}