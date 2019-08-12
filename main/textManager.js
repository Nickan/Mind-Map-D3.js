class TextManager {

  constructor() {}

  onOpenTextEdit(e, d) {
    this.d = d;
    let p = d3.select(e.parentNode);
    let id = p.attr('id');
    jQuery(`#tree-container`).prepend(`
      <input type="text" id="text-input" node-id="${id}"/>
    `);
  }

  onTextEdit() {
    let text = jQuery('#text-input').val();
    this.d.data.name = text;
    // Get the node
    // Wrap the text
  //   let text = jQuery('#text-input').val();
  //   // console.log(text);
  //   let eText = d3.select('#g-').select('text');
  //   console.log(eText);
  }

}