class FoldDescendants {

  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.UPDATE_TREE_AFTER, (e) => {
      this.initCircle();
    });
    window.addEventListener(Event.SELECTED_NODE_DATA, (e) => {
      this.selectedData = e.detail.data;
    });
    window.addEventListener(Event.MAIN_ROOT, (e) => {
      this.root = e.detail.root;
    });
    window.addEventListener(Event.FOLD_ANCESTORS_ROOT, (e) => {
      this.ancestorsRoot = e.detail.root;
    });
    window.addEventListener(Event.FOLD_DESCENDANTS, (e) => {
      d3.selectAll('g.node')
      .each(function(d) {
        if (d.data.foldDescendants) {
          if (d.children == undefined) {
            return;
          }
          d._children = d.children;
          d.children = null;
        } else {
          if (d._children != undefined) {
            d.children = d._children;
            d._children = null;
          }
        }
      });

      let source = e.detail.clickedNodeData;
      let root = e.detail.root;
      if (this.ancestorsRoot) {
        root = this.ancestorsRoot;
      }
      
      if (source == undefined)
        source = root;
      
      if (e.detail.init == undefined) {
        Event.dispatch(Event.UPDATE_TREE, {
          source: source,
          root: root
        });
      }
    });
  }

  initCircle() {
    d3.selectAll("circle.node")
    .on("click", (d) => {
      d.data.foldDescendants = d.data.foldDescendants ? undefined: true;
      Event.dispatch(Event.FOLD_DESCENDANTS, {clickedNodeData: d});
    });
  }
}