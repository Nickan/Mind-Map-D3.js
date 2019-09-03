class DataManager {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    let masterSettings = {
      jsonFileNames: [
        "aabbcc",
        "asdfas",
        "dfadge"
      ]
    }
    let json1 = {
      lastJsonIndex: 3,
      v1: {
        name: "name1",
        id: 1, // ?
        children: [ // With or without
          {
            name: "name2",
            id: 2,
            children: [
              {
                name: "name3",
                id: 3,
              },
              {
                json: "name_1.json"
              }
            ]
          }
        ] 
      }
    }

    let name_1 = {
      mainJson: "main.json",
      v1: {
        json: "name_2.json"
      },
      v2: {
        json: "name_3.json"
      }
    }

    let name_2 = {
      mainJson: "main.json",
      v1: {
        name: "name4",
        id: 4,
        children: [
          {
            name: "name5",
            id: 5
          },
          {
            name: "name6",
            id: 6
          }
        ]
      },
      v2: {
        name: "name7",
        id: 7
      }
    }

    let name_3 = {
      mainJson: "main.json",
      v1: {
        name: "name7",
        id: 7,
        children: [
          {
            name: "name8",
            id: 8
          },
          {
            name: "name9",
            id: 9
          }
        ]
      }
    }
  }
}