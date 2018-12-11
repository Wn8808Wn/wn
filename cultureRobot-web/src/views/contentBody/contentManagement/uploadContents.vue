<!--
    by: ruizhesun 2018年08月31日
    name: 上传选择器
    notes:
-->
<template>
<div class="uploadContents">
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item >资源管理</el-breadcrumb-item>
    <el-breadcrumb-item>新增资源</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" class="backBtn" @click="backButtonOnClick">返回</el-button>
  </div>

  <div class="mainContents">
    <el-tabs v-model="activeName"  type="card">

      <el-tab-pane label="导入非书籍内容" name="first"><importKnowledgeContents :modules="modulesKnowledgeNames"></importKnowledgeContents></el-tab-pane>
      <el-tab-pane label="导入书籍内容" name="second"><importBookContents :modules="modulesBookNames"></importBookContents></el-tab-pane>

    </el-tabs>
  </div>
</div>
</template>
<script>
import importBookContents from './modules/importBookContents.vue'
import importKnowledgeContents from './modules/importKnowledgeContents.vue'
import contentUrl from "@/libs/interface/contentManagement/contentManagement.js"
export default{
  data(){
    return {
        activeName: 'first',
        modulesBookNames:[],
        modulesKnowledgeNames:[],
      };
  },
  mounted(){
    this.loadBookModulesName()
    this.loadKnowledgeModulesName()
  },

    components: {
      importBookContents,
      importKnowledgeContents,
    },
    methods:{
      backButtonOnClick(){
        this.$emit("changeview","backButton")
      },
      loadBookModulesName() {
        this.$parent.loadingFlag = true
        this.$ajax.get(contentUrl.queryForListUrl, {
          params: {bookTag:1}
        }).then((res) => {
          let data = this.$ajaxCheck(res)
          if (!data) return
          this.modulesBookNames = data.dataList;
        }).catch(err => {
          this.$ajaxError(err)
        }).finally(ok => {
          this.$parent.loadingFlag = false
        })
      },
      loadKnowledgeModulesName() {
        this.$parent.loadingFlag = true
        this.$ajax.get(contentUrl.queryForListUrl, {
          params: {bookTag:2}
        }).then((res) => {
          let data = this.$ajaxCheck(res)
          if (!data) return
          this.modulesKnowledgeNames = data.dataList;
        }).catch(err => {
          this.$ajaxError(err)
        }).finally(ok => {
          this.$parent.loadingFlag = false
        })
      },
    }

}
</script>
<style lang="less" scoped>
.header{
  height:36px;
  padding-top:17px;
}
.mainContents{
  background: #fff;
  padding-top: 24px;
}

</style>
<style lang="less">
.uploadContents{
  position: relative;
  .header{
    .el-button--primary{
      float: right;
    }
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item{
    width:300px;
    height:36px;
    text-align: center;
    &.is-active{
      background-color: rgba(21, 148, 251, 1);
      color: #ffffff;
    }
  }
  .el-tabs__header{
    margin: 0 auto 20px;
    width:602px;
  }
}
</style>
