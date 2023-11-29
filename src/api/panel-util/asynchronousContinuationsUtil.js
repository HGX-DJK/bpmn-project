import { is } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@/api/bpmn-utils/BpmnDesignerUtils";

////////// only in element extends bpmn:Task
export function getACBefore(element) {
  const prefix = getProcessEngine();
  return isAsyncBefore(element.businessObject, prefix);
}
export function setACBefore(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  /**重写异步属性 */
  modeling.updateModdleProperties(element, element.businessObject, {
    [`${prefix}:asyncBefore`]: value,
    [`${prefix}:async`]: undefined
  });
}

export function getACAfter(element) {
  const prefix = getProcessEngine();
  return isAsyncAfter(element.businessObject, prefix);
}
export function setACAfter(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, element.businessObject, {
    [`${prefix}:asyncAfter`]: value
  });
}

export function getACExclusive(element) {
  const prefix = getProcessEngine();
  return isExclusive(element.businessObject, prefix);
}
export function setACExclusive(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, element.businessObject, {
    [`${prefix}:exclusive`]: value
  });
}


/**
 * @description 是否支持异步属性
 * @param {*} element 
 * @returns 
 */
export function isAsynchronous(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:AsyncCapable`);
}

/**
 * @description 判断'asyncBefore'的设置属性值
 * @param {*} bo 
 * @param {*} prefix 
 * @returns 
 */
function isAsyncBefore(bo, prefix) {
  return !!(bo.get(`${prefix}:asyncBefore`) || bo.get(`${prefix}:async`));
}

/**
 * @descrition 判断'asyncAfter'的设置属性值
 * @param {*} bo 
 * @param {*} prefix 
 * @returns 
 */
function isAsyncAfter(bo, prefix) {
  return !!bo.get(`${prefix}:asyncAfter`);
}

/**
 * @description 判断'exclusive'的属性值
 * @param {*} bo 
 * @param {*} prefix 
 * @returns 
 */
function isExclusive(bo, prefix) {
  return !!bo.get(`${prefix}:exclusive`);
}
