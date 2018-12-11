<!-- 
    by: ssfei  2018/8/27 
    name: 模块管理 
    notes: 
--> 
<template> 
    <div class="moduleManagement"> 
      <div class="buttonsBar"> 
        <el-button icon="el-icon-circle-close" size="mini" class="deleteBtn" @click="delAll">删除</el-button> 
        <el-button icon="el-icon-circle-plus" size="mini" class="addBtn" @click="create">新增</el-button> 
      </div> 
      <!-- 列表 --> 
      <div class="tableBox"> 
        <el-table ref="table" border class="table" :data="tableData" tooltip-effect="dark" style="width: 100%" 
        @selection-change = 'selectChange' v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.2)"> 
          <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column> 
          <el-table-column type="index" label=" " width="55" align="center"></el-table-column> 
          <el-table-column prop="id" label="模块ID" align="center" show-overflow-tooltip></el-table-column> 
          <el-table-column prop="name" label="模块名称" show-overflow-tooltip align="center"></el-table-column> 
          <el-table-column prop="sort" label="排序" show-overflow-tooltip align="center" sortable  width="80"></el-table-column> 
          <el-table-column prop="status" label="模块状态" show-overflow-tooltip align="center" width="100"> 
            <template slot-scope="scope"> 
                <div>{{ scope.row.status | formfort}}</div> 
            </template> 
          </el-table-column> 
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column> 
          <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip align="center"></el-table-column> 
          <el-table-column label="操作" align="center"> 
            <template slot-scope="scope"> 
              <span class="handle" @click="handelShow(scope.row)"> 
                {{scope.row.status==='1'?'隐藏':'显示'}} 
              &nbsp;&nbsp;|</span> 
              <span @click="handelEdit(scope.row)" :class="scope.row.init == '1'?'noDisable':'handle'">&nbsp;&nbsp;编辑&nbsp;&nbsp;</span> 
              <span style="color: #3498DB;">|</span> 
              <span @click="handelDel(scope.row)" :class="scope.row.init == '1' || scope.row.canDel=='0'?'noDisable':'handle'"> &nbsp;&nbsp;删除&nbsp;&nbsp;</span> 
            </template> 
          </el-table-column> 
        </el-table> 
        <el-pagination 
          class="pageBox" 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page ="page" 
          :page-sizes="sizeOpt" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="totalCount" 
          v-show="pageBox"> 
        </el-pagination> 
      </div> 
      <!-- 新增弹框 --> 
      <el-dialog title="创建模块" :visible.sync ="createVisible" width="610px" :close-on-click-modal="false"> 
        <el-form :model="createForm" label-width="120px" :rules="rules" ref="createForm"> 
          <el-form-item label="模块名称：" prop="name"> 
            <el-input v-model="createForm.name" auto-complete="off" placeholder="不多于12个字符(汉字或字母)"></el-input> 
          </el-form-item> 
          <el-form-item label="模块图标：" prop="icon"> 
            <el-upload 
              class="upload-demo" 
              action="/national-lib/upload/file" 
              v-model="createForm.icon" 
              accept=".jpg,.jpeg,.png,.PNG.JPG,.JPEG" 
              :limit="1" 
              :on-exceed="limit" 
              :show-file-list="showList" 
              :file-list="fileList" 
              :before-upload="beforeUpload" 
              :on-remove="delImg" 
              :on-success="UploadSuccess" 
              :on-error="uploadErr" 
              list-type="picture"> 
              <el-button style="width:350px;color:#C0C4CC">点击选择（png/jpg格式，180*160px）</el-button> 
            </el-upload> 
          </el-form-item> 
          <el-form-item label="排序：" prop="sort"> 
            <el-input v-model="createForm.sort" auto-complete="off" placeholder="点击选择（png/jpg格式建议180*160px）"></el-input> 
          </el-form-item> 
          <el-form-item label="显示：" prop="status"> 
            <el-radio v-model="createForm.status" label="1">是</el-radio> 
            <el-radio v-model="createForm.status" label="2">否</el-radio> 
          </el-form-item> 
          <el-form-item label="书籍类别：" prop="bookTag"> 
            <el-radio v-model="createForm.bookTag" label="1">是</el-radio> 
            <el-radio v-model="createForm.bookTag" label="2">否</el-radio> 
          </el-form-item> 
          <el-form-item label="描述：" prop="detail"> 
              <el-input v-model="createForm.detail" auto-complete="off" type="textarea"></el-input> 
          </el-form-item> 
        </el-form> 
        <div slot="footer" class="dialog-footer" > 
          <el-button @click="resetForm('createForm')" style="font-weight:bold">取消</el-button> 
          <el-button type="primary" @click="submitForm('createForm')" style="font-weight:bold">保存</el-button> 
        </div> 
      </el-dialog> 
       <!-- 编辑弹框 --> 
      <el-dialog title="编辑模块" :visible.sync="editVisible" width="610px" :close-on-click-modal="false" > 
        <el-form :model="createForm" label-width="120px" :rules="rules" ref="createForm"> 
          <el-form-item label="模块名称：" prop="name"> 
            <el-input v-model="createForm.name" auto-complete="off" placeholder="不多于12个字符(汉字或字母)"></el-input> 
          </el-form-item> 
          <el-form-item label="模块图标：" prop="icon"> 
             <el-upload 
              class="upload-demo" 
              action="/national-lib/upload/file" 
              v-model="createForm.icon" 
              ref="upload" 
              accept=".jpg,.jpeg,.png,.PNG.JPG,.JPEG" 
              name="file" 
              :limit="1" 
              :on-exceed="limit" 
              :show-file-list="true" 
              :before-upload="beforeUpload" 
              :on-remove="delImg" 
              :on-success="UploadSuccess" 
              :on-error="uploadErr" 
              :file-list="fileList" 
              list-type="picture"> 
              <el-button style="width:350px;color:#C0C4CC">点击选择（png/jpg格式建议180*160px）</el-button> 
            </el-upload> 
          </el-form-item> 
          <el-form-item label="排序：" prop="sort"> 
            <el-input v-model="createForm.sort" auto-complete="off" placeholder="请输入数字"></el-input> 
          </el-form-item> 
          <el-form-item label="显示：" prop="status"> 
            <el-radio v-model="createForm.status" label="1">是</el-radio> 
            <el-radio v-model="createForm.status" label="2">否</el-radio> 
          </el-form-item> 
           <el-form-item label="书籍类别：" prop="bookTag"> 
            <el-radio v-model="createForm.bookTag" label="1" :disabled='isDisabled'>是</el-radio> 
            <el-radio v-model="createForm.bookTag" label="2" :disabled='isDisabled'>否</el-radio> 
          </el-form-item> 
          <el-form-item label="描述：" prop="detail"> 
              <el-input v-model="createForm.detail" auto-complete="off" type="textarea"></el-input> 
          </el-form-item> 
        </el-form> 
        <div slot="footer" class="dialog-footer"> 
          <el-button @click="resetForm('createForm')"  style="font-weight:bold">取消</el-button> 
          <el-button type="primary" @click="submitForm('createForm')"  style="font-weight:bold">保存</el-button> 
        </div> 
      </el-dialog> 
    </div> 
</template> 
 
<script> 
import url from "../../../libs/interface/moduleManagement/moduleManagement.js"; 
import context from "@/libs/interface/context.js";
export default { 
  data() { 
    var numberRule = (rule, value, callback) => { 
      var reg = /^[1-9]{1,}[0-9]?$/g; 
      if (!value) { 
        return callback("该项为必填项"); 
      } else if (!reg.test(value)) { 
        return callback("请输入正整数"); 
      } else { 
        callback(); 
      } 
    }; 
    var validateName = (rule,value,callback)=>{ 
      // var len = 0; //字符长度，汉字占有2个字节，英文占有1个字节 
      // for (var i = 0; i < value.length; i++) { 
      //     if (value.substr(i, 1).match(/[^\x00-\xff]/ig)) { 
      //         len += 2; 
      //     } else { 
      //         len += 1; 
      //     } 
      // } 
      var inputVal=/^[\u0391-\uFFE5A-Za-z]+$/; 
      if(!inputVal.test(value) && value!=''){ 
        return callback(new Error('只能输入字母或汉字')); 
      }else if(value==''){ 
        return callback("该项为必填项"); 
      }else if(value.length > 12){ 
        return callback(new Error('最多输入12个字符')); 
      } 
      else{ 
        return callback(); 
      } 
    }; 
    return { 
      page:1, 
      pageSize: 20, 
      sizeOpt:[20,50,100], 
      totalCount:0, 
      totalPage:0, 
      pageBox:false, 
      fileName:'', 
      selectList:[],//选中的数据 
      rowData:{},//每行数据 
      loading: false, 
      tableData: [], 
      createForm: { 
        id:'', 
        name: "", 
        icon: "", 
        sort:'', 
        status: "1", 
        detail: "", 
        bookTag:"2", 
      }, 
      editForm: {}, 
      rules: { 
        name: [{ required: true, validator: validateName }], 
        sort: [{ required: true, validator: numberRule }], 
        icon: [{ required: true, message: "该项为必填项", trigger: "blur" }], 
        status: [{ required: true, message: "该项为必填项", trigger: "blur" }], 
        bookTag:[{ required: true, message: "该项为必填项", trigger: "blur" }], 
      }, 
      editVisible: false, //编辑弹框 
      createVisible: false, //新建弹框 
      selectIds:[],//选中的id 
      fileList:[], 
      staticurl:'http://47.94.153.115/', 
      showList:false,//是否显示上传图片列表 
      isDisabled:false,//书籍类别是否可编辑
    }; 
  }, 
  mounted() { 
    this.dataList(); 
    this.onWindowResize(); 
  }, 
  filters: { 
    formfort(value){ 
        if(value == '1'){ 
            return value = "显示" 
        }else if(value == '2'){ 
            return value = "隐藏" 
        } 
    } 
  }, 
  methods: { 
    onWindowResize(){ 
        var clientHeight=window.document.documentElement.clientHeight; 
        var tableBox = this.$el.querySelector('.tableBox'); 
        var tableBoxTop=tableBox.offsetTop; 
        var table = this.$el.querySelector('.table'); 
        tableBox.style.minHeight = (clientHeight-tableBoxTop-20)+'px'; 
        table.style.minHeight = (clientHeight-tableBoxTop-86)+'px';
 
    }, 
    //获取列表数据 
    dataList() { 
      this.loading = true; 
      this.$ajax.get(url.queryForPageUrl, { 
          params: { 
            page: this.page, 
            pageSize: this.pageSize 
          } 
        }).then(res => { 
           let data = this.$ajaxCheck(res); 
           if (!data) return; 
           if(data.dataList.length == 0){ 
             this.pageBox = false 
           }else{ 
             this.pageBox = true 
           } 
            this.tableData=[]
            if (data.dataList instanceof Array && data.dataList.length) {
                this.tableData = data.dataList;
            }
          this.loading = false; 
          this.totalCount = Number(data.pageConfig.totalCount) 
          this.totalPage = Number(data.pageConfig.totalPage) 
        }) 
        .catch(err => { 
          this.$ajaxError(err); 
        }) 
        .finally(ok => { 
          this.loading = false; 
        }); 
    }, 
    handleSizeChange(size){ 
      this.pageSize = size; 
      this.dataList(); 
    }, 
    //改变当前页 
    handleCurrentChange(page){ 
      this.page = page; 
      this.dataList(); 
    }, 
    //系统内置模块，不能编辑 
    selectable(row) { 
      if(row.init == "1" || row.canDel == "0"){ 
        return false; 
      }else{ 
        return true; 
      } 
 
    }, 
    //点击新增 
    create() { 
      this.createVisible = true; 
      this.showList = false; 
      this.$nextTick(tick=>{ 
          this.$refs.createForm.resetFields(); 
          this.createForm = { 
            name: "", 
            icon: "", 
            sort:'', 
            status: "1", 
            detail: "", 
            bookTag:"2", 
          }; 
          this.fileList=[]; 
      }) 
 
      // this.$refs.upload.clearFiles(); 
    }, 
     /** 
     * 显示操作 
     * @param {Object} row 列表每行数据 
     * @return {Void} 无 
     */ 
    handelShow(row) { 
      this.rowData = row; 
      if(row.status == '1'){ 
        this.rowData.status = '2' 
        this.$confirm('您确定要隐藏指定模块?', '提示', { 
          confirmButtonText: '确定', 
          cancelButtonText: '取消', 
          closeOnClickModal:false, 
          type: 'warning' 
        }).then(() => { 
          this.confirmHide(); 
        }).catch(() => { 
          this.dataList(); 
          this.$message({ 
            type: 'info', 
            message: '已取消隐藏' 
          }); 
        }); 
      }else if(row.status == '2'){ 
        this.rowData.status = '1' 
        this.confirmHide1(); 
      } 
 
    }, 
    //确认隐藏 
    confirmHide() { 
      this.$ajax.get(url.updateStatusUrl+"/"+this.rowData.id+"/"+this.rowData.status).then(res => { 
        let data = this.$ajaxCheck(res); 
        if(res.data.status == 'success'){ 
          this.dataList(); 
          this.$message({ 
            type: 'success', 
            message: '隐藏成功!' 
          }); 
        } 
      }) 
      .catch(err => { 
        this.$ajaxError(err); 
      }) 
      .finally(ok => { 
 
      }); 
    }, 
     //确认显示 
    confirmHide1() { 
      this.$ajax.get(url.updateStatusUrl+"/"+this.rowData.id+"/"+this.rowData.status).then(res => { 
        let data = this.$ajaxCheck(res); 
        if(res.data.status == 'success'){ 
          this.dataList(); 
          this.$message({ 
            type: 'success', 
            message: '显示成功!' 
          }); 
        } 
      }) 
      .catch(err => { 
        this.$ajaxError(err); 
      }) 
      .finally(ok => { 
 
      }); 
    }, 
    /** 
     * 删除操作 
     * @param {Object} row 列表每行数据 
     * @return {Void} 无 
     */ 
    handelDel(row) { 
      if(row.init=='1'){ 
        this.$message({ 
          message: '内置模块，不可删除', 
          type: 'warning' 
        }); 
      }else if(row.canDel=='0'){
        this.$message({ 
            message: '已关联数据，无法删除', 
            type: 'warning' 
        });
      }else{ 
        this.$confirm('您确定要删除指定模块?', '提示', { 
          confirmButtonText: '确定', 
          cancelButtonText: '取消', 
          closeOnClickModal:false, 
          type: 'warning' 
        }).then(() => { 
          this.confirmDelect(row.id); 
 
        }).catch(() => { 
          this.$message({ 
            type: 'info', 
            message: '已取消删除' 
          }); 
        }); 
      } 
 
    }, 
    //checkBox选择 
    selectChange(val) { 
      var temp = []; 
      this.selectList = val; 
      val.forEach(element => { 
          temp.push(element.id) 
      }); 
      this.selectIds = temp.join(',') 
    }, 
    //清空表格选定状态 
    clearSelection(){ 
      this.$refs.table.clearSelection(); 
      this.selectList = []; 
      this.selectIds = ''; 
    }, 
    //批量删除 
    delAll() { 
      if(this.selectList.length === 0){ 
          this.$alert('请至少勾选一项', '提示信息', { 
            confirmButtonText: '确定', 
            closeOnClickModal:false, 
            type: 'warning' 
        }); 
      }else{ 
        this.$confirm('您确定要删除指定模块？', '提示信息', { 
          confirmButtonText: '确定', 
          cancelButtonText: '取消', 
          closeOnClickModal:false, 
          type: 'warning' 
        }).then(() => { 
          this.confirmDelect(this.selectIds); 
        }).catch(() => { 
          this.clearSelection(); 
          this.$message({ 
            type: 'info', 
            message: '已取消删除' 
          }); 
        }); 
      } 
    }, 
    //确定删除 
    confirmDelect(selectIds){ 
      let ids={ 
        ids:selectIds 
      } 
      this.$ajax.get(url.deleteByIdsUrl,{ 
        params:ids 
      } 
      ).then(res => { 
        let data = this.$ajaxCheck(res); 
        if(res.data.status == 'success'){ 
          this.dataList(); 
          this.$message({ 
              type: 'success', 
              message: '删除成功!' 
          }); 
        } 
      }).catch(err => { 
        this.$ajaxError(err); 
      }).finally(ok => { 
 
      }); 
    }, 
     //编辑操作 
    handelEdit(row) { 
      if(row.init=='1'){ 
        this.$message({ 
          message: '内置模块，不可编辑!', 
          type: 'warning' 
        }); 
      }else{ 
        this.editVisible = true; 
        this.createForm.id = row.id; 
       
        this.getInfo(); 
      } 
 
    }, 
    //编辑查看数据 
    getInfo(){ 
      this.loading = true; 
      this.$ajax.get(url.findByIdUrl+'/'+this.createForm.id).then(res => { 
        let data = this.$ajaxCheck(res); 
        if (!data) return; 
        this.loading = false; 
        this.createForm.name = data.name; 
        this.createForm.icon = data.icon; 
        this.createForm.sort = data.sort; 
        this.createForm.status = data.status; 
        this.createForm.bookTag = data.bookTag; 
        this.createForm.detail = data.detail; 
        this.fileList = [{name:data.fileName,url:context.host+data.icon}];
        if(data.canEdit == '0'){
          this.isDisabled = true
        }
      }) 
      .catch(err => { 
        this.$ajaxError(err); 
      }) 
      .finally(ok => { 
        this.loading = false; 
      }); 
    }, 
    //保存 
    submitForm(createForm) { 
      this.$refs[createForm].validate(valid => { 
        if (valid) { 
          this.loading = true; 
          let para = Object.assign({},this.createForm); 
          // 编辑保存 
          if(para.id){ 
            this.$ajax.get(url.updateUrl,{ 
              params:para 
            }).then(res => { 
              let data = this.$ajaxCheck(res); 
              if (!data) return; 
              this.loading = false; 
              this.editVisible = false; 
              this.dataList(); 
              this.$message({ 
                message: '保存成功！', 
                type: 'success' 
              }); 
              this.$refs['createForm'].resetFields(); 
            }) 
            .catch(err => { 
              this.$ajaxError(err); 
            }) 
            .finally(ok => { 
              this.loading = false; 
            }); 
          }else{ 
            this.$ajax.get(url.addUrl,{ 
              params:para 
            }).then(res => { 
              let data = this.$ajaxCheck(res); 
              if (!data) return; 
              this.loading = false; 
              this.createVisible = false; 
              this.dataList(); 
              this.$message({ 
                message: '保存成功！', 
                type: 'success' 
              }); 
              this.$refs['createForm'].resetFields(); 
            }) 
            .catch(err => { 
              this.$ajaxError(err); 
            }) 
            .finally(ok => { 
              this.loading = false; 
            }); 
          } 
        } else { 
          return false; 
        } 
      }); 
    }, 
    resetForm(name) { 
      this.$refs[name].resetFields(); 
      this.createVisible = false; 
      this.editVisible = false; 
    }, 
 
 
    //限制上传大小 
    beforeUpload(file){ 
      var type = file.name.substring(file.name.lastIndexOf('.')+1); 
      const fileType = type ==='jpg' 
      const fileType2 = type === 'png' 
      const fileType3 = type ==='JPG' 
      const fileType4 = type === 'PNG' 
      const fileType5 = type ==='jpeg' 
      const fileType6 = type === 'JPEG' 
      const limit2M = file.size / 1024 / 1024 < 2; 
      if (!limit2M) { 
        this.$message.warning('上传图片大小不能超过 2MB!'); 
      } 
      if(!fileType&&!fileType2&&!fileType3&&!fileType4&&!fileType5&&!fileType6){ 
        this.$message.warning('模块图标仅支持png/jpg格式!'); 
      } 
      return limit2M && fileType||fileType2||fileType3||fileType4||fileType5||fileType6; 
    }, 
    //限制文件上传个数 
    limit(files,fileList){ 
      if(files.length==1){ 
        this.$message.warning('只允许上传一个图标'); 
      } 
    }, 
    //上传 
    UploadSuccess(res,file) { 
      if(res.status == "success"){ 
        this.createForm.icon = file.response.data.path 
        this.showList = true; 
        this.createForm.fileName = file.response.data.fileName 
      } 
    }, 
    //删除上传图片 
    delImg(file) { 
      this.createForm.icon = ''; 
      this.createForm.fileName = ''; 
    }, 
    //上传失败 
    uploadErr(err,file){ 
    } 
  } 
}; 
</script> 
<style lang="less"> 
@import "~@/libs/css/theme/theme.less"; 
body .el-table th.gutter { 
  display: table-cell !important; 
} 
</style> 
 
<style lang="less" scoped> 
@import "~@/libs/css/theme/theme.less"; 
.moduleManagement{ 
  margin-top:36px; 
} 
.el-table .cell .handle { 
  color: @themeColor; 
  cursor: pointer; 
} 
.el-input, 
.el-textarea { 
  width: 350px; 
} 
.tableBox { 
  margin-top: 8px; 
  background: #fff; 
  .el-pagination{ 
    padding:16px 0px; 
    text-align:center; 
    background:#fff; 
    .baseBorder(-left);
    .baseBorder(-bottom);
    .baseBorder(-right);
    width:100%;
  } 
} 
.el-dialog .el-dialog__header { 
  border-bottom: 1px solid @borderColor !important; 
} 
.upload-demo{ 
  width:350px; 
  .el-upload{ 
    width:350px!important; 
  } 
  .el-upload-list{ 
    width: 350px!important; 
  } 
} 
.noDisable{ 
  color:#CCCCCC; 
  cursor: pointer; 
} 
.el-button--mini{ 
  font-size:14px; 
} 
</style> 