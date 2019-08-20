class Node {

  constructor(parent, id, name) {
    this.parent = parent;
    this.id = id
    this.data = {
      id: id,
      name: name
    };
    this.depth = parent.depth + 1;
  }
}