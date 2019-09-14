class AppendNode {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.APPEND_NODE, (e) => {
      // Event.dispatch(Event.DELETE_NODE_DATA, {nodeData: e.detail.child});
      // this.removeFoldDescendants(e.detail.parent);
      // appendChild(e.detail.parent, e.detail.child);
      // setDescendantsDepth(e.detail.parent);
      // Event.dispatch(Event.UPDATE_TREE, {source: e.detail.parent});

      // function appendChild(parent, child) {
      //   Node.changeParent(child, parent);
        
      //   if (parent.children == undefined) {
      //     parent.children = [child];
      //   } else {
      //     parent.children.push(child);
      //   }
      // }

      // function setDescendantsDepth(parent) {
      //   let c = parent.children;
      //   if (c != undefined) {
      //     for (let i = 0; i < c.length; i++) {
      //       let child = c[i];
      //       child.depth = parent.depth + 1;
      //       setDescendantsDepth(child);
      //     }
      //   }
      // }
    });

    window.addEventListener(Event.REMOVE_FOLD_DESCENDANTS, (e) => {
      this.removeFoldDescendants(e.detail.node);
    });
  }

  removeFoldDescendants(node) {
    let data = node.data;
    if (data.foldDescendants) {
      data.foldDescendants = undefined;
      Event.dispatch(Event.FOLD_DESCENDANTS, {
        clickedNodeData: node,
        init: true
      });
    }
  }
}