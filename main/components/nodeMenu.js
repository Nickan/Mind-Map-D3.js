class NodeMenu {
  constructor() {
    this.initEventListener();
  }

  initEventListener() {
    window.addEventListener(Event.SELECTED_NODE_DATA, (e) => {
      this.selectedData = e.detail.data;
    });
    window.addEventListener(Event.SHOW_NODE_MENU, (e) => {
      if (this.selectedData == undefined)
        return;
      Event.dispatch(Event.GET_NODE_VERSIONS, 
        { id: parseInt(this.selectedData.data.id) });
    });
    window.addEventListener(Event.SELECTED_NODE_VERSIONS, (e) => {
      this.showNodeMenu(e.detail.versions);
    });
  }

  initDropdownListener() {
    let selectedNode = this.selectedData;
    jQuery(document).ready(function() {
      jQuery(".versionList").click(function(e) {
        let versionName = jQuery(this).text();
        Event.dispatch(Event.CHANGE_NODE_VERSION, {
          node: selectedNode,
          versionName: versionName
        });
      });
    })
  }

  showNodeMenu(versions) {
    if (versions == undefined)
      return;

    let versionNames = Object.keys(versions);
    versionNames.splice(versionNames.indexOf("active"), 1);

    jQuery(`#tree-container`).prepend(`
      <div id="nodeMenu">
        <span>${this.selectedData.data.text}</span>
        <span>versions</span>
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
          <span class="caret"></span></button>
          <ul class="dropdown-menu">`
            + getList(versionNames) +
          `</ul>
        </div>
      </div>
    `);

    this.initDropdownListener();

    function getList(versionNames) {
      let str = "";
      versionNames.forEach(version => {
        str += `<li class="versionList">${version}</li>`;
      });
      return str;
    }
  }
}