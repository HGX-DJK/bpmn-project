<template>
  <div class="container">
      <div class="canvas" id="canvas"></div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive,  toRefs } from "vue";
import { CustomViewer } from "@/api/customBpmn";
import { xmlStr } from "@/api/xmlMock/xmlStrPreview";
import { useStore } from 'vuex';
import EventEmitter from "@/api/utils/EventEmitter";
import camundaModdleDescriptors from "@/api/xmlMock/camunda.json";
export default {
 setup(){
      const {proxy}  = getCurrentInstance();
      const store = useStore();
      const bpmn = reactive({
        bpmnViewer:null,
        init(){
            bpmn.bpmnViewer = new CustomViewer({
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
            /**屏幕自适应 */
            const canvas = bpmn.bpmnViewer.get("canvas");
            canvas.zoom("fit-viewport", true);
            bpmn.zoomReset(0.9);
            bpmn.success();
          } catch (err) {
            console.log(err.message, err.warnings);
          }
        },

        /**还原 */
        zoomReset(newScale) {
          bpmn.bpmnViewer.get("canvas").zoom(newScale, newScale === "fit-viewport" ? undefined : { x: 520, y: 500 });
        },
        /**添加成功之后执行操作 */
        success(){
          bpmn.setColor();
          bpmn.addEventBusListener();
        },
        /**节点设置颜色 */
        setColor() {
          const canvas = bpmn.bpmnViewer.get("canvas");
          // 获取到全部节点
          const allShapes = bpmn.bpmnViewer.get("elementRegistry").getAll();
          //循环节点添加颜色
          allShapes.forEach(element => {
              const shapeId    = element.businessObject.id;
              const shapeAttrs = element.businessObject.$attrs;
              /**add Matker */
              if (element.businessObject.$type != "bpmn:Group") {
                if (element.businessObject.$type == "bpmn:SequenceFlow") {
                  canvas.addMarker(shapeId, "highlight-2" + shapeAttrs.run_state);
                } else {
                  canvas.addMarker(shapeId, "highlight-" + shapeAttrs.run_state);
                }
              }
          });
        },
        /**添加监听事件 */
        addEventBusListener() {
          const eventBus = bpmn.bpmnViewer.get("eventBus");
          eventBus.on("element.click", function(e) {
            console.log("点击了element",e.element.businessObject.id,e.element.businessObject.$type,e.element.businessObject.name);
          });
        }

      })
      onMounted(()=>{
          /**初始化 */
          bpmn.init();
      })
      return{
         ...toRefs(bpmn),
      }
 }
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}

.highlight .djs-visual > :nth-child(1) {
  fill: #dfdfdf !important;
  stroke: #dfdfdf !important;
}
.highlight-0 .djs-visual > :nth-child(1) {
  stroke: black !important;
}
.highlight-1 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #f8f8f8 !important;
}
.highlight-2 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #cff5fa !important;
}
.highlight-3 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #d7f6ce !important;
}
.highlight-4 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #ffafaf !important;
}
.highlight-5 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #fde1b0 !important;
}
.highlight-6 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #f6d5f0 !important;
}
.highlight-7 .djs-visual > :nth-child(1) {
  fill: #c9e2fa !important;
}
.highlight-8 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #e2dcf9 !important;
}
.highlight-9 .djs-visual > :nth-child(1) {
  stroke: black !important;
  fill: #fa7c7c !important;
}
/* 连线 */
.highlight-20 .djs-visual > :nth-child(1) {
  stroke: black !important;
}
.highlight-23 .djs-visual > :nth-child(1) {
  stroke: green !important;
}
.highlight-24 .djs-visual > :nth-child(1) {
  stroke: red !important;
}
</style>
