
let elonComponent;
let dragManager;
start();

function start() {
  globalConnection = new GlobalConnection();
  elonComponent = new ElonComponent();
  dragManager = new DragManager();
  saveManager = new SaveManager();
  elonComponent.globalConnection = globalConnection;
  dragManager.globalConnection = globalConnection;

  elonComponent.init()
  .then((root) => {
    return elonComponent.update(root, root);
  })
  .then((root) => {
    dragManager.init(root);

    // Initiate only once
    root.nodes.forEach(function(d){
      globalConnection.lastNodeId = d.id;
    });
  });

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
          ev.preventDefault();
        }
        break;
      default:
    }
  }

  document.onkeyup = function(ev) {
    switch (ev.key) {
      case "Control": controlDown = false;
        break;
      default:
    }
  }


  jQuery('#svg').keydown(function() {
    // console.log(event);
  });
  
}