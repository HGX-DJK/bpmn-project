<template>
  <div class="number-tag" :style="computedStyle">
    {{ value }}
  </div>
</template>

<script>
import { computed } from 'vue-demi';
export default {
  name: "NumberTag",
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    hidden: {
      type: Boolean,
      default: false
    },
    marginLeft: {
      type: [String, Number],
      default: 0
    }
  },
  setup(props){
    let computedStyle = computed(()=>{
      let marginLeft = props.marginLeft
      if (typeof props.marginLeft === "string") {
        return { marginLeft };
      }
      return { marginLeft: marginLeft + "px" };
    })
    return{
      computedStyle
    }
  }
};
</script>

<style scoped lang="scss">
.number-tag {
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  color: #409eff;
  border: 1px solid #d9ecff;
  background-color: #ecf5ff;
  text-align: center;
}
</style>
