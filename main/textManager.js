class TextManager {

  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.UPDATE_TREE_AFTER, (e) => {
      d3.selectAll(".text-wrap")
      .style("pointer-events", "none");

      d3.selectAll("g.node")
      .on("click", (d) => {
        this.handleClickEvent(d);
      });
      this.updateTextHighlight();
    });

    window.addEventListener(Event.ON_DRAG_UPDATE_ONCE, (e) => {
      this.handleClickEvent(e.detail.selectedData);
    });

    window.addEventListener(Event.DELETE_NODE, (e) => {
      this.deleteNode();
    });
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
  }

  onOpenTextEdit(d) {
    this.nodeToEdit = d;
    let t = jQuery(`#text-input`)
    if (t.length > 0) {
      t.remove();
    }
    this.createTextInput(d.data.name);
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

  onCreateNewChild(text) {
    this.globalConnection.onCreateNewChild(this.selectedData, text);
  }

  deleteNode() {
    if (this.selectedData == undefined)
      return;

    this.deleteNodeData(this.selectedData);
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