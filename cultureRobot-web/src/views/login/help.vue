<!--
    by: ruizhesun  2018/8/27
    name: 帮助页面
    notes:当帮助页面被关闭时向父组件传递 dialogClose 事件
-->
<template>
<div class="helpPage">
<el-dialog

  width="800px"
  :modal="true"
  :modal-append-to-body="false"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :show-close="false"
  :visible.sync="dialogHelpVisible">
  <h2 slot="title">帮助</h2>
  <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click.stop="onDialogClose"><i class="el-dialog__close el-icon el-icon-close"></i></button>
  <span>

    <div class="helpContent">
      <div class="helpContentLine">
        <div class="seqNumber">1</div>
        <div class="helpContentText">机器人内容管理系统用于知识问答、图片、视频资源的的管理；</div>
      </div>
      <div class="helpContentLine">
        <div class="seqNumber">2</div>
        <div class="helpContentText">若知识问答中不包含图片视频资源，直接进入知识管理模块对知识问答进行管理；</div>
      </div>
      <div class="helpContentLine">
        <div class="seqNumber">3</div>
        <div class="helpContentText">若知识问答中包含图片视频，需要将图片视频上传后，在知识管理模块与图片、视频做匹配， 具体步骤如下：

          <div class="subContext">
            1、在主题、资源、内容管理模块创建完成资源；
          </div>
          <div class="subContext">
            2、在内容模块下载内容导入模板，按照模板填写完成后上传后自动生成知识管理模块中上传知识库格式的模板；
          </div>
          <div class="subContext">
            3、将内容模块下生成的知识库格式的内容上传到知识管理模块，此时完成知识问答和图片、视频资源的关联。
        </div>
        </div>
      </div>
    </div>
    <div class="subTitle">
      机器人内容管理系统
    </div>
    <div class="helpImg"></div>

</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="onDialogClose">关闭</el-button>
  </span>
</el-dialog>


</div>
</template>

<script>

  export default {
    props:{
      dialogHelpVisible:{
        default:false
      }
    },
    methods:{
      onDialogClose(){
        this.$emit("dialogClose","")
      }
    }
  }

</script>

<style lang="less" scoped>

    .helpContent {
        padding: 10px;
        .seqNumber {
            display: inline-block;
            height: 18px;
            width: 18px;
            border-radius: 18px;
            background-color: #1594FB;
            color: #fff;
            line-height: 18px;
            text-align: center;
            vertical-align: top;
        }
        .helpContentLine {
            margin-bottom: 17px;
            .subContext{
              margin-top: 8px;
            }
        }
        .helpContentText {
            display: inline-block;
            margin-left: 10px;
            font-size: 14px;
            font-family: PingFang SC;
        }
    }
    .subTitle{
      margin:0 20px 20px 20px;
      height:14px;
      line-height: 14px;
      text-align:center;
      font-size: 14px;
      font-weight:bold;
      font-family: PingFang SC;

    }
    .helpImg{
      width:695px;
      height:507px;
      border: solid 1px #CCCCCC;
      margin: 0 auto;
      background-size:593px 420px;
      background-repeat: no-repeat;
      background-image: url("~@/libs/images/login/helpImg.png");
      background-position: center;

    }

</style>
<style lang="less">
.helpPage{
  .el-dialog__header{
      border-bottom: solid 1px #CCCCCC;
  }
  .el-dialog{
    width: 800px !important;
  }
}
</style>
