class Event {
  static UPDATE_TREE = 'UPDATE_TREE';
  static APPEND_NODE = 'APPEND_NODE';
  static DELETE_NODE = "DELETE_NODE";
  static APPEND_NODE_SUCCESS = 'APPEND_NODE_SUCCESS';
  static UPDATE_TREE_AFTER = "UPDATE_TREE_AFTER";
  static ON_DRAG_UPDATE_ONCE = "ON_DRAG_UPDATE_ONCE";
  static ON_DRAG = "ON_DRAG";
  static SAVE = "SAVE";
  static LOAD = "LOAD";
  static CANCEL_NODE_CREATION = "CANCEL_NODE_CREATION";
  static PROCESS_TEXT_INPUT = "PROCESS_TEXT_INPUT";
  static CREATE_CHILD_NODE = "CREATE_CHILD_NODE";
  static FOLD_DESCENDANTS = "FOLD_DESCENDANTS";

  constructor() {
    Object.freeze(this);
  }

  static dispatchEvent(type, detail) {
    window.dispatchEvent(new CustomEvent(type, {detail: detail}))
  }
}