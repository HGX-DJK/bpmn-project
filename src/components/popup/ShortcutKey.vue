<template>
    <div class="list-box">
      <p class="list-title">键盘快捷键</p>
      <div class="list-wrap">
        <div class="list-cont">
          <p class="list-item" v-for="(item,index) in keyList" :key="index">
            <span>{{item.name}}：</span> 
            <span>{{item.val}}</span>
        </p>
        </div>
      </div>
    </div>
</template>
<script>
import { reactive, toRefs } from 'vue';
export default {
    setup() {
              const listModel = reactive({
        keyList:[{
          id:1,
          val:"ctrl + z",
          name:"撤销"
        },{
          id:2,
          val:"ctrl + y",
          name:"恢复"
        },{
          id:3,
          val:"ctrl + c ",
          name:"复制"
        },{
          id:4,
          val:"ctrl + v",
          name:"粘贴"
        },{
          id:5,
          val:"ctrl + +",
          name:"放大"
        },{
          id:6,
          val:"ctrl + -",
          name:"缩小"
        },{
          id:7,
          val:"ctrl + 0",
          name:"恢复"
        },{
          id:8,
          val:"ctrl + del",
          name:"删除"
        },{
          id:9,
          val:"ctrl + 箭头",
          name:"移动"
        }],
      })
      return {
        ...toRefs(listModel),
      };
    },
}
</script>

<style lang="scss" scoped>
  .list-box {
    position: absolute;
    top: 12rem;
    right: 43rem;
    width: 26rem;
    height: 35rem;
    background: #f7f7f8;
    border-radius: 4px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.15);
    color: #595959;
    .list-title {
      padding: 0 1rem;
      border-bottom: 1px solid #dedede;
      height: 4rem;
      line-height: 4rem;
      font-weight: 600;
    }
    .list-wrap {
      padding: 2rem 1.5rem;
      height: calc(100% - 4rem);
    }
    .list-cont {
        height: 100%;
      overflow-y: auto;
      .list-item{
        line-height: 3rem;
        margin:0 1rem;
        cursor: pointer;
        span:nth-child(1){
          margin-right: 2rem;
        }
      }
    }
  }
</style>