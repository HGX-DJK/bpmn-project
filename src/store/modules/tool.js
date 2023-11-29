export default {
  namespaced: true,
  state: {
    toolList: [
      {
        title: "加载文件",
        id: 1,
        titleFlag: false,
        icon: "icon-shangchuan1",
      },
      {
        title: "下载文件",
        id: 2,
        titleFlag: false,
        icon: "icon-xiazai",
        list: [
          {
            name: "下载为XML文件",
            id: 201,
            flag: false,
            method: "downloadProcessAsXml"
          },
          {
            name: "下载为SVG文件",
            id: 202,
            method: "downloadProcessAsSvg"
          },
          {
            name: "下载为BPMN文件",
            id: 203,
            method: "downloadProcessAsBpmn"
          }
        ]
      },
      {
        title: "预览",
        id: 3,
        titleFlag: false,
        icon: "icon-yulan",
        list: [
          {
            name: "预览XML",
            id: 301,
            flag: false,
            method:'handerPreviewXml'
          },
          {
            name: "预览JSON",
            id: 302,
            flag: false,
            method:'handerPreviewJSON'
          }
        ]
      },
      {
        title: "撤销",
        id: 4,
        titleFlag: false,
        icon: "icon-undo",
        method:'handlerUndo'
      },
      {
        title: "恢复",
        id: 5,
        titleFlag: false,
        icon: "icon-huifu",
        method:'handlerRedo'
      },
      // {
      //   title: "放大",
      //   id: 6,
      //   titleFlag: false,
      //   icon: "icon-fangda1"
      // },
      // {
      //   title: "缩小",
      //   id: 7,
      //   titleFlag: false,
      //   icon: "icon-suoxiao-"
      // },
      // {
      //   title: "重置",
      //   id: 8,
      //   titleFlag: false,
      //   icon: "icon-recover"
      // },
      {
        title: "事件",
        id: 9,
        titleFlag: false,
        icon: "icon-shijianshuxingweihu",
        method:'event'
      },
      {
        title: "快捷键",
        id: 10,
        titleFlag: false,
        icon: "icon-kuaijiejian-"
      },
    ]
  }
}