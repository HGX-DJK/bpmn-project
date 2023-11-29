<template>
  <el-collapse-item name="base-info">
    <template #title>
      <collapse-title title="常规信息">
        <span class="iconfont icon-xinxi"></span>
      </collapse-title>
    </template>
    <edit-item label="元素id">
      <el-input v-model="elementId" maxlength="32" @change="updateElementId"/>
    </edit-item>
    <edit-item label="名称">
      <el-input v-model="elementName" maxlength="20" @change="updateElementName"/>
    </edit-item>
    <template v-if="isProcess">
        <edit-item key="version" label="版本">
          <el-input v-model="elementVersion" maxlength="20" @change="updateElementVersion"/>
        </edit-item>
        <edit-item key="executable" label="调用">
          <el-switch v-model="elementExecutable" @change="updateElementExecutable"/>
        </edit-item>
    </template>
  </el-collapse-item>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { setIdValue } from "@/api/panel-util/idUtil";
import { getNameValue,setNameValue } from "@/api/panel-util/nameUtil";
import { ElCollapseItem, ElInput, ElSwitch } from "element-plus";
import { setProcessVersionTag ,setProcessExecutable,getProcessExecutable,getProcessVersionTag } from "@/api/panel-util/processUtil";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
  components: {
    ElCollapseItem,ElInput,ElSwitch,
  },
  setup() {
    const element = reactive({
      /**元素的id */
      elementId: "",
      /**元素的名称 */
      elementName: "",
      /**元素版本 */
      elementVersion: "",
      /**元素调用与否 */
      elementExecutable: true,
      /**是否显示版本 */
      isProcess: false,
      /**重新加载元素生成的数据 */
      reloadGenerationData() {
        element.isProcess = !!getActive() && getActive().type === "bpmn:Process";
        element.elementId = getActive().id;
        element.elementName = getNameValue(getActive()) || "";
        if (element.isProcess) {
           element.elementExecutable = getProcessExecutable(getActive());
           element.elementVersion    = getProcessVersionTag(getActive()) || "";
        }
      },
      /**更新元素id */
      updateElementId(value) {
         setIdValue(getActive(), value);
      },
      /**更新元素名称 */
      updateElementName(value) {
         setNameValue(getActive(), value);
      },
      /**更新元素版本 */
      updateElementVersion(value) {
            const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/;
            if (reg.test(value)) {
                setProcessVersionTag(getActive(), value);
            } else {
                catchError("版本号必须符合语义化版本2.0.0 要点");
            }
        },
      /**更新元素调用 */
      updateElementExecutable(value) {
          setProcessExecutable(getActive(), value);
      }
    });
    onMounted(() => {
      element.reloadGenerationData();
      EventEmitter.on("element-update", element.reloadGenerationData);
    });
    return {
      ...toRefs(element),
    };
  },
};
</script>


<style lang="scss" scoped>
</style>