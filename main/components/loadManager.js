class LoadManager {

  constructor(fn) {
    window.addEventListener(Event.LOAD, (e) => {
      this.getAsText((result) => {
        fn(JSON.parse(result));
      });
    });
  }

  getAsText(fn) {
    // let input = document.querySelector('input');
    var input = document.createElement('input');
    input.setAttribute("id", "inputFile");
    input.setAttribute("type", "file");
    var b = document.querySelector('body');
    b.append(input); 
    input.click();
    input.onchange = function (event) {
      let file = input.files[0];
      let fr = new FileReader();
      fr.onload = function (event) {
        fn(fr.result);
      }
      fr.readAsText(file);
      event.preventDefault();
      input.remove();
    }
  }
}