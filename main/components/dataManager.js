class DataManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    // Load
    // Then send signal the data is ready
    window.addEventListener(Event.LOAD_JSON_FILE_SUCCESSFUL, (e) => {
      this.json = e.detail.json;
      let data = this.parseToData(e.detail.json);
      Event.dispatch(Event.LOAD_DATA_SUCCESSFUL, {data: data});
    });

    window.addEventListener(Event.GET_NODE_VERSIONS, (e) => {
      let v = this.getVersions(e.detail.id);
      Event.dispatch(Event.SELECTED_NODE_VERSIONS, {versions: v});
    });
    window.addEventListener(Event.CHANGE_NODE_VERSION, (e) => {
      let id = parseInt(e.detail.node.data.id);
      let v = this.getVersions(id);
      v.active = e.detail.versionName;
    });
  }

  parseToData(json) {
    // Returns data ready to feed to UI
    // Solve the stitching of version
    // Setting the foldAncestors, foldDescendants, selected...
    let meta = this.getActiveMeta(json);
    return convertToHierarchy(meta, json.nodes);


    function convertToHierarchy(activeMeta, nodes) {
      let id = parseInt(activeMeta.mainId)
      let data = {
        "text": nodes[id].text,
        "id": id,
        "children": getChildren(id, activeMeta, nodes)
      }

      return data;

      function getChildren(id, activeMeta, nodes) {
        let mNodes = activeMeta.nodes[id];
        if (mNodes == undefined)
          return;
        let versions = mNodes.versions;
        let version = versions[versions.active];
        let children = [];

        let childrenIds = version.children;
        for (let i = 0; i < childrenIds.length; i++) {
          let cId = parseInt(childrenIds[i]);
          let node = nodes[cId];
          let child = {
            "text": node.text,
            "id": cId,
            "children": getChildren(cId, activeMeta, nodes)
          }
          children.push(child);
        }
        return children;
      }
    }
  }

  getVersions(id) {
    let meta = this.getActiveMeta(this.json);
    let mNode = meta.nodes[id];
    return mNode.versions;
  }

  getActiveMeta(json) {
    let meta = json.meta;
    return meta[meta.active];
  }




  getUniqueName() {
    Math.random().toString(36).substring(7);
  }

  getUniqueId() {
    // Based on the highest number assigned so far
  }
}