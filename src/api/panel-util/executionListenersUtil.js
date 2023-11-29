import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine, LISTENER_ALLOWED_TYPES } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { getExtensionElementsList,addExtensionElements,removeExtensionElements} from "@/api/bpmn-utils/BpmnExtensionElements";
import { createScript } from "./scriptUtil";

/**
 * @description 调用监听列表
 * @param {*} element 
 * @returns 
 */
export function getExecutionListeners(element) {
  const prefix = getProcessEngine();
  const businessObject = getListenersContainer(element);
  return getExtensionElementsList(businessObject, `${prefix}:ExecutionListener`);
}

/**
 * @description 创建空的调用监听和更新
 * @param {*} element 
 */
export function addEmptyExtensionListener(element) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const listener = moddle.create(`${prefix}:ExecutionListener`, {
    event: getDefaultEvent(element),
    class: ""
  });
  const businessObject = getListenersContainer(element);
  addExtensionElements(element, businessObject, listener);
}

/**
 * 创建调用监听
 * @param {*} element 
 * @param {*} props 
 */
export function addExecutionListener(element, props) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const businessObject = getListenersContainer(element);
  const listener = moddle.create(`${prefix}:ExecutionListener`, {});
  updateListenerProperty(element, listener, props);
  addExtensionElements(element, businessObject, listener);
}

/**
 * 更新调用监听属性
 * @param {*} element 
 * @param {*} props 
 * @param {*} listener 
 */
export function updateExecutionListener(element, props, listener) {
  removeExtensionElements(element, getListenersContainer(element), listener);
  addExecutionListener(element, props);
}


/**
 * @description 移除调用监听
 * @param {*} element 
 * @param {*} listener 
 */
export function removeExecutionListener(element, listener) {
  removeExtensionElements(element, getListenersContainer(element), listener);
}

/**
 * @description 判断是否调用
 * @param {*} element 
 * @returns 
 */
export function isExecutable(element) {
  if (isAny(element, LISTENER_ALLOWED_TYPES)) return true;
  if (is(element, "bpmn:Participant")) {
    return !!element.businessObject.processRef;
  }
  return false;
}

/**
 * @description 获取调用事件类型
 * @param {*} listener 
 * @returns 
 */
export function getExecutionListenerType(listener) {
  const prefix = getProcessEngine();
  if (isAny(listener, [`${prefix}:ExecutionListener`])) {
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
 * 获取默认调用事件
 * @param {*} element 
 * @returns 
 */
export function getDefaultEvent(element) {
  return is(element, "bpmn:SequenceFlow") ? "take" : "start";
}

/**
 * 获取调用监听类型
 * @param {*} element 
 * @returns 
 */
export function getExecutionListenerTypes(element) {
  if (is(element, "bpmn:SequenceFlow")) {
    return [{ label: "Take", value: "take" }];
  }
  return [
    { label: "Start", value: "start" },
    { label: "End", value: "end" }
  ];
}

/**
 * @description 更新监听属性
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
