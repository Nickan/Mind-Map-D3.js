class DragManager {
  constructor() {
  }

  init(root) {
    d3.select('body')
      .call(d3.drag()
        .on("drag", function() {
          console.log("start");
          let tc = d3.select('#tree-container');
          
        })
      );
  }
}