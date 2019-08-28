class Node {

  constructor(parent, id, name) {
    this.parent = parent;
    this.id = id
    this.data = {
      id: id,
      name: name
    };
    parent.data.children = [this.data];
    this.depth = parent.depth + 1;
  }

  static changeParent(node, parent) {
    node.parent = parent;
    if (parent.data.children == undefined)
      parent.data.children = [];
    parent.data.children.push(node.data);
  }
}