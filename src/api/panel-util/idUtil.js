import { catchError } from "@/api/utils/printCatch";
import { getModeler } from "@/api/bpmn-utils/BpmnDesignerUtils";
import { isIdValid } from "@/api/bpmn-utils/BpmnValidator";

/**获得id的值 */
export function getIdValue(element) {
  return element.businessObject.id;
}

/**设置id的值 */
export function setIdValue(element, value) {
  const errorMsg = isIdValid(element.businessObject, value);
  if (errorMsg && errorMsg.length) {
    return catchError(errorMsg);
  }
  const modeling = getModeler.getModeling();
  modeling.updateProperties(element, {
    id: value
  });
}
