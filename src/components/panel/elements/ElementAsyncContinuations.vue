<template>
  <el-collapse-item name="element-async-continuations">
    <template #title>
      <collapse-title title="异步延续">
        <span class="iconfont icon-yibujiekou"></span>
      </collapse-title>
    </template>
    <edit-item label="异步前" :label-width="120">
      <el-switch v-model="acBefore" @change="updateElementACBefore" />
    </edit-item>
    <edit-item label="异步后" :label-width="120">
      <el-switch v-model="acAfter" @change="updateElementACAfter" />
    </edit-item>
    <edit-item v-if="showExclusive" label="排除" :label-width="120">
      <el-switch v-model="acExclusive" @change="updateElementACExclusive" />
    </edit-item>
  </el-collapse-item>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, onMounted, computed } from "vue";
import { ElCollapseItem, ElInput,ElSwitch } from "element-plus";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { getACAfter,getACBefore,getACExclusive,setACAfter,setACBefore,setACExclusive} from "@/api/panel-util/asynchronousContinuationsUtil";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
  components: {
    ElCollapseItem,
    ElInput,
    ElSwitch
  },
  setup() {
    let showExclusive = computed(()=>{
         return asyn.acBefore || asyn.acAfter;
    })
    const asyn = reactive({
      acBefore: false,
      acAfter: false,
      acExclusive: false,
      reloadAsyncStatus() {
        asyn.acBefore = getACBefore(getActive());
        asyn.acAfter = getACAfter(getActive());
        asyn.acExclusive = getACExclusive(getActive());
      },
      updateElementACBefore(value) {
        setACBefore(getActive(), value);
        asyn.reloadAsyncStatus();
      },
      updateElementACAfter(value) {
        setACAfter(getActive(), value);
        asyn.reloadAsyncStatus();
      },
      updateElementACExclusive(value) {
        setACExclusive(getActive(), value);
        asyn.reloadAsyncStatus();
      },
    });
    onMounted(() => {
      asyn.reloadAsyncStatus();
      EventEmitter.on("element-update", asyn.reloadAsyncStatus);
    });
    return {
      ...toRefs(asyn),
      showExclusive
    };
  },
};
</script>

<style lang="scss" scoped>
</style>