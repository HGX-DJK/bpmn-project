<template>
  <div class="list-box">
    <p class="list-title">Bpmn.js当前已注册事件</p>
    <div class="list-wrap">
      <input class="gr-input-default" type="text" placeholder="请输入事件名称关键词查询" v-model="listenerFilter" />
      <div class="list-cont">
        <p class="list-item" v-for="(item,index) in eventList" :key="index">{{`${index + 1}：${item}`}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs,onMounted,watch, computed } from 'vue';
import { getModeler } from "@/api/bpmn-utils/BpmnDesignerUtils";
export default {
  components: {},
  setup() {
    let modeler = getModeler();
    let eventList = computed(()=>{
        return listModel.allEventList .filter((i) => i.includes(listModel.listenerFilter));
    })

    const listModel = reactive({
      allEventList:[],
      listenerFilter:""
    });
    
    watch(()=>modeler,(val)=>{
        if (val) {
          listModel.allEventList = Object.keys(modeler.get("eventBus")?._listeners || {}).sort();
        }
    },{immediate: true})

    return {
      ...toRefs(listModel),
      eventList
    };
  },
};
</script>
<style lang="scss" scoped>
.list-box {
  position: absolute;
  top: 12rem;
  right: 41rem;
  width: 47rem;
  height: 50rem;
  background: #f7f7f8;
  border-radius: 4px;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.15);
  color: #595959;
  .list-title {
    padding: 0 1rem;
    border-bottom: 1px solid #dedede;
    height: 4rem;
    line-height: 4rem;
    font-weight: 600;
  }
  .list-wrap {
    padding: 2rem;
    height: calc(100% - 4rem);
  }
  .list-cont {
    height: calc(100% - 4rem);
    overflow-y: auto;
    margin-top: 1rem;
    .list-item{
      line-height: 3rem;
    }
  }
}
</style>