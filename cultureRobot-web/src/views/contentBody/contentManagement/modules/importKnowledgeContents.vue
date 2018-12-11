<!--
    by: ruizhesun 2018年08月31日
    name: 导入知识库模版
    notes:
-->
<template>
<div class="importKnowledgeContents">
    <el-dialog title="导入成功" :visible.sync="onSuccessDialog" :modal="true" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"  width="30%">
      <span><div class="dialogText">1.点击下载模板，生成知识库模板</div><div class="dialogText">2.点击前往知识库，导入模板</div><div>
      </div></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadButtonClick">下载模版</el-button>
        <el-button type="primary" @click="redirectButtonClick" :disabled="disableButton">前往知识库</el-button>
      </span>
    </el-dialog>
  <errorMessage :errorMessage="returnMessage" :importFailureDialog="showDialog" @dialogClose="showDialog=false"></errorMessage>
  <div class="reminder">
    <p>1、页面的展示若包含图片、视频资源，需要下载该模板按照如下规则导入；若无图片、视频内容，直接到知识管理模块导入问答内容；</p>
    <p>2、模板中标星*为必填项；</p>
    <p>3、目录层级从下拉框选择，如导入的模块选择百科知道，经后台处理目录变为专业知识库／国图少儿馆／百科知道； </p>
    <p>4、与标准问句式重复，去重导入；</p>
    <p>5、总条数不得超过1000行，超过分开多个文件；</p>
    <p>6、图片和视频资源在资源管理模块录入，本表格中填写的视频、图片名称必须与资源管理模块录入的图片、视频资源名称一致；</p>
    <p>7、导入后自动生成知识库格式的新表格后，在知识管理模块上传新表格，完成问答与图片、视频的关联；</p>

  </div>
  <div class="fileUpload">
    <div class="fileIconWrapper"></div>
    <div class="modulesSelection">
      <span class="selectionTitle">模版:</span>
      <el-select v-model="value" @change="getLabel" placeholder="请选择">
        <el-option v-for="item in modules" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- 这里要写action -->
    <el-upload class="upload" :action="uploadUrl()" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :show-file-list="false" :on-progress="showLoading" v-loading="uploadLoading" accept=".xls,.xlsx">
      <el-button size="medium" type="primary">选择导入文件</el-button>
    </el-upload>
    <div class="downloadTemplate">
      <a class="downloadButt" download="" :href="downloadUrl">下载导入模版</a>
      <a class="modelA" href="" download="" :href="modelDownloadUrl"></a>
    </div>
  </div>
  <div class="templatePreview">
    <div class="title">
      以下为模版内容预览
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :header-cell-class-name="addEssential" border stripe>
      <el-table-column prop="catalogue" label="目录" width="213">
        <template slot-scope="scope">
          {{scope.row.catalogue}}{{currentModule}}
        </template>
      </el-table-column>
      <el-table-column prop="knowledgeName" label="知识名称" width="213">
      </el-table-column>
      <el-table-column prop="standardQuestion" label="标准问" width="213">
      </el-table-column>
      <el-table-column prop="standardAnswer" label="标准答案" width="213">
      </el-table-column>
      <el-table-column prop="imageName" label="图片名称" width="213">
      </el-table-column>
      <el-table-column prop="videoTitle" label="视频名称">
      </el-table-column>


    </el-table>


  </div>
</div>
</template>
<script>
import contentUrl from "@/libs/interface/contentManagement/contentManagement.js"
import errorMessage from "./importError.vue"
import context from "@/libs/interface/context.js";
export default {
  components:{
    errorMessage
  },
  props: {
    modules: {
      type: Array,
      default: [],
    }
  },
  mounted() {
    this.downloadUrl = contentUrl.getKnowledgeTemplateUrl
  },

  methods: {
    //给表格标题加上星号

    beforeUpload() {
      if (!this.value) {
        this.$alert('请选择模块', '提示信息', {
          confirmButtonText: '确定',
        });
        return false;
      }
      this.warningMessage = ""
      return;
    },
    uploadUrl() {
      return contentUrl.uploadKnowledgeContentUrl + this.value
    },
    addEssential(info) {
      if (info.columnIndex < 4) {
        return 'essential'
      } else {
        return ""
      }
    },
    getLabel(vId) {
      let obj = {};
      obj = this.modules.find((item) => { //这里的userList就是上面遍历的数据源
        return item.id === vId; //筛选出匹配数据
      });
      this.currentModule = obj.name;
    },
    onSuccess(response, file, fileList) {
        this.uploadLoading=false
      if (response.status == "error") {
        this.returnMessage = response.message
        this.showDialog = true
      }
      else if(response.status == "success"){

        this.response = response;
        this.onSuccessDialog=true;
      }
    },
    onError() {

    },
    showLoading(){
      this.uploadLoading=true
    },

    handleOnClick() {
      this.$parent.loadingFlag = true
      this.$ajax.get(contentUrl.getKnowledgeTemplateUrl, {
        params: {}
      }).then((res) => {
        let data = this.$ajaxCheck(res)
        if (!data) return
      }).catch(err => {
        this.$ajaxError(err)
      }).finally(ok => {
        this.$parent.loadingFlag = false
      })
    },
    downloadButtonClick(){
      this.disableButton = false;
      this.modelDownloadUrl = this.context.host+this.response.data.url;
      this.$nextTick(tick=>{
          this.$el.querySelector('.modelA').click();

      });

    },
    redirectButtonClick(){

      window.open('https://aiui.xfyun.cn/myRepository/index.html');

    }

  },
  data() {
    return {
        context:context,
      tableData: [{
        catalogue: "专业知识库/国家图书馆/",
        knowledgeName: "十万个为什么",
        standardQuestion: "地球是圆的吗",
        standardAnswer: "当然是圆的",
        imageName: " 地球是圆的吗.png",
        videoTitle: " 地球是圆的吗.avi",
      }],
      uploadSuccessFile:[],
      value: '',
      currentModule: '',
      returnMessage: '',
      warningMessage: '',
      downloadUrl: '',
      modelDownloadUrl:'',
      showDialog: false,
      uploadLoading:false,
      onSuccessDialog: false,
      response:'',
      disableButton:true

    }
  }

}
</script>
<style lang="less" scoped>
.importKnowledgeContents {
    padding: 0 24px 24px;
    .downloadButt {
        text-decoration: none;
    }
    .downloadTemplate {
        margin-top: 10px;
    }
    .reminder {
        position: relative;
        width: 100%;
        border: solid 1px rgba(0, 144, 255, 1);
        border-radius: 5px;
        font-family: 'Microsoft YaHei UI';
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
        color: #0090FF;
        text-align: left;
        padding: 10px 30px;
        background-repeat: no-repeat;
        background-image: url("~@/libs/images/contentBody/contentManagement/warningIcon.png");
        background-position: 0.6% 6%;
        background-color: rgba(222, 241, 255, 1);
    }
    .fileUpload {
        padding: 32px 0;
    }
    .fileIconWrapper {
        height: 120px;
        width: 120px;
        border: solid 1px rgba(224, 227, 233, 1);
        border-radius: 3px;
        margin: 0 auto;
        background: url("~@/libs/images/contentBody/contentManagement/fileIcon.png") no-repeat 50% 50%;
        margin-bottom: 25px;
    }
    .upload {
        text-align: center;
    }
    .templatePreview {
        border-top: solid 1px rgba(224, 227, 233, 1);
        padding: 24px 0;
        .title {
            margin-bottom: 24px;
            font-family: 'Microsoft YaHei UI';
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
            color: #A6A4A6;
            line-height: 18px;
        }
    }

}
</style>
<style lang="less">
.modelA{
    display: none;
}
.fileUpload {
    .el-button--medium {
        width: 140px;
        height: 32px;
        padding: 0;
    }
    .downloadTemplate {
        width: 90px;
        margin: 0 auto;
    }
}
.essential {
    &:before {
        content: "*";
        position: absolute;
        left: 6px;
        color: red;
        height: 5px;
        width: 5px;
    }
}
.importKnowledgeContents {
    th {
        color: black;
        height: 42px;
        .cell {
            margin-left: 4px;
        }
    }
    td {
        background-color: #e4e6e8;
        height: 42px;
    }
}
.modulesSelection {
    .el-input__inner {
        height: 32px;
        line-height: 32px;
    }
    .el-input__icon {
        line-height: 32px;
    }
}
</style>
<style lang="less" scoped>
.modulesSelection {
    width: 480px;
    text-align: center;
    margin: 0 auto 16px;
    .selectionTitle {
        margin-right: 10px;
        &:before {
            content: "*";
            color: red;
            height: 5px;
            width: 5px;
        }
    }
}
</style>
