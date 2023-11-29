<template>
  <el-collapse-item name="element-start-initiator">
    <template #title>
      <collapse-title title="启动器">
        <span class="iconfont icon-qidong"></span>
      </collapse-title>
    </template>
    <div class="element-start-initiator">
      <edit-item label="发起">
        <el-input v-model="initiator" @change="setElementInitiator" />
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { ElCollapseItem, ElInput } from "element-plus";
import { getInitiatorValue, setInitiatorValue } from "@/api/panel-util/initiatorUtil";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
  components: {
    ElCollapseItem,
    ElInput,
  },
  setup() {
    const start = reactive({
      initiator: "",
      /**获取元素初始化 */
      getElementInitiator() {
        getInitiatorValue(getActive());
      },
      /**设置元素初始化 */
      setElementInitiator(value) {
        setInitiatorValue(getActive(), value);
      },
    });
    onMounted(() => {
      start.getElementInitiator();
      EventEmitter.on("element-update", start.getElementInitiator);
    });
    return {
      ...toRefs(start),
    };
  },
};
</script>

<style lang="scss" scoped>
</style>