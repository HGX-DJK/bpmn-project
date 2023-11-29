import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { getExtensionElementsList,addExtensionElements,removeExtensionElements} from "@/api/bpmn-utils/BpmnExtensionElements";
import { createScript } from "./scriptUtil";


/**允许监听的任务类型 */
export const LISTENER_ALLOWED_TYPES = [
  "bpmn:Task",
  "bpmn:UserTask",
  "bpmn:ServiceTask",
  "bpmn:ManualTask",
  "bpmn:SendTask",
  "bpmn:ReceiveTask",
  "bpmn:ScriptTask",
  "bpmn:BusinessRuleTask",
];
/**
 * @description 获取任务监听列表
 * @param {*} element 
 * @returns 
 */
export function getTaskListeners(element) {
  const prefix = getProcessEngine();
  const businessObject = getListenersContainer(element);
  return getExtensionElementsList(businessObject, `${prefix}:TaskListener`);
}

/**
 * @description 创建一个空的任务监听和更新
 * @param {*} element 
 */
export function addEmptyExtensionListener(element) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const listener = moddle.create(`${prefix}:TaskListener`, {
    event: getDefaultEvent(element),
    class: ""
  });
  const businessObject = getListenersContainer(element);
  addExtensionElements(element, businessObject, listener);
}

/**
 * @description 添加一个任务监听
 * @param {*} element 
 * @param {*} props 
 */
export function addTaskListener(element, props) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const businessObject = getListenersContainer(element);
  const listener = moddle.create(`${prefix}:TaskListener`, {});
  updateListenerProperty(element, listener, props);
  addExtensionElements(element, businessObject, listener);
}

/**
 * @description 更新任务监听属性
 * @param {*} element 
 * @param {*} props 
 * @param {*} listener 
 */
export function updateTaskListener(element, props, listener) {
  removeExtensionElements(element, getListenersContainer(element), listener);
  addTaskListener(element, props);
}

/**
 * @description 移除任务监听
 * @param {*} element 
 * @param {*} listener 
 */
export function removeTaskListener(element, listener) {
  removeExtensionElements(element, getListenersContainer(element), listener);
}

/**
* @description 判断是否需要任务监听
* @param {*} element 
* @returns 
*/
export function isTaskable(element) {
  if (isAny(element, LISTENER_ALLOWED_TYPES)) return true;
  return false;
}
/**
 * @descritpion 获取任务监听类型
 * @param {*} listener 
 * @returns 
 */
export function getTaskListenerType(listener) {
  const prefix = getProcessEngine();
  if (isAny(listener, [`${prefix}:TaskListener`])) {
    if (listener.get(`${prefix}:class`)) return "Java 类";
    if (listener.get(`${prefix}:expression`)) return "表达式";
    if (listener.get(`${prefix}:delegateExpression`)) return "代理表达式";
    if (listener.get("script")) return "脚本";
  }
  return "";
}

export function getListenersContainer(element) {
  const businessObject = getBusinessObject(element);
  return businessObject?.get("processRef") || businessObject;
}

/**
 * @description 获取默认的事件类型
 * @param {*} element 
 * @returns 
 */
export function getDefaultEvent(element) {
  return is(element, "bpmn:SequenceFlow") ? "take" : "任务生成";
}

/**
 * @description 获取事件监听类型
 * @param {*} element 
 * @returns 
 */
export function getTaskListenerTypes(element) {
  if (is(element, "bpmn:SequenceFlow")) {
    return [{ label: "Take", value: "take" }];
  }
  return [
    { label: "任务生成", value: "create" },
    { label: "任务分配", value: "assignment" },
    { label: "任务完成", value: "complete" },
    { label: "任务删除", value: "delete" },
    { label: "任务更新", value: "update" },
    { label: "超时", value: "timeout" },
  ];
}

/**
 * @desciption 更新监听属性
 * @param {*} element 
 * @param {*} listener 
 * @param {*} props 
 */
function updateListenerProperty(element, listener, props) {
  const modeling = getModeler.getModeling();
  const prefix = getProcessEngine();
  const { event, class: listenerClass, expression, delegateExpression, script, type, fields } = props;

  const updateProperty = (key, value) =>
    modeling.updateModdleProperties(element, listener, { [`${prefix}:${key}`]: value });

  event && updateProperty("event", event);
  listenerClass && updateProperty("class", listenerClass);
  expression && updateProperty("expression", expression);
  delegateExpression && updateProperty("delegateExpression", delegateExpression);
  console.log(props);

  if (script) {
    const bpmnScript = createScript(script);
    modeling.updateModdleProperties(element, listener, { script: bpmnScript });
  }
}
