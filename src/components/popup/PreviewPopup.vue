<template>
  <div class="popup-container" v-if="popupData.type">
    <div class="content">
      <div class="title">
        <p>{{ "预览" + popupData.type }}</p>
        <i class="iconfont icon-guanbi" @click="close"></i>
      </div>
      <div class="data-content">
        <pre v-highlightjs = "popupData.content"><code class="javascript"></code> </pre>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, getCurrentInstance } from "vue";
import { useStore } from 'vuex';
export default {
  setup() {
    const { proxy } = getCurrentInstance();
    /**弹窗数据 */
    const popupData = computed(() => store.state.popupData);
    const store = useStore();
    function close() {
      store.commit("isPopupShow", false);
    }
    onMounted(() => {});
    return { popupData, close };
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  .content {
    position: fixed;
    width: 40%;
    height: 55rem;
    top: 23%;
    left: 22%;
    background-color: #fff;
    border-radius: 4px;
    transform: translate(-10%, -10%);
    padding:0 0.5rem;
    padding-bottom: 2rem;
    overflow: hidden;
  }
}
.title {
    display: flex;
    justify-content: space-between;
    font-weight: 550;
    background-color: #fff;
    border-bottom: 1px solid #a6a6a6;
    padding :1rem 1rem 0.5rem 1rem;
    margin-bottom: 0.3rem;
    .icon-guanbi {
        top: 0rem;
        right: 1rem;
        color: black;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
    }
  }

.data-content {
  width: 100%;
  height: calc(100% - 2rem);
  overflow: auto;
}
.hljs{
   background: #f7f7f8;
}

</style>