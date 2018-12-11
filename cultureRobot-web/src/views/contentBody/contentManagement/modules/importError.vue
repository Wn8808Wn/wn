<!--
    by: ruizhesun 2018年08月31日
    name: 导入失败弹框
    notes:
-->
<template>
  <div class="importError">
  <el-dialog
    title="导入失败，修改后重新导入"
    width="488px"
    :show-close="false"
    :modal="true"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="importFailureDialog">
    <span v-html="errorMessage">
      {{errorMessage}}
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogClose">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
export default{
  props:{
    errorMessage:{
      type:String,
      default:""
    },
    importFailureDialog: false,
  },
  methods:{
    dialogClose(){
      this.$emit("dialogClose"," ")
    }
  }
}

</script>
<style lang="less" scoped>
.importError{
  .message{
    height:34px;
    font-size: 14px;
    letter-spacing:1px
  }
  .number{
    color:#0090FF;
    font-weight: bold;
  }
}
</style>
<style lang="less">
.importError{
  .el-dialog__title{
    font-size: 16px;
    font-weight: bold;
  }
  .el-dialog__header{
    padding-left: 20px;
    border-bottom: solid 1px #C9C9C9;
  }
  .el-dialog__body{
    height:140px;
    padding-top: 20px;
    overflow:auto;
    overflow-x: hidden;

  }
}
</style>
