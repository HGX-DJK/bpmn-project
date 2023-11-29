<template>
  <div class="container">
    <div class="canvas"></div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, reactive, toRefs } from "vue";
import { xmlStr } from "@/api/xmlMock/xmlStr.js";
import { useStore } from 'vuex';
import BpmnModeler from "bpmn-js/lib/Modeler";
import camundaModdleDescriptors from "@/api/xmlMock/camunda.json";
import customTranslate from '@/api/customTranslate/customTranslate';
import EventEmitter from "@/api/utils/EventEmitter";
export default {
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const bpmn = reactive({
      bpmnModeler: null,
      /**XML文件 */
      xmlStr:xmlStr,
      /**比例 */
      currentScale:1,
      /**初始化 */
      init() {
        var customTranslateModule = {
          translate: [ 'value', customTranslate]
        };
        bpmn.bpmnModeler = new BpmnModeler({
          container: ".canvas",
          additionalModules: [
            customTranslateModule,
          ],
          /**扩展模型 */
          moddleExtensions: {
            camunda: camundaModdleDescriptors,
          }
        });
        bpmn.createNewDiagram();
        /**开启键盘快捷键 */
        bpmn.bpmnModeler.get('keyboard').bind(document);
        store.commit('getBpmn',bpmn.bpmnModeler);
        EventEmitter.emit("modeler-init", bpmn.bpmnModeler);
      },
      /**创建图表示意图 */
      async createNewDiagram() {
        try {
          const result = await bpmn.bpmnModeler.importXML(bpmn.xmlStr);
          /**屏幕自适应 */
          const canvas = bpmn.bpmnModeler.get("canvas");
          canvas.zoom("fit-viewport", true);
        } catch (err) {
          console.log(err.message, err.warnings);
        }
      },
    });
    onMounted(() => {
      bpmn.init();
    });

    onUnmounted(()=>{
      /**关闭键盘快捷键 */
      bpmn.bpmnModeler.get('keyboard').unbind();
    })
    return {
      ...toRefs(bpmn),
      BpmnModeler,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
.buttons li {
  display: inline-block;
  margin: 5px;
}
.buttons li a {
  color: #333;
  background: #fff;
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}
</style>
