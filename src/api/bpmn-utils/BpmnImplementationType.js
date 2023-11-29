import store from "@/store";
import { find } from "min-dash";
import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";
import { getExtensionElementsList } from "../bpmn-utils/BpmnExtensionElements";
import { getProcessEngine } from "@/api/bpmn-utils/BpmnDesignerUtils";


/***************bpmn 基础类方法 ***************/
/**
 * @description 获取节点事件定义
 * @param {*} element 
 * @param {*} eventType 
 * @returns 
 */
export function getEventDefinition(element, eventType) {
  const businessObject = getBusinessObject(element);
  const eventDefinitions = businessObject.get("eventDefinitions") || [];
  return find(eventDefinitions, function (definition) {
    return is(definition, eventType);
  });
}

/**
 * @description 获取节点消息事件
 * @param {*} element 
 * @returns 
 */
export function getMessageEventDefinition(element) {
  if (is(element, "bpmn:ReceiveTask")) {
    return getBusinessObject(element);
  }
  return getEventDefinition(element, "bpmn:MessageEventDefinition");
}

/*********************bpmn 根据流程引擎的扩展方法 ********/

/**
 * @description 检查元素是否是'ServiceTaskLike'
 * @param {*} element 
 * @returns 
 */
export function isServiceTaskLike(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:ServiceTaskLike`);
}

/**
 * @description 判断给出的元素是否是'DmnCapable'
 * @param {*} element 
 * @returns 
 */
export function isDmnCapable(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:DmnCapable`);
}

/**
 * @description 判断给出的元素是否是'ExternalCapable'
 * @param {*} element 
 * @returns 
 */
export function isExternalCapable(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:ExternalCapable`);
}

/**
 * getServiceTaskLikeBusinessObject
 * 获取一个 'ServiceTaskLike' 业务对象。
 * 如果给定的元素不是 'servicetasklike '，则返回 'false'
 */
export function getServiceTaskLikeBusinessObject(element) {
  if (is(element, "bpmn:IntermediateThrowEvent") || is(element, "bpmn:EndEvent")) {
    const messageEventDefinition = getMessageEventDefinition(element);
    if (messageEventDefinition) {
      element = messageEventDefinition;
    }
  }
  return isServiceTaskLike(element) && getBusinessObject(element);
}

/**
 * 返回给定元素的实现类型。
 * 可能的实现类型有:
 * - dmn
 * - connector
 * - external
 * - class
 * - expression
 * - delegateExpression
 * - script
 * - or undefined, when no matching implementation type is found
 */
export function getImplementationType(element) {
  const prefix = getProcessEngine();
  const businessObject = getListenerBusinessObject(element) || getServiceTaskLikeBusinessObject(element);

  if (!businessObject) {
    return;
  }

  if (isDmnCapable(businessObject)) {
    const decisionRef = businessObject.get(`${prefix}:decisionRef`);
    if (typeof decisionRef !== "undefined") {
      return "dmn";
    }
  }

  if (isServiceTaskLike(businessObject)) {
    const connectors = getExtensionElementsList(businessObject, `${prefix}:Connector`);
    if (connectors.length) {
      return "connector";
    }
  }

  if (isExternalCapable(businessObject)) {
    const type = businessObject.get(`${prefix}:type`);
    if (type === "external") {
      return "external";
    }
  }

  const cls = businessObject.get(`${prefix}:class`);
  if (typeof cls !== "undefined") {
    return "class";
  }

  const expression = businessObject.get(`${prefix}:expression`);
  if (typeof expression !== "undefined") {
    return "expression";
  }

  const delegateExpression = businessObject.get(`${prefix}:delegateExpression`);
  if (typeof delegateExpression !== "undefined") {
    return "delegateExpression";
  }

  const script = businessObject.get("script");
  if (typeof script !== "undefined") {
    return "script";
  }
}

function getListenerBusinessObject(businessObject) {
  const prefix = getProcessEngine();
  if (isAny(businessObject, [`${prefix}:ExecutionListener`, `${prefix}:TaskListener`])) {
    return businessObject;
  }
}
