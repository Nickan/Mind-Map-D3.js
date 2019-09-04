class DataManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(Event.LOAD_JSON_FILE_SUCCESSFUL, (e) => {
      this.json = e.detail.json;
      let data = this.parseToData(e.detail.json);
      Event.dispatch(Event.SET_GLOBAL_META, { meta: this.getGlobalActiveMeta(this.json) })
      Event.dispatch(Event.LOAD_DATA_SUCCESSFUL, { data: data });
    });

    window.addEventListener(Event.GET_NODE_REVISIONS, (e) => {
      let r = this.getRevisions(e.detail.id);
      let gMeta = this.getGlobalActiveMeta(this.json);
      let metaRevisions = gMeta[e.detail.id];
      metaRevisions.active = gMeta[e.detail.id].active;
      Event.dispatch(Event.SELECTED_NODE_REVISIONS, { metaRevisions: metaRevisions });
    });
    window.addEventListener(Event.CHANGE_NODE_VERSION, (e) => {
      let id = parseInt(e.detail.node.data.id);
      let v = this.getRevisions(id);
      let gm = this.getGlobalActiveMeta(this.json);
      gm[id].active = e.detail.versionName;
      let r = this.getActiveRevision(id);
      r.selected = true;
      let data = this.getData(id);
      Event.dispatch(Event.REPLACE_DATA, {
        node: e.detail.node,
        data: data
      });
    });
    window.addEventListener(Event.EDIT_DATA, (e) => {
      this.editData(e.detail.node);
    });
    window.addEventListener(Event.ADD_REVISION, (e) => {
      this.addRevision(e.detail.node);
      let data = this.getData(e.detail.node);
      Event.dispatch(Event.REPLACE_DATA, {
        node: e.detail.node,
        data: data
      });
    });
    this.createMainNode();
  }

  createMainNode() {
    let jsonString = `
      {
        "nodes": {
          "0": {
            "text": "Main"
          },
          "1": {
            "text": "1"
          },
          "2": {
            "text": "2"
          },
          "3": {
            "text": "3"
          },
          "4": {
            "text": "4"
          }
        },
        "meta": {
          "active": "meta1"
        },
        "metaSettings": {
          "active": "metaGlobal"
        },
        "metas": {
          "metaGlobal": {
            "0": {
              "active": "default",
              "revisions": {
                "default": {
                  "children": [ 1, 2 ],
                  "selected": true
                },
                "default1": {
                  "children": [ 3, 4 ]
                }
              }
            },
            "1": {
              "active": "default",
              "revisions": {
                "default": {
                }
              }
            },
            "2": {
              "active": "default",
              "revisions": {
                "default": {
                }
              }
            },
            "3": {
              "active": "default",
              "revisions": {
                "default": {
                }
              }
            },
            "4": {
              "active": "default",
              "revisions": {
                "default": {
                }
              }
            },
            "mainId": 0,
            "lastNodeId": 4
          }
        }
      }
    `;
    Event.dispatch(Event.LOAD_JSON_FILE_SUCCESSFUL, { json: JSON.parse(jsonString) });
  }

  getData(id) {
    let json = this.json;
    let activeMeta = this.getGlobalActiveMeta(json);
    return this.convertToHierarchy(id, activeMeta, json.nodes);
  }

  parseToData(json) {
    let activeMeta = this.getGlobalActiveMeta(json);
    if (activeMeta.mainId == undefined)
      console.log("Error mainId, please set");
    return this.convertToHierarchy(activeMeta.mainId, activeMeta, json.nodes);
  }

  convertToHierarchy(id, activeMeta, nodes) {
    let rev = this.getActiveRevision(id);
    let data = {
      text: nodes[id].text,
      id: id,
      children: this.getChildren(id, activeMeta, nodes, rev),
      foldDescendants: rev.foldDescendants,
      foldAncestors: rev.foldAncestors,
      selected: rev.selected
    }

    return data;


  }

  getChildren(id, activeMeta, nodes, revision) {
    let mNodes = activeMeta[id];
    if (mNodes == undefined)
      return;

    let children = [];

    let childrenIds = revision.children;
    if (childrenIds == undefined)
      return children;
    for (let i = 0; i < childrenIds.length; i++) {
      let cId = parseInt(childrenIds[i]);
      let node = nodes[cId];
      let cRev = this.getActiveRevision(cId);
      let child = {
        text: node.text,
        id: cId,
        children: this.getChildren(cId, activeMeta, nodes, cRev),
        foldAncestors: cRev.foldAncestors,
        foldDescendants: cRev.foldDescendants,
        selected: cRev.selected
      }
      children.push(child);
    }
    return children;
  }


  getRevisions(id) {
    let meta = this.getGlobalActiveMeta(this.json);
    return meta[id].revisions;
  }

  getActiveRevision(id, createIfNone = true) {
    let gMeta = this.getGlobalActiveMeta(this.json);

    if (gMeta[id] == undefined) {
      if (createIfNone) {
        gMeta[id] = {
          active: "default",
          revisions: {
            default: {

            }
          }
        }
      }
    }
    return gMeta[id].revisions[gMeta[id].active];
    // let revisions = this.getRevisions(id);
    // let activeName = gMeta[id].active;
    // let r = revisions[activeName];
    // if (r == undefined) {
    //   revisions[activeName] = {
    //     active: "default"
    //   }
    // }
    // return revisions[activeName];
  }

  getGlobalActiveMeta(json) {
    let mSettings = json.metaSettings;
    return json.metas[mSettings.active];
  }

  editData(node) {
    let data = node.data;

    let id = data.id;
    let nodes = this.json.nodes;

    if (nodes[id] == undefined) {
      nodes[id] = {
        text: data.text
      };
    }

    let rev = this.getActiveRevision(id);
    rev.children = [];
    rev.selected = data.selected;
    rev.foldAncestors = data.foldAncestors;
    rev.foldDescendants = data.foldDescendants;

    if (data.children == undefined) {

    } else {
      for (let i = 0; i < data.children.length; i++) {
        let e = data.children[i];
        let id = e.id;
        rev.children.push(id);

        if (nodes[id] == undefined) {
          nodes.push(e.text);
        }
      };
    }


    let p = node.parent;
    if (p != undefined) {
      let pRev = this.getActiveRevision(p.data.id);

      let cn = p.data.children;
      pRev.children = [];
      for (let i = 0; i < cn.length; i++) {
        pRev.children.push(cn[i].id);
      }
    }
  }

  getMeta(id) {
    let pId = parseInt(id);
    let meta = this.getGlobalActiveMeta(this.json);
    let mNode = meta.nodes[pId];
    if (mNode == undefined) {
      mNode = {
        "revisions": {
          "default": {

          }
        }
      }
      meta.nodes.push(mNode);
    }
    return mNode;
  }

  addRevision(node) {
    let gm = this.getActiveMetaById(node.data.id);
    gm.active = "default" + (Object.keys(gm.revisions).length);
    gm.revisions[gm.active] = { selected: true };
    let rev = gm.revisions[gm.active];
    Event.dispatch(Event.CHANGE_NODE_VERSION, {
      node: node,
      versionName: gm.active
    });
  }

  getActiveMetaById(id) {
    let gm = this.getGlobalActiveMeta(this.json);
    return gm[id];
  }



  getUniqueName() {
    Math.random().toString(36).substring(7);
  }

  getUniqueId() {
    // Based on the highest number assigned so far
  }
}