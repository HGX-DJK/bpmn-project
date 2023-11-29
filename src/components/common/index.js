import BpmnIcon from "@/components/common/BpmnIcon";
import CollapseTitle from "@/components/common/CollapseTitle";
import EditItem from "@/components/common/EditItem";
import NumberTag from "@/components/common/NumberTag";

const components = [BpmnIcon, CollapseTitle, EditItem,NumberTag];

export default {
  install: (Vue) => {
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  }
};
