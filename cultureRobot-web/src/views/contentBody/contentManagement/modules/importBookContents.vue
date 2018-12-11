<!--
    by: ruizhesun 2018年08月31日
    name: 导入书籍
    notes:
-->
<template>
<div class="importBookContents">



  <errorMessage :errorMessage="returnMessage" :importFailureDialog="showDialog" @dialogClose="showDialog=false"></errorMessage>
  <div class="reminder">
    <p>1、创建内容的批量导入仅限于书籍查询模块；</p>
    <p>2、模板中标星*为必填项；</p>
    <p>3、总条数不得超过1000行，超过分开多个文件；</p>
    <p>4、封面照片名称需要与资源管理上传的图片名称一致；</p>
  </div>
  <div class="fileUpload">
    <div class="fileIconWrapper"></div>
    <div class="modulesSelection">
      <span class="selectionTitle">模版:</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in modules" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- 这里要写action -->
    <el-upload class="upload" :action="uploadUrl()" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :show-file-list="false" :on-progress="showLoading" v-loading="uploadLoading" accept=".xls,.xlsx">
      <el-button size="medium" type="primary">选择导入文件</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <div class="downloadTemplate">
      <a class="downloadButt" download="" :href="downloadUrl">下载导入模版</a>
    </div>

  </div>

  <div class="templatePreview">
    <div class="title">
      以下为模版内容预览
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :header-cell-class-name="addEssential" border stripe>
      <el-table-column prop="bookTitle" label="书籍名称" width="96">
      </el-table-column>
      <el-table-column prop="author" label="作者" width="74">
      </el-table-column>
      <el-table-column prop="publishedYear" label="出版年" width="85">
      </el-table-column>
      <el-table-column prop="publisher" label="出版社" width="103">
      </el-table-column>
      <el-table-column prop="targetAge" label="适读年龄" width="88">
      </el-table-column>
      <el-table-column prop="category" label="所属类别" width="106">
      </el-table-column>
      <el-table-column prop="abstract" label="内容简介" width="126">
      </el-table-column>
      <el-table-column prop="authorIntro" label="作者简介" width="126">
      </el-table-column>
      <el-table-column prop="isbn" label="ISBN" width="123">
      </el-table-column>
      <el-table-column prop="cover" label="封面照片" width="117">
      </el-table-column>
      <el-table-column prop="id" label="分类号" width="80">
      </el-table-column>
      <el-table-column prop="position" label="位置">
      </el-table-column>

    </el-table>


  </div>
</div>
</template>
<script>
import contentUrl from "@/libs/interface/contentManagement/contentManagement.js"
import errorMessage from "./importError.vue"
export default {
  components: {
    errorMessage
  },
  props: {
    modules: {
      type: Array,
      default: [],
    }
  },
  mounted() {
    this.downloadUrl = contentUrl.getBookTemplateUrl;
  },
  methods: {
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

      return contentUrl.uploadBookContentUrl + this.value
    },
    onSuccess(response, file, fileList) {
      this.uploadLoading = false
      if (response.status == "error") {
        this.returnMessage = response.message
        this.showDialog = true
      } else if (response.status == "success") {
        this.$message({
          type: 'success',
          message: '导入成功!'
        });
      }

    },
    onError() {

    },
    showLoading() {
      this.uploadLoading = true
    },

    addEssential(info) {
      if (info.columnIndex < 9) {
        return 'essential'
      } else {
        return ""
      }
    },
  },
  data() {
    return {
      tableData: [{
        bookTitle: "骆驼祥子",
        author: "老舍",
        publishedYear: "2001年",
        publisher: "人民出版社",
        targetAge: "5-10岁",
        category: "人文",
        abstract: "内容简介",
        authorIntro: "作者简介",
        cover: "图片名称",
        isbn: "9787533678142",
        id: "Z2",
        position: "少儿图书馆2层"

      }],
      value: '',
      returnMessage: '',
      warningMessage: '',
      downloadUrl: '',
      showDialog: false,
      uploadLoading: false,


    }
  }

}
</script>
<style lang="less" scoped>
.importBookContents {
    padding: 0 24px 24px;
    .dialogText{
      height: 32px;
      line-height: 32px;
    }
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
        background-position: 0.6% 10%;
        background-color: rgba(222, 241, 255, 1);
    }
    .warningMessage {
        text-align: center;
        color: red;
        font-size: 10px;
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
.importBookContents {
    th {
        color: black;
        height: 42px;
        .cell {
            margin-left: 2px;
        }
    }
    td {
        background-color: #e4e6e8;
        height: 64px;
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
