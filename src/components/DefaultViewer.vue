<template>
  <div class="container">
      <div class="canvas"></div>
  </div>
</template>

<script>
import { onMounted, reactive,  toRefs } from "vue";
import { xmlStr } from "@/api/xmlMock/xmlStrViewer";
import { useStore } from 'vuex';
import BpmnViewer from "bpmn-js/lib/Viewer";
import EventEmitter from "@/api/utils/EventEmitter";
import camundaModdleDescriptors from "@/api/xmlMock/camunda.json";
export default {
 setup(){
      const store = useStore();
      const bpmn = reactive({
        bpmnViewer:null,
        init(){
            bpmn.bpmnViewer = new BpmnViewer({
                container:".canvas",
                /**扩展模型 */
                moddleExtensions: {
                  camunda: camundaModdleDescriptors,
                }
            });
            bpmn.createNewDiagram();
            store.commit('getBpmn',bpmn.bpmnViewer);
            EventEmitter.emit("modeler-init", bpmn.bpmnViewer);
        },
        /**创建图表示意图 */
        async createNewDiagram() {
            try {
              const result = await bpmn.bpmnViewer.importXML(xmlStr);
              console.log(result);
              /**屏幕自适应 */
              const canvas =  bpmn.bpmnViewer.get("canvas");
              canvas.zoom("fit-viewport", true);

            } catch (err) {
              console.log(err.message, err.warnings);
            }
          }
      })
      onMounted(()=>{
          /**模型初始化 */
          bpmn.init();
      })
      return{
         ...toRefs(bpmn),
         BpmnViewer
      }
 }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
