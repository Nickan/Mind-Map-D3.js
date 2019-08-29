

$(document).ready(() => {
  let elonComponent = new ElonComponent();
  let dragManager = new DragManager();
  let globalConnection = new GlobalConnection();
  let saveManager = new SaveManager();

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
        case "Enter": elonComponent.processTextInput();
          ev.preventDefault();
          break;
        case "Tab": elonComponent.createNewChild();
          ev.preventDefault();
          break;
        case "Delete": elonComponent.deleteNode();
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
      // console.log(event);
    });
    
  }

  function initComponent(json) {
    elonComponent.init(json)
    .then((root) => {
      return elonComponent.update(root, root);
    })
    .then((root) => {
      dragManager.init();

      // Initiate only once
      root.nodes.forEach(function(d){
        globalConnection.lastNodeId = d.id;
      });
    });
  }
});

