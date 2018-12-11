<!--
    by: ssfei  2018/8/27
    name: 资源管理入口
    notes:
-->
<template>
    <div class="resourceManage">
        <component :is="viewName" @updateView="updateView" @rowData="rowData" :editRowData = editRowData></component>
    </div>
</template>
<script>
import resourceInfo from './resourceInfo.vue';
import addResource from './addResource.vue';
import editResource from './editResource.vue';
export default {
    name:'resourceManage',
    data(){
        return{
            viewName:'resourceInfo',
            editRowData:'',
        }
    },
     components:{
        resourceInfo,
        addResource,
        editResource
    },
    created () {
        this.viewName=this.$route.query.viewName?this.$route.query.viewName:this.viewName  
    },
    methods:{
        /**
         * 当前显示的模块
         * @param _val {String}
         */
        updateView(name){
            this.viewName=name
            if(!name){
                this.$routePlugin.delQuery('viewName');
            }else{
                this.$routePlugin.addQuery({viewName:name});
            }
        },
        rowData(data){
            this.editRowData = data;
        },
        
    }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";

    

</style>


