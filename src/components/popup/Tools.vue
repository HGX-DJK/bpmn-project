<template>
  <ul class="buttons-list">
    <li class="button-item" :class="{'active':item.id==currentId}" v-for="(item, i) of toolList" :key="i" @click="chooseTool(item)">
      <div class="wrapper">
        <div @click="item.id==1?$refs.refFile.click():doClick(item)">
          <i class="iconfont" :class="item.icon"></i>
          <span>{{item.title}}</span>
        </div>
        <!-- 子选项 -->
        <ul class="submenu" v-if="item.id==currentId && item.list">
          <li v-for="(val, index) of item.list" :key="index" :class="{'active':val.id==currChildId}" @click.stop="chooseChildren(val)">
            <p @click="doClick(val)">{{val.name}}</p>
          </li>
        </ul>
      </div>
    </li>
    <input class="load-input" type="file" accept=".xml, .bpmn" id="files" ref="refFile" @change="loadXML"/>
  </ul>
  <div class="bottom-buttons">
    <i class="iconfont icon-miaozhun" title="还原" @click="zoomReset('fit-viewport')"></i>
    <i class="iconfont icon-fangda2"  title="放大" @click="handlerZoom('zoomIn')"></i>
    <i class="iconfont icon-suoxiao"  title="缩小" @click="handlerZoom('zoomOut')"></i>
  </div>
  <sl-event-list   v-if="currentId=='9'" />
  <sl-shortcut-key v-if="currentId=='10'" />
  <keep-alive>
     <sl-preview-popup v-if="isShow" />
  </keep-alive>
</template>

<script>
import { computed, reactive, toRefs,getCurrentInstance} from 'vue'
import { useStore } from 'vuex'
import { downloadProcess } from "@/api/utils/files";
import { xmlStr } from "@/api/xmlMock/xmlStr.js";
import slEventList from "@/components/popup/EventList.vue";
import slShortcutKey from "@/components/popup/ShortcutKey.vue";
import slPreviewPopup from "@/components/popup/PreviewPopup.vue";

export default {
  components: {
    slEventList,
    slShortcutKey,
    slPreviewPopup
  },
  setup () {
    const {proxy}=getCurrentInstance()
    const store = useStore();
    // 工具条
    const toolList = computed(()=>{
      return store.state.tool.toolList;
    });
    const isShow = computed(() => store.state.isShow);
    const toolModel = reactive({
      bpmnModeler:computed(()=>store.state.bpmnModeler),
      currentId: -1, // 当前选中的操作id
      currChildId: -1, // 当前选中的子项操作id

      /**XML文件 */
      xmlStr: xmlStr,
      /**比例 */
      currentScale:1,

      // 选择工具
      chooseTool(item){
        toolModel.currChildId = -1
        if([1,4,5].includes(toolModel.currentId)){ // 点击 加载文件、撤销、恢复 常亮
          toolModel.currentId = item.id;
        }else{ // 其他点击第二次取消选中状态
          toolModel.currentId = toolModel.currentId == item.id ? -1 :item.id;
        }
      },
      // 选择工具子项
      chooseChildren(val){
        toolModel.currChildId = toolModel.currChildId == val.id ? -1 : val.id;
      },

      /**加载本地BPMN文件 */
      loadXML(){
        const file = document.querySelector("#files").files;
        var reader = new FileReader();
        reader.readAsText(file[0]);
        reader.onload = function(e) {
          toolModel.xmlStr = e.target.result;
          toolModel.createNewDiagram();
        };
      },
      async createNewDiagram() {
        try {
          const result = await toolModel.bpmnModeler.importXML(toolModel.xmlStr);
          // 屏幕自适应
          const canvas = toolModel.bpmnModeler.get("canvas");
          canvas.zoom("fit-viewport", true);

        } catch (err) {
          console.log(err.message, err.warnings);
        }
      },

      /**保存为bpmn */
      downloadProcessAsBpmn() {
         downloadProcess("bpmn");
      },
      /**保存为xml */
      downloadProcessAsXml() {
         downloadProcess("xml");
      },
      /**保存为svg */
      downloadProcessAsSvg() {
         downloadProcess("svg");
      },

      /**预览xml */
      async handerPreviewXml() {
         store.commit("isPopupShow", true);
        const { xml } = await toolModel.bpmnModeler.saveXML({
          format: true,
          preamble: true
        });
        store.commit("getPopupData", { content: xml, type: "xml" });
      },
      /**预览json */
      async handerPreviewJSON() {
        const { xml } = await toolModel.bpmnModeler.saveXML({
          format: true,
          preamble: true
        });
        const jsonStr = await toolModel.bpmnModeler.get("moddle").fromXML(xml);
        let codeString = JSON.stringify(jsonStr, null, 2);
        store.commit("getPopupData", { content: codeString, type: "json" });
        store.commit("isPopupShow", true);
      },
      /**撤销 */
      handlerUndo(){
        toolModel.bpmnModeler.get("commandStack").undo();
      },
      /**恢复 */
      handlerRedo(){
        toolModel.bpmnModeler.get("commandStack").redo();
      },
      /**放大、缩小 */
      handlerZoom(param) {
        switch (param){
          case "zoomIn":
            toolModel.currentScale = Math.floor(toolModel.currentScale * 100 + 0.1 * 100) / 100;
            break;
          case "zoomOut":
            toolModel.currentScale = Math.floor(toolModel.currentScale * 100 - 0.1 * 100) / 100;
            break;
        };
        console.log(toolModel.currentScale);
        toolModel.zoomReset(toolModel.currentScale);
      },
      /**还原 */
      zoomReset(newScale) {
        toolModel.bpmnModeler.get("canvas").zoom(newScale, newScale === "fit-viewport" ? undefined : { x: 20, y: 10 });
      },
      // 点击工具选项
      doClick(item) {
        toolModel[item.method] && toolModel[item.method](item);
      },

    })
    return {
      toolList,
      ...toRefs(toolModel),
      isShow
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons-list{
  position: absolute;
  top: 7rem;
  right: 43rem;
  display: flex;
  color: #595959;
  background-color: #f7f7f8;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.button-item{
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin: 1rem;
  cursor: pointer;
  .iconfont{
    margin-right: 0.3rem;
  }
}
.active{
  color: #4a8af4;
}
.submenu{
  position: absolute;
  top: 4rem;
  right: -3rem;
  white-space: nowrap;
  font-size: 1.3rem;
  color: #595959;
  background-color: #f2f2f2;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.15);
  li:nth-child(1){
    padding-top: 2rem;
  }
  p{
    padding: 0 1.5rem;
    padding-bottom: 2rem;
    cursor: pointer;
  }
}
.wrapper{
  position: relative;
  div{
    display:flex;
    align-items:center
  }
}
.bottom-buttons{
  position: absolute;
  bottom: 6rem;
  right: 43rem;
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  background-color: #f7f7f8;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.15);
  .iconfont{
    font-size: 2.5rem;
    margin: 0.5rem 0;
    color: #555;
    cursor: pointer;
  }
}
.load-input{
  position: absolute;
  top: 0;
  left: 0;
  width: 9.5rem;
  height: 100%;
  display: none;
}
.icon-shangchuan1{
  font-size: 2rem;
}
.icon-xiazai{
  font-size: 1.4rem;
}
.icon-yulan{
  font-size: 2rem;
}
.icon-huifu{
  font-size: 2rem;
}
.icon-shijianshuxingweihu{
  font-size: 1.9rem;
}
</style>