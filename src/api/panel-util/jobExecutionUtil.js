import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { createModdleElement, getExtensionElementsList } from "@/api/bpmn-utils/BpmnExtensionElements";
import { getServiceTaskLikeBusinessObject } from "@/api/bpmn-utils/BpmnImplementationType";
import { getTimerEventDefinition } from "@/api/bpmn-utils/BpmnEventDefinition";
import { isAsync } from "@babel/core/lib/gensync-utils/async";

/**
 * @description 判断重试周期可见性
 * @param {*} element 
 * @returns 
 */
export function retryTimeCycleVisible(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);
  return (is(element, `${prefix}:AsyncCapable`) && isAsync(businessObject)) || !!isTimerEvent(element);
}
/**
 * @description 判断任务周期可见性
 * @param {*} element 
 * @returns 
 */
export function taskPriorityVisible(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);
  return (
    (is(element, `${prefix}:JobPriorized`) && isAsync(businessObject)) ||
    is(element, "bpmn:Process") ||
    (is(element, "bpmn:Participant") && businessObject.get("processRef")) ||
    !!isTimerEvent(element)
  );
}
/**
 * @description 判断任务是否是可执行的
 * @param {*} element 
 * @returns 
 */
export function isJobExecutable(element) {
  return retryTimeCycleVisible(element) || taskPriorityVisible(element);
}

/**
 * @description  获取任务优先级
 * @param {*} element 
 * @returns 
 */
export function getExternalTaskValue(element) {
  const prefix = getProcessEngine();
  const businessObject = getRelativeBusinessObject(element);
  return businessObject.get(`${prefix}:taskPriority`);
}
/**
 * @description 设置外部任务
 * @param {*} element 
 * @param {*} value 
 */
export function setExternalTaskValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.getModeling();
  const businessObject = getRelativeBusinessObject(element);
  modeling.updateModdleProperties(element, businessObject, {
    [`${prefix}:taskPriority`]: value
  });
}

/**
 * @description 获取重试周期
 * @param {*} element 
 * @returns 
 */
export function getRetryTimeCycleValue(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);
  const failedJobRetryTimeCycle = getExtensionElementsList(businessObject, `${prefix}:FailedJobRetryTimeCycle`)[0];
  return failedJobRetryTimeCycle && failedJobRetryTimeCycle.body;
}
/**
 * @description 设置重试周期
 * @param {*} element 
 * @param {*} value 
 */
export function setRetryTimeCycleValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.getModeling();
  const businessObject = getBusinessObject(element);
  let extensionElements = businessObject.get("extensionElements");
  if (!extensionElements) {
    extensionElements = createModdleElement("bpmn:ExtensionElements", { values: [] }, businessObject);
    modeling.updateModdleProperties(element, businessObject, { extensionElements });
  }
  let failedJobRetryTimeCycle = getExtensionElementsList(businessObject, `${prefix}:FailedJobRetryTimeCycle`)[0];
  if (!failedJobRetryTimeCycle) {
    failedJobRetryTimeCycle = createModdleElement(`${prefix}:FailedJobRetryTimeCycle`, {}, extensionElements);
    modeling.updateModdleProperties(element, extensionElements, {
      values: [...extensionElements.get("values"), failedJobRetryTimeCycle]
    });
  }
  modeling.updateModdleProperties(element, failedJobRetryTimeCycle, { body: value });
}


/**
 * @description 判断是否是外部的任务
 * @param {*} element 
 * @returns 
 */
function isExternalTaskLike(element) {
  const prefix = getProcessEngine();
  const bo = getServiceTaskLikeBusinessObject(element),
    type = bo && bo.get(`${prefix}:type`);
  return bo && is(bo, `${prefix}:ServiceTaskLike`) && type && type === "external";
}

function getRelativeBusinessObject(element) {
  let businessObject;
  if (is(element, "bpmn:Participant")) {
    businessObject = getBusinessObject(element).get("processRef");
  } else if (isExternalTaskLike(element)) {
    businessObject = getServiceTaskLikeBusinessObject(element);
  } else {
    businessObject = getBusinessObject(element);
  }
  return businessObject;
}

function isTimerEvent(element) {
  return is(element, "bpmn:Event") && getTimerEventDefinition(element);
}
