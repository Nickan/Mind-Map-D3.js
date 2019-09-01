class AppendNode {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.APPEND_NODE, (e) => {
      appendChild(e.detail.appendTo, e.detail.toAppend);
      setDescendantsDepth(e.detail.appendTo);
      Event.dispatchEvent(Event.UPDATE_TREE, {nodeSource: e.detail.appendTo});

      function appendChild(parent, child) {
        Node.changeParent(child, parent);
        
        if (parent.children == undefined) {
          parent.children = [child];
        } else {
          parent.children.push(child);
        }
      }

      function setDescendantsDepth(parent) {
        let c = parent.children;
        if (c != undefined) {
          for (let i = 0; i < c.length; i++) {
            let child = c[i];
            child.depth = parent.depth + 1;
            setDescendantsDepth(child);
          }
        }
      }
    });
  }
}