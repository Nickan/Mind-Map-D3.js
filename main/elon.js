
let elonComponent;
let dragManager;
start();

function start() {
  elonComponent = new ElonComponent();
  dragManager = new DragManager();
  elonComponent.init()
  .then((root) => {
    console.log(root);
    return elonComponent.update(root, root);
  })
  .then((root) => {
    // console.log('testing1');
    dragManager.init(root);
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