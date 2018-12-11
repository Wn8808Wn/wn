<!--
    by: ssfei  2018/8/30
    name: 编辑资源管理
    notes:
-->
<template>
    <!-- 编辑 -->
    <div class="EditResource">
        <div class="breadcrumbArea">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>资源管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑资源</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="back" @click="back">返回</div>
        </div>
        <div class="info">
            <div class="baseInfo">
                <div class="title">基本信息</div>
                <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="模块：" prop="resourceType">
                        <el-select v-model="infoForm.resourceType" placeholder="请选择">
                            <el-option
                                v-for="item in modelList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源名称：" prop="description">
                        <el-input type="text" v-model="infoForm.resourceName"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input type="textarea" v-model="infoForm.description" :rows="4"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="imgInfo">
                <div class="title">上传资源</div>
                <div class="infoList">
                   <el-upload
                        class="upload-demo"
                        action=""
                        v-model="infoForm.files"
                        :file-list='fileList'
                        :show-file-list="true"
                        :multiple='true'
                        
                        >
                        <!-- <el-button icon="el-icon-circle-plus" class="addBtn">添加视频或图片</el-button>
                        <span slot="tip" class="el-upload__tip" style="margin-left:10px;">图片支持png、jpg格式,视频支持avi、mp4格式(每个视频小于100M)</span> -->
                    </el-upload>
                    <!-- <div class="noData" style="margin-top:13px;" v-if="">上传资源列表区</div> -->
                </div>
                <div class="infoPreview">
                    <img :src="image" v-if="this.fileType == 'jpg'|| this.fileType == 'png'">
                    <video :src="video" controls="controls" height="450" width='100%' v-if="this.fileType == 'mp4'|| this.fileType == 'avi'"></video>
                </div>
            </div>
            <div class="btnBox">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button style="background:#fff;color:#000;">取消</el-button>
            </div>
        </div> 
    </div>
</template>
<script>
import url from "../../../libs/interface/resourceManagement/resourceManagement.js";
export default {
    name:'EditResource',
    props:{
        editRowData:{
            editRowData:Object,
            default:{}
        }
    },
    data(){
        return{
            infoForm:{
                resourceType:'',
                description:'',
                resourceName:'',
            },
            fileType:'',
            staticurl:'http://47.94.153.115/',
            modelList:[],
            resourceList:[],
            fileList:[],
            images:[],
            video:[],
            rules:{
                resourceType:[
                    { required: true, message: '该项为必填项', trigger: 'change' },
                ]
            }
        }
    },
    mounted(){
        this.getModelList();//查询所有模板下拉
        this.getInfo();
    },
    methods:{
         //返回
        back(){
             this.$emit("updateView","resourceInfo");
        },
        //获取初始数据
        getInfo(){
            this.$ajax.get(url.getResourceDetailUrl,{
                params:{
                    resourceId:this.editRowData.id
                }
            }).then(res => {
            let data = this.$ajaxCheck(res);
            if (!data) return;
                this.infoForm = data;
                this.fileType = data.resourceName.substring(data.resourceName.lastIndexOf('.')+1);
                if(this.fileType == 'jpg'|| this.fileType == 'png'){
                    this.image = this.staticurl + data.resourceUrl
                }else if(this.fileType == 'mp4'|| this.fileType == 'avi'){
                    this.video = this.staticurl + data.resourceUrl
                };
                this.fileList=[{name:data.resourceName, url:this.staticurl+data.resourceUrl}]
            })
            .catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
                this.fullscreenLoading = false;
            });
        },
        //查询所有模板下拉
        getModelList(){
            this.$ajax.get(url.queryForListUrl).then(res => {
            let data = this.$ajaxCheck(res);
            if (!data) return;
            this.modelList = data.dataList;
            })
            .catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
                this.fullscreenLoading = false;
            });
        },
        //编辑保存 
        save(){
            this.$ajax.get(url.updateUrl,{
                params:{
                    id:this.editRowData.id,
                    resourceType:this.infoForm.resourceType,
                    description:this.infoForm.description,
                    resourceName:this.infoForm.resourceName
                }
            }).then(res => {
                let data = this.$ajaxCheck(res);
                // if (!data) return;
                if(res.data.status == 'success'){
                    this.$emit("updateView","resourceInfo");
                }
            })
            .catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
                this.fullscreenLoading = false;
            });
        },
        remove(file){
            return false
        }
        
    }
    
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.EditResource{
    margin-top: 15px;
    .breadcrumbArea{
        position: relative;
        .back{
            position: absolute;
            width:100px;
            height: 24px;
            background: @themeColor;
            color:@themeFontColor;
            top: 6px;
            right:0px;
            line-height: 24px;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;
        }
    }
    .info{
        .baseInfo{
            padding: 24px 24px;
            background: #fff;
            .baseBorder();
        }
        .title{
            font-size: 16px;
            font-weight: bold;
            padding-bottom:24px;
        }
        .el-select{
            width: 350px;
        }
        .el-textarea{
            width:60%;
        }
        .el-input{
            width:350px;
        }
        .imgInfo{
            padding: 24px 24px;
            height: 620px;
            background: #fff;
            .baseBorder();
            margin-top: 16px;
            .infoList{
                width: 48%;
                margin-right: 1%;
                float: left;
                overflow: hidden;
                .addBtn{
                    width: 210px;
                    height: 40px;
                    color: #2DB7F5;
                }
                .el-upload-list--text{
                    height: 450px;
                    .baseBorder();
                }
            }
            .infoPreview{
                width: 49%;
                height: 450px;
                float: right;
                margin-top: 50px;
                img{
                    width:100%;
                    height: 100%;
                }
            }
        }
        .noData{
            text-align: center;
            line-height: 450px;
            .baseBorder();
        }
        .el-carousel{
            .baseBorder();
            height: 400px;
        }
       
        // .el-upload-list{
        //     height: 450px;
        //     .baseBorder();
        // }
        .btnBox{
            margin-top: 16px;
            .el-button{
                width: 160px;
                height: 44px;
                background: @themeColor;
            }
        }
       
    } 
   
   
}


    

</style>



