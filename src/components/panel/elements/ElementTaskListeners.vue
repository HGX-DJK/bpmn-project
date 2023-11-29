<template>
    <el-collapse-item name="element-task-listeners">
    <!--监听标题-->
    <template #title>
      <collapse-title title="任务监听">
        <span class="iconfont icon-renwujincheng"></span>
      </collapse-title>
      <number-tag :value="listeners.length" margin-left="12px" />
    </template>
    <!--监听属性列表-->
    <div class="element-task-listeners">
      <el-table border :data="listeners" style="width: 100%" height="200px">
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="事件类型" prop="event" show-overflow-tooltip />
        <el-table-column label="监听器类型" prop="type" show-overflow-tooltip />
        <el-table-column label="操作" width="100">
          <template #default="{ row, $index }">
            <button class="edit-button" @click="openListenerModel($index, row)">编辑</button>
            <button class="remove-button" @click="removeListener($index)">移除</button>
          </template>
        </el-table-column>
      </el-table>
      <button  class="inline-large-button"  @click="openListenerModel(-1)">添加任务监听</button>
    </div>
    <!--执行监听属性面板-->
    <el-dialog v-model="modelVisible" title="添加任务监听器" width="500px" append-to-body destroy-on-close>
      <el-form ref="formRef" :model="newListener" :rules="formRules" class="need-filled" aria-modal="true">
        <el-form-item path="event" label="事件类型( Event Type )">
          <el-select v-model="newListener.event">
            <el-option v-for="{ label, value } in listenerEventTypeOptions" :label="label"  :value="value" :key="value"/>
          </el-select>
        </el-form-item>
        <el-form-item path="type" label="监听器类型( Listener Type )">
          <el-select v-model="newListener.type" @change="updateListenerType">
            <el-option v-for="{ label, value } in listenerTypeOptions" :label="label" :value="value" :key="value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formItemVisible.listenerType === 'class'" path="class" label="Java类( Java Class )">
          <el-input v-model="newListener.class" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item v-if="formItemVisible.listenerType === 'expression'"  path="expression"  label="条件表达式( Expression )" >
          <el-input v-model="newListener.expression" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item v-if="formItemVisible.listenerType === 'delegateExpression'" path="delegateExpression" label="代理条件表达式( Delegate Expression )">
          <el-input v-model="newListener.delegateExpression" @keydown.enter.prevent />
        </el-form-item>
        <template v-if="formItemVisible.listenerType === 'script' && newListener.script">
          <el-form-item key="scriptFormat" path="script.scriptFormat" label="脚本格式( Script Format )">
            <el-input v-model="newListener.script.scriptFormat" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item key="scriptType" path="script.scriptType" label="脚本类型( Script Type )">
            <el-select v-model="newListener.script.scriptType" @change="updateScriptType">
              <el-option v-for="{ label, value } in scriptTypeOptions" :label="label" :value="value" :key="value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formItemVisible.scriptType === 'inline'" key="scriptContent" path="script.value" label="脚本内容( Script Content )">
            <el-input v-model="newListener.script.value" type="textarea" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item v-if="formItemVisible.scriptType === 'external'" key="scriptResource" path="script.resource" label="外链脚本地址( Script Resource )">
            <el-input v-model="newListener.script.resource" @keydown.enter.prevent />
          </el-form-item>
        </template>
      </el-form>
      <div class="button-group">
        <button @click="modelVisible = false" class="cancel-button">取 消</button>
        <button type="primary" @click="saveExecutionListener" class="verify-button">确 认</button>
      </div>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import { getCurrentInstance, reactive, toRefs,onMounted} from "vue";
import { ElCollapseItem, ElInput,ElTable,ElFormItem,ElDialog,ElTableColumn,ElForm,ElSelect,ElOption } from "element-plus";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { getScriptType } from "@/api/panel-util/scriptUtil";
import { listenerTypeOptions, scriptTypeOptions } from "@/api/configuration/enumsOption";
import { addTaskListener,getTaskListeners, getDefaultEvent,  getTaskListenerType,getTaskListenerTypes,updateTaskListener,removeTaskListener} from "@/api/panel-util/taskListenersUtil";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
    components: {
        ElCollapseItem,ElInput,ElTable,ElFormItem,ElDialog, ElTableColumn,ElForm,ElSelect,ElOption
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const listener = reactive({
            modelVisible: false,
            listeners: [],
            newListener: {},
            activeIndex:-1,
            /**填写属性校验 */
            formRules: {
                event: { required: true, trigger: ["blur", "change"], message: "事件类型不能为空"   },
                type:  { required: true, trigger: ["blur", "change"], message: "监听器类型不能为空" }
            },
            formItemVisible: {
                listenerType: "class",
                scriptType: "none"
            },
            listenersRaw:[],
            /**监听事件类型可选项 */
            listenerEventTypeOptions: [],
            listenerTypeOptions: listenerTypeOptions,
            scriptTypeOptions: scriptTypeOptions,
            /**重新加载扩展监听 */
            reloadExtensionListeners() {
                listener.modelVisible = false;
                listener.updateListenerType("class");
                listener.newListener = { event: getDefaultEvent(getActive()), type: "class" };
                /**获取监听事件类型 */
                listener.listenerEventTypeOptions = getTaskListenerTypes(getActive());
                listener.listenersRaw = getTaskListeners(getActive());
                const list = listener.listenersRaw.map((item) => ({
                    ...item,
                    ...(item.script? { script: { ...item.script, scriptType: getScriptType(item.script) } }: {}),
                    type: getTaskListenerType(item)
                }));
                listener.listeners = JSON.parse(JSON.stringify(list));
            },
  
            /**打开监听配置弹窗 */
            async openListenerModel(index, listenerData) {
                listener.activeIndex = index;
                listenerData && (listener.newListener = JSON.parse(JSON.stringify(listenerData)));
                listener.updateListenerType(listenerData?.type || "class");
                listener.modelVisible = true;
                await proxy.$nextTick();
                proxy.$refs.formRef && proxy.$refs.formRef.clearValidate();
            },
            /**保存调用监听 */
            async saveExecutionListener(index) {
                await proxy.$refs.formRef.validate();
                listener.activeIndex === -1
                    ? addTaskListener(getActive(), listener.newListener)
                    : updateTaskListener(getActive(), listener.newListener, listener.listenersRaw[listener.activeIndex]);
                listener.reloadExtensionListeners();
            },
            /**移除监听项 */
            removeListener(index) {
                const listenerItem = listener.listenersRaw[index];
                removeTaskListener(getActive(), listenerItem);
                listener.reloadExtensionListeners();
            },
            /**更新监听类型 */
            updateListenerType(value) {
                listener.formItemVisible.listenerType = value;
                listener.newListener = {
                    ...listener.newListener,
                    type: value,
                    ...(value === "script" ? { script: listener.newListener.script || {} } : {})
                };
            },
            /**更新脚本类型 */
            updateScriptType(value) {
                listener.formItemVisible.scriptType = value;
                listener.newListener.script = {
                    scriptFormat: this.newListener.script?.scriptFormat,
                    scriptType: value
                };
            },
        });
        onMounted(()=>{
            listener.reloadExtensionListeners();
            EventEmitter.on("element-update", listener.reloadExtensionListeners);
        })
        return{
            ...toRefs(listener)
        }
        
    },
}
</script>

<style lang="scss" scoped>

.element-task-listeners{
    margin:0 1rem;
}

.inline-large-button{
    display: flex;
    width:100%;
    justify-content: center;
    padding:1rem 0;
    margin-top: 1rem;
    background: rgb(24, 144, 255);
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
}
button{
   cursor: pointer;
}

.button-group{
    display: flex;
    justify-content: center;
    margin-top:1rem;
    margin-bottom: 2rem;
    .cancel-button{
        background: #595959;
        padding:0.5rem 1.5rem;
        margin-right: 8rem;
        border-radius: 5px;
        color: #fff;
    }
    .verify-button{
        background: rgb(24, 144, 255);
        padding:0.5rem 1.5rem;
        border-radius: 5px;
        color: #fff;
  
    }
}

.edit-button{
    color: rgb(24, 144, 255);
    margin-right: 1rem;
}
.remove-button{
  color: rgb(24, 144, 255);
}

</style>