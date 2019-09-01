

$(document).ready(() => {
  let elonComponent = new ElonComponent();
  let dragManager = new DragManager();
  let globalConnection = new GlobalConnection();
  let saveManager = new SaveManager();
  let foldDescendants = new FoldDescendants();
  let foldAncentors = new FoldAncentors();
  let appendNode = new AppendNode();
  let dataManager = new DataManager();

  start(JSON.parse(`{
    "name": "Main",
    "id": 1
  }`));

  let loadManager = new LoadManager((json) => {
    d3.selectAll("svg > *").remove();
    $("#tree-container").empty();
    start(json);
  });

  function start(json) {
    elonComponent.globalConnection = globalConnection;
    dragManager.globalConnection = globalConnection;

    initComponent(json);

    let controlDown = false;
    document.onkeydown = function(ev) {
      // console.log(ev);
      switch (ev.key) {
        case "Enter": Event.dispatchEvent(Event.PROCESS_TEXT_INPUT, {});
          ev.preventDefault();
          break;
        case "Tab": Event.dispatchEvent(Event.CREATE_CHILD_NODE, {});
          ev.preventDefault();
          break;
        case "Delete": Event.dispatchEvent(Event.DELETE_NODE, {});
          ev.preventDefault();
          break;
        case "Control": controlDown = true;
          break;
        case "s":
        case "S": if (controlDown) {
            Event.dispatchEvent(Event.SAVE, {root: elonComponent.root});
            controlDown = false;
            ev.preventDefault();
          }
          break;
        case "o":
        case "O": if (controlDown) {
            Event.dispatchEvent(Event.LOAD, {});
            controlDown = false;
            ev.preventDefault();
          }
          break;
        case "F1": Event.dispatchEvent(Event.FOLD_ANCESTORS, {});
          ev.preventDefault();
          break;
        default:
      }
    }

    document.onkeyup = function(ev) {
      switch (ev.key) {
        case "Control": controlDown = false;
          console.log("Control up");
          ev.preventDefault();
          break;
        default:
      }
    }

    jQuery('#svg').keydown(function() {
    });
    
  }

  function initComponent(json) {
    elonComponent.init(json)
    .then((root) => {
      return elonComponent.update(root, root);
    })
    .then((root) => {
      Event.dispatchEvent(Event.UPDATE_TREE_AFTER, {});
      dragManager.init();
      
      Event.dispatchEvent(Event.FOLD_ANCESTORS, {root: root, init: true});
      Event.dispatchEvent(Event.FOLD_DESCENDANTS, {root: root, init: true});
      Event.dispatchEvent(Event.FOLD_ANCESTORS, {root: root});
    });
  }
});

