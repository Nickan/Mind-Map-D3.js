start();

function start() {
  let ec = new ElonComponent();
  let dm = new DragManager();
  ec.init()
  .then((root) => {
    return ec.update(root, root);
  })
  .then((root) => {
    // console.log('testing1');
    dm.init(root);
  });

}