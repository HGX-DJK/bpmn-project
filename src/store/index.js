import { createStore } from 'vuex'
import tool from './modules/tool'
import panel from './modules/panel'
import { defaultSettings } from "@/api/configuration/editor.config";
import { unObserver } from "@/api/utils/tool";
export default createStore({
    state: {
        isShow:false,//弹窗显隐
        popupData:'',//弹窗数据
        bpmnModeler:'',
        editor: { ...defaultSettings },
        activeElement:"" //当前激活的元素
    },
    getters: {
        getProcessEngine: (state) => state.editor.processEngine,
        getEditorConfig: (state) => {
            return Object.keys(state.editor).reduce((config, key) => {
              if (!["processName", "processId", "processEngine"].includes(key)) {
                config[key] = state.editor[key];
              }
              return config;
            }, {});
        },
    },
    mutations: {
        isPopupShow(state,data){
            state.isShow=data
        },
        getPopupData(state,data){
            state.popupData=data
        },
        getBpmn(state,data){
            state.bpmnModeler=data
        },
        /**
         * @param state
         * @param element { object }
         * @param id { string }
         */
        setElement(state, { element, id }) {
            state.activeElement = { element: unObserver(element), id };
        }
    },
    actions: {},
    modules: {
      tool,
      panel
    }
})