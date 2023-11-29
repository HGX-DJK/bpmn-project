export default {
    namespaced: true,
    state: {
        panelFlag:false,
        toolsFlag:true,
    },
    mutations: {
        /**改变右边属性面板的状态 */
        changePanelFlag(state,flag){
            state.panelFlag = flag
        },
        /**改变工具条的状态 */
        changeToolsFlag(state,flag){
            state.toolsFlag = flag;
        }

    },
}