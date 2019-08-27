class TextManager {

  constructor() {}

  onOpenTextEdit(d) {
    this.nodeToEdit = d;
    let t = jQuery(`#text-input`)
    if (t.length > 0) {
      t.remove();
    }
    this.createTextInput();
  }

  createTextInput() {
    jQuery(`#tree-container`).prepend(`
      <input type="text" id="text-input"/>
    `);
    jQuery('#text-input').focus();
  }

  onTextEdit() {
    let text = jQuery('#text-input').val();
    this.nodeToEdit.data.name = text;
  }

  onNodeSelected(d) {
    this.selectedNode = d;
  }

  onCreateNewChild(text) {
    this.globalConnection.onCreateNewChild(this.selectedNode, text);

  }

  deleteNode() {
    this.globalConnection.deleteNodeData(this.selectedNode);
  }

}