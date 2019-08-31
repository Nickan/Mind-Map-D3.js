class FoldAncentors {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.SELECTED_NODE_DATA, (e) => {
      this.selectedData = e.detail.selectedData;
    });
    window.addEventListener(Event.MAIN_ROOT, (e) => {
      this.root = e.detail.root;
    });   

    window.addEventListener(Event.FOLD_ANCESTORS, (e) => {
      if (this.selectedData == undefined)
        return;

      let data = this.selectedData.data;
      data.foldAncestors = data.foldAncestors ? undefined: true;

      let root = undefined;
      let source = undefined;

      each(this.root, function(d) {
        if (d.data.foldAncestors) {
          root = d;
        }
      });
      source = this.selectedData;

      Event.dispatchEvent(Event.UPDATE_TREE, {
        nodeSource: source,
        root: root
      });

      function each(node, fn) {
        fn(node);
        let c = node.children;
        if (c) {
          for (let i = 0; i < c.length; i++) {
            each(c[i], fn);
          }
        }
      }

    });
  }
}