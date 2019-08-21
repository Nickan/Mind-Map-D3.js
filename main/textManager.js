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
    console.log("selected node id: " + d.id);
  }

  onCreateNewChild(nodeId) {
    if (this.selectedNode == undefined)
      return;

    let s = this.selectedNode;
    // console.log(s);
    if (s.children == undefined) {
      // Create array of children
      let children = [
        new Node(s, nodeId, "Test New Child")
      ];
      this.selectedNode.children = children;
      console.log(this.selectedNode);
    } else {
      // Add to existing children
      // Have to handle hidden children
      // Currently it is _children
      s.children.push(new Node(s, nodeId, "Existing Test New Child"));
    }
    // then update the tree


    // Add children
    // Then update the tree
    // if (this.selectedNode.chi)
    // console.log(this.selectedNode.children);
    // console.log('onCreateNewChild');
    // console.log(this.selectedNode);
  }

}