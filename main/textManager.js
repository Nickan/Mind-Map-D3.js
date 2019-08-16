class TextManager {

  constructor() {}

  onOpenTextEdit(e, d) {
    this.nodeToEdit = d;
    // let p = d3.select(e.parentNode);
    // let id = p.attr('id');
    jQuery(`#tree-container`).prepend(`
      <input type="text" id="text-input"/>
    `);
  }

  onTextEdit() {
    let text = jQuery('#text-input').val();
    this.nodeToEdit.data.name = text;
  }

  onNodeSelected(d) {
    this.selectedNode = d;
    console.log(d);
  }

}