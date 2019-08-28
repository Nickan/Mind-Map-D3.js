class GlobalConnection {
  constructor() {
    // Have to define here the existing attributes defined in the system
    // For readability
  }

  deleteNodeData(nodeData) {
    let p = nodeData.parent;
    if (p == undefined)
      return;

    let c = p.children;
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

  onCreateNewChild(parentNode, text) {
    if (parentNode == undefined)
      return;

    let nodeId = ++this.lastNodeId;

    let p = parentNode;
    if (p.children == undefined) {
      let children = [
        new Node(p, nodeId, text)
      ];
      p.children = children;
    } else {
      p.children.push(new Node(p, nodeId, text));
      // p.data.children.push({name: text, id: nodeId});
    }
  }

}