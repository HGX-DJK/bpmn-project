<template>
   <el-collapse-item name="element-documentations">
    <template #title>
      <collapse-title title="附加文档">
       <span class="iconfont icon-shiyongwendang"></span>
      </collapse-title>
    </template>
    <edit-item label="文档" :label-width="80">
      <el-input v-model="elementDoc" type="textarea" @change="updateElementDoc" />
    </edit-item>
  </el-collapse-item>
</template>

<script>
import { onMounted, reactive, toRefs,watch } from "vue";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { getDocumentValue, setDocumentValue } from "@/api/panel-util/documentationUtil";
import { ElCollapseItem, ElInput } from "element-plus";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
    components: {
      ElCollapseItem,ElInput,
    },
    setup() {
        const element = reactive({
           elementDoc: "",
            updateElementDoc(value) {
                setDocumentValue(getActive(), value);
            },
        });
        watch(()=>getActive,value=>{
            if(value){
              element.elementDoc = getDocumentValue(getActive()) || "";
            }
        })
        onMounted(()=>{
            element.elementDoc = getDocumentValue(getActive()) || "";
            EventEmitter.on("element-update", () => {
               element.elementDoc = getDocumentValue(getActive()) || "";
            });
        })
        return{
            ...toRefs(element),
        }
        
    },
}
</script>


<style lang="scss" scoped>
</style>