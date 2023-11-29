import { isAny } from "bpmn-js/lib/util/ModelUtil";
import store from "@/store";


export function getProcessEngine() {
  try {
    if (!store.getters.getProcessEngine) {
      throw new Error("Bpmn store 或者配置加载失败");
    }
    return store.getters.getProcessEngine;
  } catch (e) {
    catchError(e);
  }
}

export function getModeler() {
  try {
    if (!store.state.bpmnModeler) {
      throw new Error("Bpmn modeler 实例化失败");
    }
    return store.state.bpmnModeler;
  } catch (e) {
    console.log(e);
  }
}
getModeler.get = function (moduleName) {
  const modeler = getModeler();
  return modeler.get(moduleName);
};
getModeler.getModdle = function () {
  const modeler = getModeler();
  return modeler.get("moddle");
};
getModeler.getModeling = function () {
  const modeler = getModeler();
  return modeler.get("modeling");
};
getModeler.getCanvas = function () {
  const modeler = getModeler();
  return modeler.get("canvas");
};

export function getActive() {
  return store.state.activeElement?.element || null;
}
export const LISTENER_ALLOWED_TYPES = [
  "bpmn:Activity",
  "bpmn:Event",
  "bpmn:Gateway",
  "bpmn:SequenceFlow",
  "bpmn:Process",
  "bpmn:Participant"
];