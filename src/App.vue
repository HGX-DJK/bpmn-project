<template>
  <div class="header">
      <sl-header />
  </div>
  <div class="content">
      <router-view></router-view>
  </div>
  <div class="right-panel" v-if="getEditorConfig.penalMode === 'custom'">
      <sl-panel />
  </div>
  <sl-tools v-if="toolsFlag" />
</template>

<script>
import { onMounted, computed, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import slHeader from "@/views/Header.vue";
import slPanel from "@/components/panel/Panel";
import slTools from "@/components/popup/Tools.vue";
import slDefaultModeler from "@/components/DefaultModeler.vue";
export default {
  components: {
    slHeader,
    slTools,
    slPanel,
    slDefaultModeler,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    /**属性编辑配置 */
    const getEditorConfig = store.getters.getEditorConfig;
    /**工具条flag */
    const toolsFlag = computed(() => store.state.panel.toolsFlag);
    onMounted(() => {
      router.push("/modelerDefault");
    });
    return {
      getEditorConfig,
      toolsFlag,
    };
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  // min-width: 1500px;
  // min-height: 900px;
  box-sizing: border-box;
  background: #f2f2f2;
  font-size: 1.4rem;
  overflow: hidden;
}
.header {
  height: 5.2rem;
  width: 100%;
}
.content {
  width:  calc(100% - 40rem);
  height: calc(100% - 5rem);
}
.right-panel {
  position: absolute;
  width: 40rem;
  color: #595959;
  background-color: #f2f2f2;
  box-shadow: 0px 1px 8px 1px rgba(0, 0, 0, 0.13);
  height: calc(100% - 5rem);
  top: 5rem;
  right: 0;
}
</style>
