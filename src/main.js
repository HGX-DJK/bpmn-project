import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";

import VueHighlightJS from "vue3-highlightjs"
import "highlight.js/styles/solarized-light.css"

import mitt from 'mitt'
import Common from "@/components/common";

/**插件相关的样式文件 */
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import "@/assets/bpmn-icons";
import "element-plus/dist/index.css";
/**修改element样式文件 */
import "@/assets/theme/element.scss"
let app = createApp(App);
/**全局路径配置 */
app.config.globalProperties.$baseUrl = process.env.VUE_APP_BASEURL;
app.config.globalProperties.$bus = new mitt();

app.use(store).use(router).use(VueHighlightJS).use(Common).mount('#app');
