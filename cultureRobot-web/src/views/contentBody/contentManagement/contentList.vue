<!--
  by: ruizhesun 2018/08/28
  name:内容管理页内容列表
-->

<template>
<div class="contentList">
  <div class="searchBar">
    <div class="searchBarItem">
      <div class="searchBarItemTitle">名称:</div>
      <el-input v-model="searchName" placeholder="请输入内容" size="medium"></el-input>
    </div>
    <div class="searchBarItem">
      <div class="searchBarItemTitle">模块:</div>
      <el-select v-model="conditionOne" placeholder="全部" size="medium">
        <el-option v-for="item in optionsOne" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="searchBarItem">
      <div class="searchBarItemTitle">关联知识库:</div>
      <el-select v-model="conditionTwo" placeholder="全部" size="medium">
        <el-option v-for="item in optionsTwo" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="timeInterval">
      <div class="searchBarItemTitle">时间区间:</div>
      <el-date-picker type="datetimerange" v-model="timeIntervalValue" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="onDateChange" size="medium">
      </el-date-picker>
    </div>
    <div class="searchBarButton">
      <el-button type="primary" @click="onSearchButtonClick" size="medium">搜索</el-button>
    </div>
  </div>
  <div class="contentTableWrapper">
    <div class="buttonsBar">
      <el-button icon="el-icon-circle-close" class="deleteBtn" size="mini" @click="onMultipleDelete">删除</el-button>
      <el-dropdown @command="handleCommand">
        <el-button icon="el-icon-circle-plus" class="addBtn" size="mini">新增
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="books">书籍类</el-dropdown-item>
          <el-dropdown-item command="notBooks">非书籍类</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="onClickImport" size="small">导入</el-button>
      <el-dropdown @command="handleExportCommand">
        <el-button type="primary" size="small" >导出</el-button>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item v-for="singleM in exportModules" :command="singleM.id" v-text="singleM.name" :key="singleM.id"></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="tableAndFooter">
      <div class="contentTable" :style="{minHeight:adjustTableHeight()+'px'}" v-loading="tableLoading">
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="onSelectionChange" class="tableList">
          <el-table-column type="selection" width="48">
          </el-table-column>
          <el-table-column label=" " width="48" type="index">
          </el-table-column>
          <el-table-column prop="id" label="内容id" width="200" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="name" label="内容名称" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="moduleName" label="模块名称" width="170" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="关联知识库" width="125" align="center">
            <template slot-scope="scope">
              {{relateToDatabase(scope.row.relate)}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160">
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160">
          </el-table-column>
          <el-table-column class="operation" label="操作" header-align="center">
            <template slot-scope="scope">
        <div class="operationOption">
        <el-button @click="handleClickEdit(scope.row.id,scope.row.relate)" type="text" size="medium">编辑</el-button>
        <div class="buttonSeparator">|</div>
        <el-button type="text" size="medium" @click="onDelete(scope.$index,scope.row.id)">删除</el-button>
        </div>
      </template>
          </el-table-column>
        </el-table>

      </div>
      <div :class="['footerWrapper',totalItem==0?'noItem':'']">
        <el-pagination :current-page.sync="currentPage" :page-sizes="[20,50,100]" layout="total,prev, pager, next, sizes,jumper" :total="totalItem" @current-change="onPageChange" @size-change="onSizeChange">
        </el-pagination>
      </div>

    </div>
  </div>
</div>
</template>
<script>
import contentUrl from "@/libs/interface/contentManagement/contentManagement.js"
export default {

  data() {
    return {
      searchName: '',
      optionsOne: [{
        id: '',
        name: '全部'
      }, ],
      optionsTwo: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '是'
      }, {
        value: '2',
        label: '否'
      }, {
        value: '3',
        label: '不涉及'
      }],
      tableData: [],
      totalItem: 0,
      conditionOne: '',
      conditionTwo: '',
      timeIntervalValue: '',
      currentPage: 1,
      multipleSelection: [],
      pageSize: 20,
      startCreateTime: '',
      endCreateTime: '',
      fullHeight: document.documentElement.clientHeight,
      tableLoading: false,
      exportModules: []

    }
  },
  watch: {
    fullHeight(val) {
      this.adjustTableHeight()
    }
  },
  mounted() {
    this.loadKnowledgeModulesName();
    this.loadList();
    this.loadModulesName();
    const that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        that.fullHeight = window.fullHeight
      })()
    }
  },
  methods: {
    //调整表格大小 表内无内容也要有高度
    adjustTableHeight() {
      if (!this.$el) return
      var listBody = this.$el.querySelector(".contentTable")
      var height = this.fullHeight - listBody.offsetTop - 84
      if (this.$el.querySelector(".tableList")) {
        this.$el.querySelector(".tableList").style.minHeight = height + 'px'
      }
      if (height > 100) {
        return height;
      } else {
        return 100
      }
    },
    //表格内当前页数改变
    onPageChange(page) {
      this.currentPage = page;
      this.loadList();
    },
    //表格内当前显示条数改变
    onSizeChange(size) {
      this.pageSize = size;
      this.loadList();
    },
    //筛选日期改变改变
    onDateChange(val) {
      if (!val) {
        this.startCreateTime = ""
        this.endCreateTime = ""
      } else {
        this.startCreateTime = new Date(this.timeIntervalValue[0]).format('yyyy-MM-dd hh:mm:ss');
        this.endCreateTime = new Date(this.timeIntervalValue[1]).format('yyyy-MM-dd hh:mm:ss');
      }
    },
    //搜索按钮按下
    onSearchButtonClick() {
      this.loadList();
    },
    //跳转导入页面
    onClickImport() {
      this.$emit("changeview", "importButton");
    },
    //导出按钮按下
    handleExportCommand(command) {
      location.href=contentUrl.exportUrl+'/'+command+'.html';
    },
  //是否关联知识库显示
    relateToDatabase(val) {
      if (val == 1) {
        return "是"
      } else if (val == 2) {
        return "否"
      } else {
        return "不涉及"
      }
    },
    //新增下拉框响应事件
    handleCommand(command) {
      if (command == "books") {
        this.$emit("changeview", "addBookRow");

      }
      if (command == "notBooks") {
        this.$emit("changeview", "addKnowledgeRow");
      }
    },
    /**
    编辑时将id以及当前页面地址加入url
    @param {String} id 被编辑的数据的id
    @param {String} relate 1.2非书记 3.书籍
    */

    handleClickEdit(id, relate) {
      if (relate == 1 || relate == 2) {
        this.$emit("changeview", "editKnowledgeRow");
        this.$router.push({
          query: {
            currentView: "editKnowledgeRow",
            id: id
          }
        });
      }
      if (relate == 3) {
        this.$emit("changeview", "editBookRow");
        this.$router.push({
          query: {
            currentView: "editBookRow",
            id: id
          }
        });
      }

    },
    //获取表格数据同时设置表格高度

    loadList() {
      this.tableLoading = true
      this.$ajax.get(contentUrl.queryForPageUrl, {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
          name: this.searchName,
          moduleID: this.conditionOne,
          relate: this.conditionTwo,
          startCreateTime: this.startCreateTime,
          endCreateTime: this.endCreateTime
        }
      }).then((res) => {
        let data = this.$ajaxCheck(res)
        if (!data) return
        this.tableData = []
        if (data.dataList instanceof Array && data.dataList.length) {
          this.tableData = data.dataList;
        }
        if (data.pageConfig) {
          this.totalItem = parseInt(data.pageConfig.totalCount);
        }


      }).catch(err => {
        this.$ajaxError(err)
      }).finally(ok => {
        this.tableLoading = false
      })
    },
    /**
    向后端发出删除请求
    @param {String} deleteId 被删除的数据的id

    */
    deleteItem(deleteID) {

      this.$ajax.get(contentUrl.deleteContentByIdsUrl, {
        params: {
          ids: deleteID
        }
      }).then((res) => {
        let data = this.$ajaxCheck(res)
        if (!data) {
          this.deleteStatus = false;
          return
        }
        this.loadList();

      }).catch(err => {
        this.$ajaxError(err)
      }).finally(ok => {

      })

    },
    //获取模块名称下拉表内容
    loadModulesName() {
      this.$parent.loadingFlag = true
      this.$ajax.get(contentUrl.queryForListUrl, {
        params: {}
      }).then((res) => {
        let data = this.$ajaxCheck(res)
        if (!data) return
        if (data.dataList instanceof Array && data.dataList.length) {
          this.optionsOne = this.optionsOne.concat(data.dataList);
        }

      }).catch(err => {
        this.$ajaxError(err)
      }).finally(ok => {
        this.$parent.loadingFlag = false
        this.loadList();
      })
    },
    //获取知识库名称下拉表内容到导出下拉框
    loadKnowledgeModulesName() {
      this.$ajax.get(contentUrl.queryForListUrl, {
        params: {
          bookTag: 2
        }
      }).then((res) => {
        let data = this.$ajaxCheck(res)
        if (!data) return
        if (data.dataList instanceof Array && data.dataList.length) {
          this.exportModules = data.dataList;
        }


      }).catch(err => {
        this.$ajaxError(err)
      }).finally(ok => {

      })
    },
    /**
    表内单行删除
    @param {String} id 被删除的数据的id
    @param {String} index 被删除的数据的行内index
    */
    onDelete(index, id) {
      this.$confirm('您确定要删除指定记录？', '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.deleteItem(id);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    //监听多选⌚️
    onSelectionChange(val) {
      this.multipleSelection = val;
    },

    //多项删除
    onMultipleDelete() {
      if (!this.multipleSelection.length || !this.multipleSelection) {
        this.$alert('请至少勾选一项', '提示信息', {
          confirmButtonText: '确定',
        });
      } else {
        this.$confirm('您确定要删除指定记录？', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
        }).then(() => {
          let selectedList = [];
          for (var i = 0; i < this.multipleSelection.length; i++) {
            selectedList.push(this.multipleSelection[i].id)
          }
          this.deleteItem(selectedList.join());

          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }

  }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.contentList {
    width: 1326px;
    margin-top: 36px;

    .el-button--small {
        font-size: 14px;
        padding-top: 8px;
    }
    .tableAndFooter {
        .baseBorder();
        border-top: 0;
    }

    .searchBar {
        width: 100%;
        background: #ffffff;
        .baseBorder();
        padding: 16px;
        height: 98px;
        display: inline-block;
        vertical-align: bottom;
        .searchBarItem {
            display: inherit;
            width: 208px;

            margin-right: 8px;
        }
        .searchBarItemTitle {
            white-space: nowrap;
            ont-family: 'Microsoft YaHei UI Bold', 'Microsoft YaHei UI Regular', 'Microsoft YaHei UI';
            font-weight: 700;
            font-style: normal;
            color: #726A73;
            font-size: 14px;
            text-align: left;
            margin-bottom: 5px;
        }
        .timeInterval {
            display: inherit;
            margin-right: 8px;
        }
        .searchBarButton {
            display: inherit;
            width: 128px;
            height: 32px;
            button {
                width: 128px;
            }
        }

    }
    .contentTableWrapper {
        margin-top: 16px;

        .buttonsBar {
            display: inline-block;
            margin-bottom: 8px;
            button {
                width: 73px;
                height: 32px;
                margin-left: 2px;
            }
        }
        .contentTable {
            background: #fff;
            .operationOption {
                text-align: center;
            }
            .buttonSeparator {
                width: 10px;
                height: 14px;
                display: inline-block;
                color: @themeColor;
                padding: 10px 0;
                font-size: 14px;
                line-height: 1;
                white-space: nowrap;
                text-align: center;
                vertical-align: top;

            }
        }

    }
    .footerWrapper {
        boder: solid 1px;
        height: 64px;
        background: #fff;
        padding-top: 16px;
        text-align: center;
        border-top: 0;
        &.noItem {
            display: none;
        }
    }
}
</style>
<style lang="less" >
@import "~@/libs/css/theme/theme.less";

.footerWrapper {
    .pageBox();
}

.contentList {
  .el-table td{
    padding: 8px 0;
  }
    .el-input__icon {
        line-height: 34px;
    }
    .el-message-box__content {
        font-family: 'Microsoft YaHei UI Bold', 'Microsoft YaHei UI Regular', 'Microsoft YaHei UI';
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: #0090FF;
    }
    .el-message-box__header {
        font-family: 'Microsoft YaHei UI Bold', 'Microsoft YaHei UI Regular', 'Microsoft YaHei UI';
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        text-align: left;
        border-bottom: solid 1px #B0B0B0;
    }
    .el-date-editor .el-range__icon {
        margin-bottom: 6px;
    }

    .btn-next {
        padding-left: 0;
    }
    .el-button--text {
        color: @themeColor;
        font-weight: 400;
    }
    .el-table__empty-block {
        border-bottom: 0;
    }

}
</style>
