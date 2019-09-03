
$(document).ready(() => {
  let elonComponent = new ElonComponent();
  let dragManager = new DragManager();
  let globalConnection = new GlobalConnection();
  let saveManager = new SaveManager();
  let foldDescendants = new FoldDescendants();
  let foldAncentors = new FoldAncentors();
  let appendNode = new AppendNode();
  let dataManager = new DataManager();
  let loadManager = new LoadManager();

  let controlDown = false;

  start();
  initEventListeners();

  // let loadManager = new LoadManager((json) => {
  //   d3.selectAll("svg > *").remove();
  //   $("#tree-container").empty();
  //   start(json);
  // });

  function start() {
    elonComponent.globalConnection = globalConnection;
    dragManager.globalConnection = globalConnection;

    controlDown = false;
    document.onkeydown = function(ev) {
      // console.log(ev);
      switch (ev.key) {
        case "Enter": Event.dispatch(Event.PROCESS_TEXT_INPUT, {});
          ev.preventDefault();
          break;
        case "Tab": Event.dispatch(Event.CREATE_CHILD_NODE, {});
          ev.preventDefault();
          break;
        case "Delete": Event.dispatch(Event.DELETE_NODE, {});
          ev.preventDefault();
          break;
        case "Control": controlDown = true;
          break;
        case "s":
        case "S": if (controlDown) {
            Event.dispatch(Event.SAVE, {root: elonComponent.root});
            controlDown = false;
            ev.preventDefault();
          }
          break;
        case "o":
        case "O": if (controlDown) {
            Event.dispatch(Event.LOAD_JSON_FILE, {});
            controlDown = false;
            ev.preventDefault();
          }
          break;
        case "F1": Event.dispatch(Event.FOLD_ANCESTORS, {});
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

  function initEventListeners() {
    window.addEventListener(Event.LOAD_DATA_SUCCESSFUL, (e) => {
      initComponent(e.detail.data);
    });
  }

  function initComponent(json) {
    elonComponent.init(json)
    .then((root) => {
      return elonComponent.update(root, root);
    })
    .then((root) => {
      Event.dispatch(Event.UPDATE_TREE_AFTER, {});
      dragManager.init();
      
      Event.dispatch(Event.FOLD_ANCESTORS, {root: root, init: true});
      Event.dispatch(Event.FOLD_DESCENDANTS, {root: root, init: true});
      Event.dispatch(Event.FOLD_ANCESTORS, {root: root});
    });
  }
});

