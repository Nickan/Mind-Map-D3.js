class DataManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.LOAD_JSON_FILE_SUCCESSFUL, (e) => {
      this.json = e.detail.json;
      let data = this.parseToData(e.detail.json);
      Event.dispatch(Event.LOAD_DATA_SUCCESSFUL, {data: data});
    });

    window.addEventListener(Event.GET_NODE_VERSIONS, (e) => {
      let v = this.getVersions(e.detail.id);
      Event.dispatch(Event.SELECTED_NODE_VERSIONS, {revisions: v});
    });
    window.addEventListener(Event.CHANGE_NODE_VERSION, (e) => {
      let id = parseInt(e.detail.node.data.id);
      let v = this.getVersions(id);
      v.active = e.detail.versionName;
      let data = this.getData(id);
      Event.dispatch(Event.REPLACE_DATA, {
        node: e.detail.node,
        data: data
      });
    });
    window.addEventListener(Event.EDIT_DATA, (e) => {
      this.editData(e.detail.node);
    });

    this.createMainNode();
  }

  createMainNode() {
    let jsonString = `
      {
        "nodes": [
          { "text": "Main" }
        ],
        "meta": {
          "active": "meta1",
          "meta1": {
            "mainId": 0,
            "nodes": [
              {
                "revisions": {
                  "active": "default",
                  "default": {
                    "children": [
                    ]
                  }
                },
                "selected": true
              }
            ]
          }
        }
      }
    `;
    
    Event.dispatch(Event.LOAD_JSON_FILE_SUCCESSFUL, {json: JSON.parse(jsonString)});
  }

  getData(id) {
    let json = this.json;
    let activeMeta = this.getActiveMeta(json);
    return this.convertToHierarchy(id, activeMeta, json.nodes);
  }

  parseToData(json) {
    let activeMeta = this.getActiveMeta(json);
    if (activeMeta.mainId == undefined)
      console.log("Error mainId, please set");
    let id = parseInt(activeMeta.mainId);
    return this.convertToHierarchy(id, activeMeta, json.nodes);
  }

  convertToHierarchy(id, activeMeta, nodes) {
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

      let revisions = mNodes.revisions;
      let version = revisions[revisions.active];
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

  getVersions(id) {
    let meta = this.getActiveMeta(this.json);
    let mNode = meta.nodes[id];
    if (mNode == undefined)
      return undefined;
    return mNode.revisions;
  }

  getActiveMeta(json) {
    let meta = json.meta;
    return meta[meta.active];
  }

  editData(node) {
    let data = node.data;

    let id = parseInt(data.id);
    let nodes = this.json.nodes;

    if (nodes[id] == undefined) {
      nodes.push({
        text: data.text
      });
    }

    let meta = this.getMeta(id);
    let rev = getRevision(meta);
    rev.children = [];
    rev.selected = data.selected;
    rev.foldAncestors = data.foldAncestors;
    rev.foldDescendants = data.foldDescendants;
    if (data.children == undefined) {

    } else {
      data.children.foreach((e) => {
        let id = parseInt(e.data.id);
        rev.children.push(e.data.id);
  
        if (nodes[id] == undefined) {
          nodes.push(e.data.text);
        }
      });
    }

    
    let p = node.parent;
    if (p != undefined) {
      let pmMeta = this.getMeta(p.data.id);
      let pRev = getRevision(pmMeta);

      let cn = p.data.children;
      pRev.children = [];
      for (let i = 0; i < cn.length; i++) {
        pRev.children.push(cn[i].id);
      }
    }
  
    function getRevision(meta) {
      return meta.revisions[meta.revisions.active];
    }
  }

  getMeta(id) {
    let pId = parseInt(id);
    let meta = this.getActiveMeta(this.json);
    let mNode = meta.nodes[pId];
    if (mNode == undefined) {
      mNode = {
        "revisions": {
          "active": "default",
          "default": {

          }
        }
      }
      meta.nodes.push(mNode);
    }
    return mNode;
  }

  getVersion(id) {
    let nodeId = parseInt(id);
    let vs = this.getVersions(nodeId);
    if (vs == undefined)
      return undefined;
    return vs[vs.active];
  }



  getUniqueName() {
    Math.random().toString(36).substring(7);
  }

  getUniqueId() {
    // Based on the highest number assigned so far
  }
}