class TextManager {

  constructor() {
    this.lastNodeId = 0;
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.UPDATE_TREE_AFTER, (e) => {
      d3.selectAll(".text-wrap")
      .style("pointer-events", "none");

      d3.selectAll("g.node")
      .on("click", (d) => {
        this.handleClickEvent(d);
      })
      .each((d) => {
        if (d.data.id > this.lastNodeId) {
          this.lastNodeId = d.data.id;
        }
      });
      this.updateTextHighlight();
    });

    window.addEventListener(Event.ON_DRAG_UPDATE_ONCE, (e) => {
      this.handleClickEvent(e.detail.selectedData);
    });

    window.addEventListener(Event.DELETE_NODE, (e) => {
      this.deleteNode();
    });

    window.addEventListener(Event.PROCESS_TEXT_INPUT, (e) => {
      if (this.selectedData == undefined) {
        return;
      }
      this.processTextInput();
    });

    window.addEventListener(Event.CREATE_CHILD_NODE, (e) => {
      Event.dispatchEvent(Event.REMOVE_FOLD_DESCENDANTS, {node: this.selectedData});
      if (this.selectedData == undefined) {
        return;
      }
      this.createTextInput();
      this.state = State.CREATE_CHILD_NODE;
    });

    window.addEventListener(Event.ON_DRAG, (e) => {
      this.cancelTextInputProcess();
    })

    window.addEventListener(Event.DELETE_NODE_DATA, (e) => {
      this.deleteNodeData(e.detail.nodeData);
    });
    window.addEventListener(Event.FOLD_ANCESTORS_ROOT, (e) => {
      this.ancestorsRoot = e.detail.root;
    });
  }

  processTextInput() {
    let t = jQuery(`#text-input`);
    if (t.length > 0) {
      let node;
      switch (this.state) {
        case State.EDIT_NODE:
          this.onTextEdit();
          node = this.nodeToEdit;
          break;
        case State.CREATE_CHILD_NODE:
          this.onCreateNewChild(this.selectedData, t.val());
          node = this.selectedData;
          break;
        default:
          break;
      }
      t.remove();
      Event.dispatchEvent(Event.UPDATE_TREE, {
        root: this.ancestorsRoot,
        nodeSource: node
      });
    }
  }

  handleClickEvent(d) {
    d3.selectAll(".text-wrap")
    .each(function(d) {
      d.data.selected = undefined;
    });

    this.selectedData = d;
    d.data.selected = true;
    this.updateTextHighlight();
  }

  updateTextHighlight() {
    let tm = this;
    d3.selectAll(".text-wrap")
    .style("font-weight", function(d) {
      if (d.data.selected) {
        tm.selectedData = d;
        Event.dispatchEvent(Event.SELECTED_NODE_DATA, {selectedData: d});
        return "800";
      }
        
      return "initial";
    })
    .style("font-size", function(d) {
      if (d.data.selected) {
        tm.selectedData = d;
        return "11px";
      }
      return "10px";
    });

    this.cancelTextInputProcess();
  }

  onOpenTextEdit(d) {
    this.nodeToEdit = d;
    this.deleteTextInputUI();
    this.createTextInput(d.data.name);
    this.state = State.EDIT_NODE;
  }

  cancelTextInputProcess() {
    this.state = undefined;
    this.deleteTextInputUI();
  }

  deleteTextInputUI() {
    let t = jQuery(`#text-input`)
    if (t.length > 0) {
      t.remove();
    }
  }

  createTextInput(name) {
    if (name == undefined)
      name = "";
    jQuery(`#tree-container`).prepend(`
      <textarea type="text" id="text-input" autofocus="autofocus">${name}</textarea
    `);
    jQuery('#text-input').focus();
  }

  onTextEdit() {
    let text = jQuery('#text-input').val();
    this.nodeToEdit.data.name = text;
  }

  onNodeSelected(d) {
    this.selectedData = d;
  }

  onCreateNewChild(parent, text) {
    let nodeId = ++this.lastNodeId;
    let data = {
      id: nodeId,
      name: text,
    }
    let node = d3.hierarchy(data, function(d) {
      return d.children; 
    });
    node.parent = parent;
    node.depth = parent.depth + 1;
    node.id = nodeId;

    if (parent.children == undefined) {
      parent.children = [node];
    } else {
      parent.children.push(node);
    }

    if (parent.data.children == undefined)
      parent.data.children = [];
    parent.data.children.push(data);
  }

  deleteNode() {
    if (this.selectedData == undefined)
      return;

    this.deleteNodeData(this.selectedData);
    this.selectedData.data.selected = undefined;
    this.selectedData.parent.data.selected = true;
    Event.dispatchEvent(Event.UPDATE_TREE, 
      {nodeSource: this.selectedData});
  }

  deleteNodeData(nodeData) {
    let p = nodeData.parent;
    if (p == undefined)
      return;

    let c = p.children;
    if (c == undefined)
      return;
    let cd = p.data.children;
    for (let i = 0; i < c.length; i++) {
      if (c[i].id == nodeData.id) {
        c.splice(i, 1);
        cd.splice(i, 1);
        break;
      }
    }
    if (c.length == 0) {
      p.children = undefined;
      p.data.children = undefined;
    }
  }

}