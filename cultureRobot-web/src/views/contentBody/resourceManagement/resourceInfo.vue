<!--
    by: ssfei  2018/8/27
    name: 资源管理列表页
    notes:
-->
<template>
    <div class="resourceInfo" >
        <div class="searchView">
            <el-form :model="searchData" ref="searchData" label-width="100px" class="demo-ruleForm" label-position="top">
                <el-form-item label="资源名称：" prop="name">
                    <el-input v-model="searchData.resourceName" placeholder="请输入资源名称"></el-input>
                </el-form-item>
                <el-form-item label="模块：" prop="resourceType">
                    <el-select v-model="searchData.resourceType" placeholder="全部">
                        <el-option
                            v-for="item in searchDataModel"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间区段：" prop="model">
                    <el-date-picker 
                    type="datetimerange" 
                    v-model="timeValue" 
                    range-separator="至" 
                    start-placeholder="开始日期" 
                    end-placeholder="结束日期"
                    @change="onDateChange">
                    </el-date-picker>
                </el-form-item>
                <el-button class="searchBtn" @click="search">搜索</el-button>
            </el-form>
            
        </div>
        <div class="buttonsBar">
            <el-button icon="el-icon-circle-close" size="mini" class="deleteBtn" @click="delAll">删除</el-button>
            <el-button icon="el-icon-circle-plus" size="mini" @click="add" class="addBtn">新增</el-button>
            <el-button type="primary" size="mini" @click="leadIn">导入</el-button>
        </div>
        <!-- 列表 -->
        <div class="tableBox">
            <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" 
            @selection-change = 'selectChange' class="table" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.1)">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" label=" " width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="资源ID" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="resourceType" label="模块名称" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="resourceName" label="资源名称" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span class="handle" @click="edit(scope.row)">&nbsp;&nbsp;编辑&nbsp;&nbsp;|</span>
                        <span class="handle" @click="handelDel(scope.row)">&nbsp;&nbsp;删除&nbsp;&nbsp;|</span>
                        <span class="handle" @click="preview(scope.row)">&nbsp;&nbsp;预览&nbsp;&nbsp;</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pageBox"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20,50,100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                v-show='pageBox'>
            </el-pagination>
        </div>
       
        <!-- 导入弹框 -->
        <el-dialog title="导入资源" :visible.sync="leadInModel" width="610px" :close-on-click-modal="false" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.1)">
            <div class="tipBox">
                <i class="el-icon-warning"></i>
                <span>1、以压缩包形式批量导入资源</span>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、资源为图片或视频，图片为png/jpg格式(每个图片小于2M),视频为avi/mp4格式(每个视频小于100M)</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、每次批量导入必须是某一个模块的资源</p>
            </div>
                <el-form :model="importData" :rules="rules" ref="importData" label-width="200px" class="demo-ruleForm">
                    <el-form-item label="模块：" prop="modelId">
                        <el-select v-model="importData.modelId" placeholder="请选择">
                            <el-option
                                v-for="item in modelList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            <div class="importBox">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="url.batchImportUrl"
                    name="file"
                    accept=".zip"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :multiple='false'
                    :http-request='submitUpload'
                    :on-change='changeFile'
                    :auto-upload='false'
                    :file-list='fileList'
                    >
                    <el-button type="primary" class="primary">导入文件</el-button>
                    <span slot="tip" class="el-upload__tip" style="margin-left:10px;" v-if="this.fileName == ''">文件名称</span> 
                    <span slot="tip" class="el-upload__tip" style="margin-left:10px;" v-if="this.fileName != ''">{{fileName}}</span>
                </el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmImport('importData')">确 定</el-button>
                <el-button @click="cancelImport">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹框 -->
        <el-dialog title="编辑资源" :visible.sync="editVisible" width="610px" :close-on-click-modal="false">
            <el-form :model="editData" :rules="editDataRules" ref="editData" label-width="120px" class="demo-ruleForm">
                <el-form-item label="模块：" prop="resourceType">
                    <el-select v-model="editData.resourceType" placeholder="请选择" style="width:350px;">
                        <el-option
                            v-for="item in modelList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源名称：" prop="editName">
                    <el-input v-model="editData.editName" style="width:350px;"></el-input>
                    <span>{{fileNameType}}</span>
                    
                </el-form-item>
                <el-form-item label="描述：" prop="description">
                    <el-input type="textarea" v-model="editData.description" :rows="4" style="width:350px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel('editData')">取 消</el-button>
                <el-button type="primary" @click="editSave('editData')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 预览弹框 -->
        <el-dialog :visible.sync="previewVisible" width="610px" :close-on-click-modal="false" @close="closePreview">
            <div class='infoPreview' style="min-height:400px;">
                <img :src="imageUrl" v-if="this.fileType == 'jpg'|| this.fileType == 'png'|| this.fileType === 'JPG'|| this.fileType === 'PNG'|| this.fileType === 'jpeg' || this.fileType === 'JPEG'" style="width:100%;height:100%">
                <video :src="videoUrl" controls="controls" height="430" width='100%' v-if="this.fileType == 'mp4'|| this.fileType == 'avi' || this.fileType == 'MP4'|| this.fileType == 'AVI'"></video>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import url from "../../../libs/interface/resourceManagement/resourceManagement.js";
import context from "@/libs/interface/context.js";
export default {
    name:'resourceInfo',
    data(){
        var validateName = (rule,value,callback)=>{
            // var len = 0; //字符长度，汉字占有2个字节，英文占有1个字节
            var value = this.editData.editName;
            // for (var i = 0; i < value.length; i++) {
            //     if (value.substr(i, 1).match(/[^\x00-\xff]/ig)) {
            //         len += 2;
            //     } else {
            //         len += 1;
            //     }
            // }
            if (value.length > 40) {
                return callback(new Error('最多输入40个字符'));
            } else if(!value.length){
                return callback("该项为必填项");
            } else {
                return callback();
            }
        };
        return{
            previewVisible:false,//预览弹框
            editVisible:false,//编辑弹框
            leadInModel:false,//导入弹框
            loading:false,
            timeValue:'',//选中的时间
            searchData:{
                resourceName:'',
                resourceType:'',
                startCreateTime:'',
                endCreateTime:'',
            },
            editData:{
                resourceType:'',
                description:'',
                resourceName:'',
                editName:'',
            },
            fileNameType:'',//编辑返显资源名称后缀名
            searchDataModel:[{id:'',name: '全部'},],
            modelList:[],
            tableData:[],
            page:1,
            pageSize: 20,
            sizeOpt:[20,50,100],
            totalCount:0,
            totalPage:0,
            selectIds:[],//删除的id
            selectList:[],//选中的数据
            importData:{
                modelId:'',
            },
            files:null,
            pageBox:false,
            fileName:"",
            fileObject:null,
            formList:{},
            fileList:[],
            editId:'',//编辑的id
            editDataRules:{
                resourceType:[
                    { required: true, message: '该项为必填项', trigger: 'change' },
                ],
                editName:[
                    { required: true, validator: validateName , trigger: 'blur'}
                ]
            },
            rules:{
                modelId:[
                    { required: true, message: '该项为必填项', trigger: 'change' },
                ],
            },
            imageUrl:'',//图片Url
            videoUrl:'',//视频url
            fileType:'',//文件后缀名
            // staticurl:'http://47.94.153.115/',
            isUpload:false,
        }
    },
    mounted() {
        this.getModelList();
        this.dataList();
        this.onWindowResize();
    },
    methods:{
        onWindowResize(){
            var clientHeight=window.document.documentElement.clientHeight;
            var tableBox = this.$el.querySelector('.tableBox');
            var tableBoxTop=tableBox.offsetTop;
            var table = this.$el.querySelector('.table');
            tableBox.style.minHeight = (clientHeight-tableBoxTop-20)+'px';
            table.style.minHeight = (clientHeight-tableBoxTop-86)+'px';
        },
        //查询所有模板下拉
        getModelList(){
            this.$ajax.get(url.queryForListUrl).then(res => {
            let data = this.$ajaxCheck(res);
            
            if (data && data.dataList && data.dataList instanceof Array && data.dataList.length) {
                 this.modelList = data.dataList
                 this.searchDataModel = this.searchDataModel.concat(data.dataList);
            }
            })
            .catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
            });
        },
        
        onDateChange(val) {
            if(!val){
                this.searchData.startCreateTime = '';
                this.searchData.endCreateTime='';
            }else{
                this.searchData.startCreateTime = new Date(this.timeValue[0]).format('yyyy-MM-dd hh:mm:ss');
                this.searchData.endCreateTime = new Date(this.timeValue[1]).format('yyyy-MM-dd hh:mm:ss');
            }
        },
        //搜索
        search(){
            this.page = 1;
            this.dataList();
        },
        //table数据列表
        dataList() {
            this.loading = true;
            this.$ajax.get(url.getResourceListUrl,{
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    resourceName:this.searchData.resourceName,
                    resourceType:this.searchData.resourceType,
                    startCreateTime:this.searchData.startCreateTime,
                    endCreateTime:this.searchData.endCreateTime,
                }
            }).then(res => {
                let data = this.$ajaxCheck(res);
                this.loading = false;
                if (!data) return
                if(data){
                    this.tableData = [];
                    if(data.dataList && data.dataList instanceof Array && data.dataList.length != 0){
                        this.pageBox = true;
                        this.tableData = data.dataList;
                    }else{
                        this.pageBox = false;
                    }
                    if(data.pageConfig) {
                        this.totalCount = Number(data.pageConfig.totalCount);
                        this.totalPage = Number(data.pageConfig.totalPage);
                    }
                }
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
        //改变当前页ss
        handleCurrentChange(page){
            this.page = page;
            this.dataList();
        },
        add(){
            this.$emit("updateView","addResource");
        },
        //预览
        preview(row){
            this.previewVisible = true;
            this.getInfo(row.id)
        },
        closePreview(){
            this.imageUrl='';
            this.videoUrl='';
            this.fileType = '';
        },
        //点击编辑
        edit(row){
            this.editId=row.id;
            this.editVisible = true;
            this.getInfo(row.id);
        },
        //获取初始数据
        getInfo(id){
            this.loading = true;
            this.$ajax.get(url.getResourceDetailUrl,{
                params:{
                    resourceId:id
                }
            }).then(res => {
                let data = this.$ajaxCheck(res);
                if (!data) return;
                this.editData = data;
                this.fileType = data.resourceName.substring(data.resourceName.lastIndexOf('.')+1);
                this.fileNameType = data.resourceName.substring(data.resourceName.lastIndexOf('.'));
                this.editData.editName = data.resourceName.substring(0,data.resourceName.lastIndexOf('.'));
                if(this.fileType == 'jpg'|| this.fileType == 'png'|| this.fileType === 'JPG'|| this.fileType === 'PNG'|| this.fileType === 'jpeg' || this.fileType === 'JPEG'){
                    this.imageUrl = context.host + data.resourceUrl
                }else if(this.fileType == 'mp4'|| this.fileType == 'avi'|| this.fileType === 'MP4'|| this.fileType === 'AVI'){
                    this.videoUrl = context.host + data.resourceUrl
                };
                this.fileList=[{name:data.resourceName, url:context.host+data.resourceUrl}]

            })
            .catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
                this.loading = false;
            });
        },
         //编辑保存 
        editSave(editData){
             this.$refs[editData].validate(valid => {
                if(valid){
                    this.editData.resourceName = this.editData.editName+this.fileNameType
                    this.loading = true;
                    this.$ajax.get(url.updateUrl,{
                        params:{
                            id:this.editId,
                            resourceType:this.editData.resourceType,
                            description:this.editData.description,
                            resourceName:this.editData.resourceName
                        }
                    }).then(res => {
                        let data = this.$ajaxCheck(res);
                        if(res.data.status == 'success'){
                            this.editVisible=false;
                            this.dataList();
                        }
                    })
                    .catch(err => {
                        this.$ajaxError(err);
                    })
                    .finally(ok => {
                        this.loading = false;
                    });
                }else{
                    return false
                }
             })
            
        },
        //取消编辑
        editCancel(editData){
            this.editVisible = false;
            this.$refs[editData].resetFields();
        },
         /**
         * 删除操作
         * @param {Object} row 列表每行数据
         * @return {Void} 无
         */
        handelDel(row) {
            this.$confirm('您确定要删除指定模块?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                type: 'warning',
            }).then(() => {
                this.confirmDelect(row.id);
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
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
                });
            }else{
                this.$confirm('您确定要删除指定记录？', '提示信息', {
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
            this.loading = true;
            this.$ajax.get(url.deleteByIdsUrl,{
                params:{
                    ids:selectIds
                }
            }).then(res => {
                let data = this.$ajaxCheck(res);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.loading = false;
                if(res.data.status == 'success'){
                    this.dataList();
                }
            })
            .catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
                this.loading = false;
            });
        },
        //取消删除
        cancelDel(){
            this.delModel = false;
        },
      
        //导入
        leadIn(){
            this.leadInModel = true;
            this.$nextTick(tick=>{
                this.$refs['importData'].resetFields();
                this.importData.modelId = '';
            })
            this.fileName = '';
        },
        changeFile(file,fileList){
            this.fileName = file.name
            if(fileList.length>1){
                this.fileList = [];
                this.fileList.push(fileList[fileList.length-1])
            }
            if(fileList.length!=0){
                this.isUpload = true
            }         
            var type = file.name.substring(file.name.lastIndexOf('.')+1);
            const fileType = type ==='zip'
            if(!fileType){
                this.$message.warning('文件仅支持zip格式!');
            }
            return fileType;   
        },
        beforeUpload(file){
            var formData = new FormData();
            formData.append('files',file);
            formData.append('resourceType',this.importData.modelId);
            this.formList = formData
        },
        submitUpload(param){
        },
        //确定导入文件
        confirmImport(importData){
            this.$refs[importData].validate(valid => {
                if(valid){
                    var _this = this;
                    this.$refs.upload.submit();
                    if(this.isUpload == false){
                        this.$message.warning('请导入文件!');
                    }else if(this.isUpload == true){
                        _this.loading = true;
                        this.$ajax.post(url.batchImportUrl,this.formList,{
                            timeout:300000
                        }).then(res => {
                            let data = this.$ajaxCheck(res);
                            // if (!data) return;
                            if(res.data.status=='success'){
                                this.loading = false;
                                this.leadInModel = false;
                                this.dataList();
                            }
                        })
                        .catch(err => {
                            this.$ajaxError(err);
                        })
                        .finally(ok => {
                            this.loading = false;
                        })
                    }
                   
                }
            }) 

        },
        //取消导入
        cancelImport(){
            this.leadInModel = false;
            this.fileList = [];
            this.fileName = '';
        },

      
    }
}
</script>

<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.resourceInfo{
    margin-top:36px;
}
.el-table .cell .handle{
  color: @themeColor;
  cursor: pointer;
}
body .el-table th.gutter{
  display: table-cell !important;
}
.tableBox{
  margin-top: 8px;
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

.searchView{
    position:relative;
    padding:10px 20px 20px;
    background:#fff;
    font-size: 0;
    .baseBorder();
    margin-bottom:16px;
    .el-form-item{
        margin-bottom:0px;
        min-width: 200px;
        font-size: 14px;
        max-width: 400px;
        display: inline-block;
        margin-right:16px;
        &>label{
            height: 22px;
        }
        .ivu-btn{
            width: 100%;
        }
    }
    .searchBtn{
        width: 160px;
        height: 40px;
        background: @themeColor;
        color: @themeFontColor;
    }
}
.tipBox{
    margin-top: -25px;
    border:1px solid @themeColor;
    border-radius: 5px;
    color:@themeColor;
    font-size: 12px;
    margin-bottom:14px;
    padding: 10px;
}
.el-icon-warning{
    // position:absolute;
    font-size: 20px;
    // top: 15px;
}
.importBox{
    text-align: center;
    margin-top: 20px;
    .el-upload__tip{
        word-wrap:break-word;
    }
}
.el-dialog__body{
    .el-button--primary{
        width: 140px;
        height: 40px;
        background:@themeColor;
    }
}
.el-button--mini{
   font-size:14px;
}

</style>


