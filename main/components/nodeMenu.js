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
      Event.dispatch(Event.GET_NODE_REVISIONS, 
        { id: parseInt(this.selectedData.data.id) });
    });
    window.addEventListener(Event.SELECTED_NODE_REVISIONS, (e) => {
      this.showNodeMenu(e.detail.revisions);
      this.revisions = e.detail.revisions;
    });

    window.addEventListener(Event.UPDATE_TREE_AFTER, (e) => {
      if (jQuery("#nodeMenu").length) {
        this.showNodeMenu(this.revisions);
      }
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

  showNodeMenu(revisions) {
    if (revisions == undefined)
      return;

    let revisionNames = Object.keys(revisions);
    revisionNames.splice(revisionNames.indexOf("active"), 1);

    jQuery("#nodeMenu").remove();
    jQuery(`#tree-container`).prepend(`
      <div id="nodeMenu">
        <span>${this.selectedData.data.text}</span>
        <span>revisions</span>
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
          <span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li>${revisions.active}</li>`
            + getList(revisionNames) +
          `
            <li id="addRevision">+</li>
          </ul>
        </div>
      </div>
    `);

    this.initDropdownListener();
    initAddRevision(this.selectedData);

    function initAddRevision(node) {
      jQuery(document).ready(function() {
        jQuery("#addRevision").click(function(e) {
          Event.dispatch(Event.ADD_REVISION, {node: node});
          Event.dispatch(Event.SHOW_NODE_MENU, {});
        });
      })
    }

    function getList(revisionNames) {
      let str = "";
      revisionNames.forEach(version => {
        str += `<li class="versionList">${version}</li>`;
      });
      return str;
    }
  }
}