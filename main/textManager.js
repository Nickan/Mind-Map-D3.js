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
        this.handleClickEvent(d, this);
      });
    });

    window.addEventListener(Event.ON_DRAG_UPDATE_ONCE, (e) => {
      this.handleClickEvent(e.detail.selectedData, this);
    });
  }

  handleClickEvent(d, tm) {
    d3.selectAll(".text-wrap")
    .each(function(d) {
      d.selected = undefined;
    });

    tm.selectedData = d;
    d.selected = true;

    d3.selectAll(".text-wrap")
    .style("font-weight", function(d) {
      if (d.selected)
        return "800";
      return "initial";
    })
    .style("font-size", function(d) {
      if (d.selected)
        return "11px";
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
    this.globalConnection.deleteNodeData(this.selectedData);
    this.selectedData = this.selectedData.parent
  }

}