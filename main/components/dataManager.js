class DataManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    this.initLoadJsonFileSuccessful();
    window.addEventListener(Event.GET_NODE_REVISIONS, (e) => {
      let r = this.getRevisionsMeta(e.detail.id);
      let gMeta = this.getGlobalActiveMeta(this.json);
      let metaRevisions = gMeta[e.detail.id];
      metaRevisions.active = gMeta[e.detail.id].active;
      Event.dispatch(Event.SELECTED_NODE_REVISIONS, { metaRevisions: metaRevisions });
    });
    window.addEventListener(Event.CHANGE_NODE_VERSION, (e) => {
      let id = parseInt(e.detail.node.data.id);
      let v = this.getRevisionsMeta(id);
      let gm = this.getGlobalActiveMeta(this.json);
      gm[id].active = e.detail.versionName;
      let r = this.getActiveRevision(id);
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
      let data = this.getData(e.detail.node.data.id);
      Event.dispatch(Event.REPLACE_DATA, {
        node: e.detail.node,
        data: data
      });
    });
    this.createMainNode();
  }

  initLoadJsonFileSuccessful() {
    window.addEventListener(Event.LOAD_JSON_FILE_SUCCESSFUL, (e) => {
      this.json = e.detail.json;
      let data = this.getConvertedD3JsonFormat(e.detail.json);
      Event.dispatch(Event.LOAD_DATA_SUCCESSFUL, { data: data });
    });
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
        },
        "5": {
          "text": "5"
        },
        "6": {
          "text": "6"
        },
        "7": {
          "text": "7"
        },
        "8": {
          "text": "8"
        },
        "9": {
          "text": "9"
        },
        "10": {
          "text": "10"
        }
      },
      "meta": {
        "main": 0,
        "0": {
          "active": "default",
          "revisions": {
            "default": {
              "children": [1, 2, 3]
            },
            "default1": {
              "children": [4, 5]
            }
          }
        },
        "1": {
          "active": "default",
          "revisions": {
            "default": {
              "children": [6, 7],
              "foldDescendants": true
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
              "children": [8, 9, 10],
              "foldAncestors": true
            }
          }
        },
        "5": {
          "active": "default",
          "revisions": {
            "default": {
            }
          }
        },
        "6": {
          "active": "default",
          "revisions": {
            "default": {
            }
          }
        },
        "7": {
          "active": "default",
          "revisions": {
            "default": {
            }
          }
        },
        "8": {
          "active": "default",
          "revisions": {
            "default": {
            }
          }
        },
        "9": {
          "active": "default",
          "revisions": {
            "default": {
            }
          }
        },
        "10": {
          "active": "default",
          "revisions": {
            "default": {
            }
          }
        }
      }
    }
    `;
    Event.dispatch(Event.LOAD_JSON_FILE_SUCCESSFUL, { json: JSON.parse(jsonString) });
  }

  getConvertedD3JsonFormat(json) {
    let mainId = json.meta.main;
    let data = this.getData(mainId);
    return data;
  }

  getData(id) {
    let nodes = this.json.nodes;
    let am = this.getActiveRevision(id);
    return {
      id: id,
      text: nodes[id].text,
      children: this.getChildren(id, this.json),
      foldAncestors: am.foldDescendants,
      foldDescendants: am.foldDescendants
    }
  }

  convertToHierarchy(id, activeMeta, nodes) {
    let rev = this.getActiveRevision(id);
    let data = {
      text: nodes[id].text,
      id: id,
      children: this.getChildren(id, activeMeta, nodes, rev),
      foldDescendants: rev.foldDescendants,
      foldAncestors: rev.foldAncestors
    }

    return data;
  }

  getChildren(id, json) {
    let children = [];
    let am = this.getActiveRevision(id);
    if (am.children && am.children.length > 0) {
      am.children.forEach((childId) => {
        children.push(this.getData(childId));
      });
    }
    return children;
  }

  getRevisionsMeta(id) {
    let meta = this.json.meta;
    return meta[id];
  }

  getActiveRevision(id) {
    let rm = this.getRevisionsMeta(id);
    if (rm == undefined)
      console.log("Active revision is undefined " + id);
    return rm.revisions[rm.active];
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
    } else {
      nodes[id].text = data.text;
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