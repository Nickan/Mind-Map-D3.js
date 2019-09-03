class DataManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    // Load
    // Then send signal the data is ready
    window.addEventListener(Event.LOAD_JSON_FILE_SUCCESSFUL, (e) => {
      let data = this.parseToData(e.detail.json);
      Event.dispatch(Event.LOAD_DATA_SUCCESSFUL, {data: data});
    });
  }

  parseToData(json) {
    // Returns data ready to feed to UI
    // Solve the stitching of version
    // Setting the foldAncestors, foldDescendants, selected...
    return parse(json);

    function parse(json) {
      let meta = getActiveMeta(json);
      return convertToHierarchy(meta, json.nodes);
    }

    function getActiveMeta(json) {
      let meta = json.meta;
      return meta[meta.active];
    }

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



  // Returns master json
  parseJsonFromFile(fileName) {
    


    stichFileToJson();
    function stichFileToJson() {

    }
  }

  getUniqueName() {
    Math.random().toString(36).substring(7);
  }

  getUniqueId() {
    // Based on the highest number assigned so far
  }
}