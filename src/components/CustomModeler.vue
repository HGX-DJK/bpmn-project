<template>
  <div class="container">
    <div class="canvas"></div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { CustomModeler } from "@/api/customBpmn";
import { xmlStr } from "@/api/xmlMock/xmlStrPreview";
import { useStore } from 'vuex';
import EventEmitter from "@/api/utils/EventEmitter";
import customTranslate from '@/api/customTranslate/customTranslate';
import camundaModdleDescriptors from "@/api/xmlMock/camunda.json";
export default {
  setup() {
    const store = useStore();
    const bpmn = reactive({
      bpmnModeler: null,
      /**比例 */
      scale:0,
      /**初始化 */
      init() {
        var customTranslateModule = {
          translate: [ 'value', customTranslate]
        };
        bpmn.bpmnModeler = new CustomModeler({
          container: ".canvas",
          additionalModules: [
            {
              labelEditingProvider: ["value", ""]   /**禁止编辑label */
            },
            customTranslateModule
          ],
          /**扩展模型 */
          moddleExtensions: {
            camunda: camundaModdleDescriptors,
          }
        });
        store.commit('getBpmn',bpmn.bpmnModeler);
        EventEmitter.emit("modeler-init", bpmn.bpmnModeler);
        bpmn.createNewDiagram();
      },
      /**创建图表示意图 */
      async createNewDiagram() {
        try {
          const result = await bpmn.bpmnModeler.importXML(xmlStr);
          /**屏幕自适应 */
          const canvas = bpmn.bpmnModeler.get("canvas");
          canvas.zoom("fit-viewport", true);
          bpmn.zoomReset(0.9);
          bpmn.success();
        } catch (err) {
          console.log(err.message, err.warnings);
        }
    },

    /**还原 */
    zoomReset(newScale) {
        bpmn.bpmnModeler.get("canvas").zoom(newScale, newScale === "fit-viewport" ? undefined : { x: 520, y: 500 });
    },

    /**交互监听事件 */
    success() {
      bpmn.addModelerListener();
      bpmn.addEventBusListener();
    },

    addModelerListener() {
      const bpmnjs = bpmn.bpmnModeler;
      // forEach给modeler上添加要绑定的事件
      const events = [
        "shape.added",
        "shape.move.end",
        "shape.removed",
        "connect.end",
        "connect.move"
      ];
      events.forEach(function(event) {
        bpmn.bpmnModeler.on(event, e => {
            console.log(event, e);
            var elementRegistry = bpmnjs.get("elementRegistry");
            var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
            console.log(shape);
        });
      });
    },
    addEventBusListener() {
      const eventBus = bpmn.bpmnModeler.get("eventBus");
      const modeling = bpmn.bpmnModeler.get("modeling");
      const elementRegistry = bpmn.bpmnModeler.get("elementRegistry");
      eventBus.on("element.click", function(e) {
        console.log("点击了element",e.element.businessObject.id,e.element.businessObject.$type,e.element.businessObject.name);
        if (e.element.businessObject.$type == "bpmn:SequenceFlow") {
          const sourceRef = e.element.businessObject.sourceRef;
          if (sourceRef.$type == "bpmn:ExclusiveGateway") {
            var targetElement = elementRegistry.get(sourceRef.id);
            modeling.updateProperties(targetElement, {
              default: e.element.businessObject
            });
          }
        }
      });
    },
    });
    onMounted(() => {
      bpmn.init();
    });
    
    return {
      ...toRefs(bpmn),
    };
  },
};
</script>

<style scoped>
.container {
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
.buttons li a.active {
  color: #333;
  background: #fff;
  cursor: pointer;
}
</style>
