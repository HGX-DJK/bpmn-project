<template>
    <div class="header-container">
        <div class="logo">
            <span class="iconfont icon-liucheng"></span>
            <span class="title-name">业务流程绘制平台</span>
        </div>
        <div class="item" v-for="(item,index) of list" :key="index" @click="goToPath(item,index)" :class="chooseIndex==index?'active':''">
             <span class="iconfont" :class="item.icon"></span>
             <span>{{item.name}}</span>
        </div>
    </div>
</template>

<script>
import { reactive,  toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
export default {
    setup() {
        const router = useRouter();
        const store = useStore();
        const home = reactive({
            chooseIndex:-1,
            /**功能列表 */
            list:[
                {
                    icon:"icon-yansexuanzeqi",
                    name:"默认模型",
                    path:'/modelerDefault'
                },
                {
                    icon:"icon-yulan2",
                    name:"默认视图",
                    path:'/viewerDefault'
                },
                {
                    icon:"icon-bianjisekuai",
                    name:"自定义模型",
                    path:'/customModeler'
                },
                {
                    icon:"icon-xiaoguo",
                    name:"自定义视图",
                    path:'/customViewer'
                }
            ],
            goToPath(item,index){
                if(home.chooseIndex == index){
                    home.chooseIndex = -1;
                }else{
                    router.push(item.path);
                    home.chooseIndex = index;
                };
                if(item.name == "默认视图" || item.name == "自定义视图" ){
                    store.commit("panel/changeToolsFlag",false);
                }else{
                     store.commit("panel/changeToolsFlag",true);
                }
            }
        });

        return{
            ...toRefs(home)
        }
    },
}
</script>

<style lang="scss" scoped>
.header-container{
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    background:#4a8af4;
    color:#fff;
    font-size: 1.6rem;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.15);
    .logo{
        margin-left: 2rem;
        margin-right: 10rem;
        .iconfont{
           margin-right: 1rem;
           font-size: 2rem;
        }
        .title-name{
            font-size: 1.7rem;
        }
    }
    .item{
      margin-right: 8rem;
      line-height: 4.6rem;
      cursor: pointer;
      .iconfont{
        margin-right: 0.5rem;
      }
    }
    
}
.active{
    border-bottom: 2px solid #fff;
}

</style>