<template>
  <div class="edit-item">
    <div class="edit-item_label" :style="labelStyle">{{ label }}：</div>
    <div class="edit-item_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { computed} from "vue";
export default {
  name: "EditItem",
  props: {
    label: {
      type: String,
      default: ""
    },
    textAlign: {
      type: String,
      default: "right",
      validator: (val) => ["left", "center", "right"].indexOf(val) !== -1
    },
    labelWidth: {
      type: Number,
      default: 80
    }
  },
  setup(props){
    let labelStyle = computed(()=>{
        return {
          width: `${props.labelWidth}px`,
          textAlign: props.textAlign
        };
    })
    return{
      labelStyle
    }
  }
};
</script>

<style scoped lang="scss">
.edit-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  line-height: 34px;
  margin:0 1rem;
  .edit-item_content {
    flex: 1;
    margin-right: 2rem;
  }

  & + .edit-item {
    margin-top: 12px;
  }
}
</style>
