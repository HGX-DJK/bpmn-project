<template>
 <el-collapse-item name="element-external-task">
    <template #title>
      <collapse-title title="作业执行">
        <span class="iconfont icon-job"></span>
      </collapse-title>
    </template>
    <div class="element-external-task">
      <edit-item v-if="priorityVisible" label="任务优先级" :label-width="100">
        <el-input v-model="taskPriority" maxlength="32" @change="setExternalTaskPriority" />
      </edit-item>
      <edit-item v-if="retryVisible" label="重试周期" :label-width="100">
        <el-input v-model="retryTimeCycle" maxlength="32" @change="setRetryTimeCycle" />
      </edit-item>
    </div>
  </el-collapse-item>
    
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { ElCollapseItem, ElInput} from "element-plus";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import {getExternalTaskValue,getRetryTimeCycleValue,retryTimeCycleVisible,setExternalTaskValue,setRetryTimeCycleValue,taskPriorityVisible} from "@/api/panel-util/jobExecutionUtil";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
    components:{
        ElCollapseItem,ElInput
    },
    setup() {
        const job = reactive({
            /**重试周期 */
            retryTimeCycle: undefined,
            retryVisible: false,
            /**任务优先级 */
            taskPriority: undefined,
            priorityVisible: false,
            /**获取任务优先级 */
            getRetryTimeCycle() {
                job.retryVisible = retryTimeCycleVisible(getActive());
                job.retryTimeCycle = getRetryTimeCycleValue(getActive()) || "";
            },
            /**获取外部任务优先级 */
            getExternalTaskPriority() {
                job.priorityVisible = taskPriorityVisible(getActive());
                job.taskPriority = getExternalTaskValue(getActive()) || "";
            },
            setRetryTimeCycle(value) {
               setRetryTimeCycleValue(getActive(), value);
            },
            setExternalTaskPriority(value) {
               setExternalTaskValue(getActive(), value);
            }
        });
        onMounted(()=>{
            /**获取重复周期 */
            job.getRetryTimeCycle();
            /**获取任务优先级 */
            job.getExternalTaskPriority();
            EventEmitter.on("element-update", () => {
                job.getRetryTimeCycle();
                job.getExternalTaskPriority();
            });
        })

        return{
            ...toRefs(job)
        }
        
    },
}
</script>

<style lang="scss" scoped>

</style>