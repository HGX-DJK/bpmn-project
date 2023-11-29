<template>
  <div class="bpmn-panel">
    <div class="panel-header">
      <sl-bpmn-icon :name="bpmnIconName" />
      <p>{{ bpmnElementName }}</p>
      <p>{{ customTranslate(currentElementType || "Process") }}</p>
    </div>
    <!--右侧相关属性信息-->
     <el-collapse>
      <component v-for="item in renderComponents" :key="item.name" :is="item" />
    </el-collapse>
  </div>
</template>

<script>
import { onMounted,  reactive, toRefs,markRaw} from "vue";
import { useStore } from 'vuex';
/**当前元素类型中文翻译 */
import { customTranslate } from "@/api/additional-modules/Translate";
import { getModeler } from "@/api/bpmn-utils/BpmnDesignerUtils";
/**错误抓取打印 */
import { catchError } from "@/api/utils/printCatch";
/**防抖节流 */
import { debounce }   from "min-dash";
/**element-ui */
import { ElCollapse }  from 'element-plus';
import { isExecutable } from "@/api/panel-util/executionListenersUtil";
import { isTaskable } from "@/api/panel-util/taskListenersUtil";
import { isJobExecutable } from "@/api/panel-util/jobExecutionUtil";
import { isAsynchronous } from "@/api/panel-util/asynchronousContinuationsUtil";
import { isStartInitializable } from "@/api/panel-util/initiatorUtil";
import slBpmnIcon from "@/components/common/BpmnIcon.vue";
/**事件触发 */
import EventEmitter from "@/api/utils/EventEmitter";
/**获取当前图标的类型 */
import getBpmnIconType from "@/api/utils/getIconType";
import bpmnIcons from "@/assets/bpmn-icons";
/**元素常规信息 */
import ElementGenerations from "@/components/panel/elements/ElementGenerations.vue";
/**作业执行 */
import ElementJobExecution from "@/components/panel/elements/ElementJobExecution.vue";
/**附加文档信息 */
import ElementDocumentations from "@/components/panel/elements/ElementDocumentations";
/**扩展属性信息 */
import ElementExtensionProperties from "@/components/panel/elements/ElementExtensionProperties";
/**执行监听 */
import ElementExecutionListeners from "@/components/panel/elements/ElementExecutionListeners.vue";
/**任务监听 */
import ElementTaskListeners from "@/components/panel/elements/ElementTaskListeners.vue";
/**异步属性 */
import ElementAsyncContinuations from "@/components/panel/elements/ElementAsyncContinuations.vue";
/**启动发起 */
import ElementStartInitiator from "@/components/panel/elements/ElementStartInitiator.vue";
export default {
    components:{
     slBpmnIcon,
     ElCollapse,
     ElementDocumentations,
     ElementGenerations,
     ElementExtensionProperties,
     ElementExecutionListeners,
     ElementTaskListeners
    },
    setup() {
        const store = useStore();
        const panel = reactive({
            /**当前元素名称 */
            bpmnElementName: "Process",
            /**当前图标名称 */
            bpmnIconName: "Process",
            /**当前元素类型 */
            currentElementType: undefined,
            /**当前元素id */
            currentElementId: undefined,
            /**渲染组件 */
            renderComponents: [],
            /**设置当前的元素 */
            setCurrentElement: debounce(function (element) {
                let activatedElement = element, activatedElementTypeName = "";
                if (!activatedElement) {
                    const modeler = getModeler();
                    activatedElement = modeler.get("elementRegistry")?.find((el) => el.type === "bpmn:Process") || modeler.get("elementRegistry")?.find((el) => el.type === "bpmn:Collaboration");
                    if (!activatedElement) {
                        return catchError("没有发现元素!");
                    }
                };
                /**存储当前激活的元素 */
                store.commit("setElement", { element: activatedElement, id: activatedElement.id });
                activatedElementTypeName = getBpmnIconType(activatedElement);
                panel.bpmnIconName       = bpmnIcons[activatedElementTypeName];        //获得当前图标的名称
                panel.bpmnElementName    = activatedElementTypeName;                   //当前的元素的名称
                panel.currentElementId   = activatedElement.id;                        //当前元素的id
                panel.currentElementType = activatedElement.type.split(":")[1];        //当前元素的类型
                /**设置当前的组件 */
                panel.setCurrentComponents(activatedElement);
                /**更新当前激活的元素相关的属性信息 */
                EventEmitter.emit("element-update", activatedElement);
            }),
            /**设置当前的组件 */
            setCurrentComponents(element) {
                panel.renderComponents.splice(0, panel.renderComponents.length);  /**清空数组 */
                /**元素常规信息 */
                let currentBasicComponent = markRaw(ElementGenerations);          
                panel.renderComponents.push(currentBasicComponent);
                /**附加文档信息 */
                let currentDocComponent   = markRaw(ElementDocumentations);
                panel.renderComponents.push(currentDocComponent);
                /**作业执行 */
                let elementJobExecution = markRaw(ElementJobExecution)
                isJobExecutable(element) && panel.renderComponents.push(elementJobExecution);
                /**扩展属性 */
                let extensionProperties = markRaw(ElementExtensionProperties);
                panel.renderComponents.push(extensionProperties);
                /**任务监听 */
                let elementTaskListeners = markRaw(ElementTaskListeners)
                isTaskable(element) && panel.renderComponents.push(elementTaskListeners);
                /**执行监听 */
                let elementExecutionListeners = markRaw(ElementExecutionListeners)
                isExecutable(element) && panel.renderComponents.push(elementExecutionListeners);
                /**异步属性 */
                let elementAsyncContinuations = markRaw(ElementAsyncContinuations)
                isAsynchronous(element) && panel.renderComponents.push(elementAsyncContinuations);
                /**启动发起 */
                let elementStartInitiator = markRaw(ElementStartInitiator);
                isStartInitializable(element) && panel.renderComponents.push(elementStartInitiator);
            }
        })
        onMounted(()=>{
            !panel.currentElementId && panel.setCurrentElement();
            EventEmitter.on("modeler-init", (modeler) => {  
                /**导入完成后默认选中 process 节点 */
                modeler.on("import.done", () => {
                    panel.setCurrentElement(null);
                });
                /**监听选择事件，修改当前激活的元素以及表单 */
                modeler.on("selection.changed", ({ newSelection }) => {
                    panel.setCurrentElement(newSelection[0] || null);
                });
                modeler.on("element.changed", ({ element }) => {
                    /**保证修改"默认流转路径"等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。*/
                    if (element && element.id === panel.currentElementId) {
                        panel.setCurrentElement(element);
                    };
                });
            });
        })

        return{
            ...toRefs(panel),
            customTranslate
        }
        
    },
}
</script>

<style lang="scss" scoped>
.bpmn-panel{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}
.panel-header{
    display: grid;
    padding: 8px;
    grid-template-columns: 40px auto;
    grid-template-rows: 1fr 1fr;
    grid-column-gap: 16px;
    align-items: center;
    background: #f5f5f7;
}

</style>