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

  onTextEdit(state) {
    let text = jQuery('#text-input').val();
    this.nodeToEdit.data.name = text;
  }

  onNodeSelected(d) {
    this.selectedNode = d;
    console.log("selected node id: " + d.id);
  }

  onCreateNewChild(nodeId) {
    if (this.selectedNode == undefined)
      return;

    let s = this.selectedNode;
    if (s.children == undefined) {
      let children = [
        new Node(s, nodeId, "Test New Child")
      ];
      this.selectedNode.children = children;
      console.log(this.selectedNode);
    } else {
      s.children.push(new Node(s, nodeId, "Existing Test New Child"));
    }
  }

  deleteNode() {
    let p = this.selectedNode.parent;
    if (p == undefined)
      return;

    let c = p.children;
    for (let i = 0; i < c.length; i++) {
      if (c[i].id == this.selectedNode.id) {
        c.splice(i, 1);
        break;
      }
    }
    if (c.length == 0) {
      p.children = undefined;
    }
  }

}