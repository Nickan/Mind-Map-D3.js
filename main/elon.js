
let elonComponent;
let dragManager;
start();

function start() {
  elonComponent = new ElonComponent();
  dragManager = new DragManager();
  elonComponent.init()
  .then((root) => {
    return elonComponent.update(root, root);
  })
  .then((root) => {
    dragManager.init(root);

    // Initiate only once
    root.nodes.forEach(function(d){
      root.lastNodeId = d.id;
    });
  });

  document.onkeydown = function(ev) {
    // console.log(ev);
    switch (ev.key) {
      case "Enter": elonComponent.processTextInput();
        ev.preventDefault();
      break;
      case "Tab": elonComponent.createNewChild();
        ev.preventDefault();
      break;
      default:
    }
  }

  jQuery('#svg').keydown(function() {
    // console.log(event);
  });

  
}