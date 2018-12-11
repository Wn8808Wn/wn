<!--
    by: ruizhesun 2018年08月31日
    name: 切换当前页面
    notes:
-->
<template>
  <div class="">
    <component
    v-bind:is="currentView"
    @changeview="changeViewFun"
    ></component>
  </div>

</template>
<script>
import contentList from "./contentList.vue"
import addContent from "./uploadContents.vue"
import editKnowledgeRow from "./addKnowledgePoint.vue"
import editBookRow from "./addBookContent.vue"

export default{
  data(){
    return{
      currentView:'contentList'
    }
  },
  components:{
    contentList,
    addContent,
    editKnowledgeRow,
    editBookRow
  },
  created () {
      this.currentView=this.$route.query.currentView?this.$route.query.currentView:this.currentView;
  },
  methods:{
    //切换页面
    changeViewFun(val){
      if(val=="importButton"){
        this.$routePlugin.addQuery({currentView:"addContent"})
        this.currentView="addContent"
      }
      if(val=="backButton"){
        this.$routePlugin.delQuery('id');
        this.$routePlugin.addQuery({currentView:"contentList"})
        this.currentView="contentList"
      }
      if(val=="addKnowledgeRow"||val=="editKnowledgeRow"){
        this.$routePlugin.addQuery({currentView:"editKnowledgeRow"})
        this.currentView="editKnowledgeRow"
      }

      if(val=="addBookRow"||val=="editBookRow"){
          this.$routePlugin.addQuery({currentView:"editBookRow"})
          this.currentView="editBookRow"
      }

    }
  }
}

</script>
<style lang=less scoped></style>
