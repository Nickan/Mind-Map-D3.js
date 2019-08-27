class Event {
  static UPDATE_TREE = 'UPDATE_TREE';
  static APPEND_NODE = 'APPEND_NODE';
  static APPEND_NODE_SUCCESS = 'APPEND_NODE_SUCCESS';

  constructor() {
    Object.freeze(this);
  }

  static dispatchEvent(type, detail) {
    window.dispatchEvent(new CustomEvent(type, {detail: detail}))
  }
}