<!--
    by: yingdong 2018年08月27日
    name: 首页
    notes:
-->
<template>
<div class="webcontent">
    <top-header></top-header>
    <div class="menuBox">
        <div class="menuListFrame ">
            <a v-for="(item,index) in systemNavList"
                @click="changeSystemNav(item)"
                :key="index"
                :class="['menuNode',{'active':item.pathName==curSystemMenu}]">
                {{item.name}}
            </a>
        </div>
    </div>
    <div class="contentView">
     
        <router-view></router-view>
        
    </div>
    <page-loading v-show="loadingFlag"></page-loading>
</div>
</template>
<script>
import TopHeader from '@/libs/modules/header';
import pageLoading from '@/libs/modules/pageLoading';
export default {
    data() {
        return {
            loadingFlag: false,
            curSystemMenu:"/contentBody/moduleManage.html",
            systemNavList: [{
                    name: "模块管理",
                    pathName: "/contentBody/moduleManage.html"
                },
                {
                    name: "资源管理",
                    pathName: "/contentBody/resourceManage.html"
                },
                {
                    name: "内容管理",
                    pathName: "/contentBody/contentManage.html"
                },
                // {
                //     name: "知识管理",
                //     pathName: ""
                // }
            ]
        }
    },
    watch:{
        $route(newRoute,oldRoute){
            this.curSystemMenu=newRoute.meta.parentRouter || newRoute.name;
            window.scrollTo(0, 0);
        }
    },
    mounted(){
        this.curSystemMenu=this.$route.name || this.$route.meta.parentRouter;
    },
    methods:{
        //切换菜单
        changeSystemNav(option){
            this.$router.push({name:option.pathName});
        },
    },
    components: {
        TopHeader,
        pageLoading
    }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.webcontent {
    padding-top: 50px;
    min-width: 1000px;
    overflow: auto;
    .contentView{
      width: 100%;
      max-width: 1366px;
      margin: 0 auto;
      padding: 0px 10px 20px;
      vertical-align: top;
      overflow: hidden;
      margin-top:50px;
    }
    .menuBox{
        background: @themeColor;
        z-index: 909;
        position: fixed;
        top: 50px;
        left: 0;
        right: 0;
        width: 100%;
        height: 50px;
        .menuListFrame{
          max-width: 1366px;
          margin: 0 auto;
          position: relative;
          padding: 0 10px;
          box-sizing: border-box;
        }
        .menuNode{
            position: relative;
            display: inline-block;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            font-weight:bold;
            text-align: center;
            text-align: center;
            min-width: 130px;
            color: #fff;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            padding: 0 8px;
            cursor: pointer;
            &.active{
                background: #2E86C2;
            }
        }
    }
}
</style>
