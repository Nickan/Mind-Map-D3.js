class Node {

  constructor(parent, id, name) {
    // this.parent = parent;
    // this.id = id
    // this.data = {
    //   id: id,
    //   name: name
    // };
    // if (parent.data.children == undefined)
    //   parent.data.children = [];
    // parent.data.children.push(this.data);
    // this.depth = parent.depth + 1;
  }

  static changeParent(node, parent) {
    node.parent = parent;
    if (parent.data.children == undefined)
      parent.data.children = [];
    parent.data.children.push(node.data);
  }

  static siblings(a, b) {
    return (a.parent === b.parent);
  }
}