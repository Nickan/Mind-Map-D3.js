class SaveManager {

  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.SAVE, (e) => {
      this.save(e.detail.root);
    });
  }

  save(root) {
    let str = JSON.stringify(root.data, null, 2);
    download(str, "map.json", "text.json");

    function download(content, fileName, contentType) {
      let a = document.createElement("a");
      let file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
  }
}