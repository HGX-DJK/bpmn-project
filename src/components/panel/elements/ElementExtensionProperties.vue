<template>
    <el-collapse-item name="element-extension-properties">
      <template #title>
        <collapse-title title="扩展属性">
          <span class="iconfont icon-kuozhan"></span>
        </collapse-title>
        <number-tag :value="extensions.length" margin-left="12px" />
      </template>
      <div class="element-extension-properties">
        <el-table border :data="extensions" style="width: 100%" height="200px">
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="属性名称" prop="name" show-overflow-tooltip />
          <el-table-column label="属性值" prop="value" show-overflow-tooltip />
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <button type="text" @click="removeProperty($index)" class="remove">移除</button>
            </template>
          </el-table-column>
        </el-table>
        <button  class="inline-large-button" @click="openPropertyModel(-1)">添加扩展属性</button>
      </div>

      <el-dialog v-model="modelVisible" title="添加扩展属性" width="500px" append-to-body destroy-on-close>
        <el-form ref="formRef" :model="newProperty" :rules="rules" aria-modal="true">
          <el-form-item path="name" label="属性名称( Name )">
            <el-input v-model="newProperty.name" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item path="value" label="属性值( Value )">
            <el-input v-model="newProperty.value" @keydown.enter.prevent />
          </el-form-item>
        </el-form>
        <div class="button-group">
          <button  @click="modelVisible = false" class="cancel-button">取 消</button>
          <button  @click="addProperty" class="verify-button">确 认</button>
        </div>
      </el-dialog>
  </el-collapse-item>
</template>
<script>
import { getCurrentInstance, reactive, toRefs,nextTick,onMounted} from "vue";
import { getActive } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { ElCollapseItem, ElInput,ElTable,ElFormItem,ElDialog,ElTableColumn,ElForm } from "element-plus";
import { addExtensionProperty,getExtensionProperties,removeExtensionProperty} from "@/api/panel-util/extensionPropertiesUtil";
import EventEmitter from "@/api/utils/EventEmitter";
export default {
    components: {
        ElCollapseItem,ElInput,ElTable,ElFormItem, ElDialog,ElTableColumn,ElForm
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const extension = reactive({
            /** 弹窗可见属性*/
            modelVisible: false,
            /**新的属性 */
            newProperty: { name: "", value: "" },
            /**扩展属性行 */
            extensionsRaw:'',
            /**字段验证规则 */
            rules: {
                name: { required: true, message: "属性名称不能为空", trigger: ["blur", "change"] },
                value: { required: true, message: "属性值不能为空", trigger: ["blur", "change"] }
            },
            extensions: [],
            /**重新加载扩展属性 */
            async reloadExtensionProperties() {
                extension.modelVisible = false;
                await nextTick();
                extension.newProperty = { name: "", value: "" };
                extension.extensionsRaw = getExtensionProperties(getActive());
                extension.extensions = JSON.parse(JSON.stringify(extension.extensionsRaw));
            },
            /**添加扩展属性功能按钮 */
            async openPropertyModel() {
                extension.modelVisible = true;
                await nextTick();
                proxy.$refs.formRef.clearValidate();
            },
            /**删除添加的扩展属性 */
            removeProperty(propIndex) {
              removeExtensionProperty(getActive(), extension.extensionsRaw[propIndex]);
              extension.reloadExtensionProperties();
            },
            /**添加扩展属性 */
            async addProperty() {
                await proxy.$refs.formRef.validate();;
                addExtensionProperty(getActive(), extension.newProperty);
                await extension.reloadExtensionProperties();
            },
        })
        onMounted(() => {
            extension.reloadExtensionProperties();
            EventEmitter.on("element-update", extension.reloadExtensionProperties);
        })
        return{
            ...toRefs(extension)
        }
        
    },
}
</script>

<style lang="scss" scoped>
.element-extension-properties{
    margin:0 1rem;
}
.inline-large-button{
    display: flex;
    width:100%;
    justify-content: center;
    margin-top: 1rem;
    padding:1rem 0;
    background: rgb(24, 144, 255);
    border-radius: 4px;
    color: #fff;
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
        cursor: pointer;
    }
    .verify-button{
        background: rgb(24, 144, 255);
        padding:0.5rem 1.5rem;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
    }
}
.remove{
  cursor: pointer;
  color:rgb(24, 144, 255)
}
  

</style>