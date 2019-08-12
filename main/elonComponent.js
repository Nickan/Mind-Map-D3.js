class ElonComponent {
  constructor() {
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
    let i = 0,
      duration = 750;
    // Update the nodes...
    var node = treeContainer.selectAll('g.node')
      .data(nodes, function(d) {
        return d.id || (d.id = ++i); 
      });
  
    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('id', function(d) {
        return d.id;
      })
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', (d) => {
        click(d, root, this.update);
      })
      .on('dblclick', (d) => {
        jQuery(`#tree-container`).prepend(`
          <input type="text" id="text-input" />
        `);
      });
  
    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      });
    
    let rWidth = 100;
    let rHeight = 25;
    nodeEnter.append("rect")
      .attr("width", rWidth)
      .attr("height", rHeight)
      .attr("x", 13)
      .attr("y", function(d) {
        console.log(d);
        return rHeight * -0.5;
      })
      .attr("fill",  "blue");
  
    // Add labels for the nodes
    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          // return d.children || d._children ? -13 : 13;
        return 15;
      })
      .attr("text-anchor", function(d) {
          // return d.children || d._children ? "end" : "start";
        return "start";
      })
      .text(function(d) { return d.data.name; })
      .call(this.wrap, rWidth);

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);
  
    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")";
       });
  
    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      })
      .attr('cursor', 'pointer');
  
  
    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();
  
    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', 1e-6);
  
    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
  
    // ****************** links section ***************************
  
    // Update the links...
    var link = treeContainer.selectAll('path.link')
        .data(links, function(d) { return d.id; });
  
    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
          var o = {x: source.x0, y: source.y0}
          return diagonal(o, o)
        });
  
    // UPDATE
    var linkUpdate = linkEnter.merge(link);
  
    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });
  
    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = {x: source.x, y: source.y}
          return diagonal(o, o)
        })
        .remove();
  
    // Store the old positions for transition.
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });

    return root;
  
    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;
    }
  
    // Toggle children on click.
    function click(d, root, updateFn) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      updateFn(d, root);
    }
  }

  processTextInput() {
    let t = jQuery(`#text-input`)
    if (t.length > 0) {
      // console.log(t.val());
      t.remove();
    }
  }

  wrap(text, width) {
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
                      // .attr("dy", ++lineNumber * lineHeight + dy + "em")
                      .attr("dy", lineHeight + "em")
                      .text(word);
        }
      }

      if (lineNumber > 0) 
        tspan1.attr("dy", (dy - (0.5 * lineNumber)) + "em");
    });
  }
}