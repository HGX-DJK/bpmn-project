import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@/api/bpmn-utils/BpmnDesignerUtils";

/**
 * @description 获取初始化启动
 * @param {*} element 
 * @returns 
 */
export function getInitiatorValue(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);

  return businessObject.get(`${prefix}:initiator`);
};

/**
 * @description 设置初始化启动
 * @param {*} element 
 * @param {*} value 
 */
export function setInitiatorValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.getModeling();
  const businessObject = getBusinessObject(element);
  modeling.updateModdleProperties(element, businessObject, {
    [`${prefix}:initiator`]: value
  });
}

/**
 * @description 判断是否显示初始化显示属性
 * @param {*} element 
 * @returns 
 */
export function isStartInitializable(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:Initiator`) && !is(element.parent, "bpmn:SubProcess");
}
