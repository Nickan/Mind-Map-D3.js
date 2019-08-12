
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
    // console.log('testing1');
    dragManager.init(root);
  });

  document.addEventListener("keypress", function onEvent(e) {
    // console.log(e.key);
    switch (e.key) {
      case "Enter": elonComponent.processTextInput();
      break;
      default:
    }
  });
  
}