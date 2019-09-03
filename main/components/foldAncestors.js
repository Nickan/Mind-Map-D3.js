class FoldAncentors {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.SELECTED_NODE_DATA, (e) => {
      this.selectedData = e.detail.data;
    });
    window.addEventListener(Event.MAIN_ROOT, (e) => {
      this.root = e.detail.root;
    }); 
    window.addEventListener(Event.FOLD_ANCESTORS, (e) => {
      if (e.detail.init != undefined) {
        if (this.selectedData == undefined || 
          this.selectedData == this.root) {
          return;
        }
      }

      if (this.selectedData != undefined) {
        let data = this.selectedData.data;
        data.foldAncestors = data.foldAncestors ? undefined: true;
      }
      
      let root = undefined;
      let source = this.selectedData;

      each(this.root, function(d) {
        if (d.data.foldAncestors) {
          root = d;
          source = d;
          Event.dispatch(Event.EDIT_DATA, {node: d});
        }
      });

      if (source == undefined)
        return;

      Event.dispatch(Event.FOLD_ANCESTORS_ROOT, {root: root});

      if (e.detail.init == undefined) {
        Event.dispatch(Event.UPDATE_TREE, {
          source: source,
          root: root
        });
      }

      
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