<!--
    by: ssfei  2018/8/29
    name: 新增资源管理
    notes:
-->
<template>
    <!-- 新增 -->
    <div class="addResource" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.2)">
        <div></div>
        <div class="breadcrumbArea">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>资源管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增资源</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="back" @click="back">返回</div>
        </div>
        <div class="info">
            <div class="baseInfo">
                <div class="title">基本信息</div>
                <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="模块：" prop="moduleId">
                        <el-select v-model="infoForm.moduleId" placeholder="请选择">
                            <el-option
                                v-for="item in modelList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input type="textarea" v-model="infoForm.description" :rows="4"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="imgInfo">
                <div class="title">上传资源</div>

                <div class="infoList">
                    <div v-if="btnShow" style="width:100%;">
                        <el-tooltip class="item" effect="dark" content="上传资源大小不能超过 100MB" placement="top" >
                        <el-button style="width: 210px;height: 40px;color: #2db7f5;">
                            <i class="el-icon-circle-plus"></i>
                            添加视频或图片</el-button>
                        </el-tooltip>
                        <span slot="tip" class="el-upload__tip" style="margin-left:10px;">图片支持png、jpg格式（每个图片小于2M）,视频支持avi、mp4格式(每个视频小于100M),资源名称不能超过20个字符</span>
                    </div>
                    <el-upload
                        class="upload-demo"
                        :action='importUrl'
                        ref="upload"
                        :file-list='fileList'
                        name="files"
                        :show-file-list="true"
                        :before-upload="beforeUpload"
                        :on-preview="handlePictureCardPreview"
                        :auto-upload='autoUpload'
                        accept=".jpg,.jpeg,.png,.PNG.JPG,.JPEG,.mp4,.MP4,.AVI,.avi"
                        :on-error="uploadErr"
                        :multiple='true'
                        :on-change='changeFile'
                        :data='uplodeData'
                        :on-remove='romove'
                        :on-success='uploadSuccess'
                        >
                        <el-tooltip class="item" effect="dark" content="上传资源大小不能超过 100MB" placement="top" v-if="uploadShow">
                            <el-button icon="el-icon-circle-plus" class="addBtn">添加视频或图片</el-button>
                        </el-tooltip>
                        <span v-if="uploadShow" slot="tip" class="el-upload__tip" style="margin-left:10px;">图片支持png、jpg格式（每个图片小于2M）,视频支持avi、mp4格式(每个视频小于100M)，资源名称不能超过20个字符</span>
                    </el-upload>
                    <!-- <div class="resourceListBox" v-if="this.fileArr.length != 0">
                        <div v-for="item in fileList" :key="item.uid" :class="[{'active':item.status=='on'},'resourceItem']">
                            <div v-text="item.name"  @click="handlePictureCardPreview(item)"></div>
                            <i class="el-icon-circle-close deleteIcon" @click="close(item)"></i>
                        </div>
                    </div> -->
                    <div class="noData" v-if="fileList.length == 0">上传资源列表区</div>
                </div>
                <div class="infoPreview">
                    <div class="noData" v-if="fileList.length == 0"><span>资源预览区</span></div>
                    <el-carousel :interval="5000" arrow="always" :autoplay="false"
                        indicator-position="none" height="430px" v-if="fileList.length != 0 "
                        ref='carousel' @change = "changeImg">
                        <el-carousel-item v-for="image in images" :key="image">
                            <img :src="image">
                            <!-- <video v-if="item.type == 'mp4'||item.type == 'avi'" :src="item.url" controls="controls" height="450" width="100%"></video> -->
                        </el-carousel-item>
                        <el-carousel-item v-for="video in videos" :key="video">
                            <video :src="video" controls="controls" height="450" width="100%"></video>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <div class="btnBox">
                <el-button type="primary" @click="save('infoForm')" :disabled='isDisabled'>保存</el-button>
                <el-button style="background:#fff;color:#000;" @click="cancel('infoForm')">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import url from "../../../libs/interface/resourceManagement/resourceManagement.js";
export default {
    name:'addResource',
    data(){
        return{
            loading:false,//loading状态
            infoForm:{
                moduleId:'',
                description:'',
            },
            modelList:[],
            fileList:[],
            rules:{
                moduleId:[
                    { required: true, message: '该项为必填项', trigger: 'change' },
                ]
            },
            files:{},
            formData:new FormData(),
            images:[],//图片数组
            videos:[],//视频数组
            formList:{},//选中的资源列表
            uploadShow:true,
            btnShow:false,
            autoUpload:false,
            importUrl:"",
            uplodeData:{},
            isDisabled:false,
            fileName:'',//当前点击的文件名
            fileRepeat:''//重复的文件名
        }
    },
    mounted(){
        this.getModelList();//查询所有模板下拉
        this.importUrl = url.addUrl;
    },
    watch:{
        fileList:{
            handler: function (list){
                var sum = 0;
                for(var i = 0;i<list.length;i++){
                    sum = sum + list[i].size
                }
                let  limit = sum  / 1024 / 1024 < 100;
                if (!limit && list.length!=0) {
                    this.$message.warning('上传资源大小不能超过 100MB!');
                    this.uploadShow = false;
                    this.btnShow=true;
                    this.isDisabled = true;
                }else{
                    this.uploadShow = true;
                    this.btnShow=false;
                    this.isDisabled = false;
                }
            }
        },
    },
    methods:{
        //返回
        back(){
            this.$emit("updateView","resourceInfo");
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

            });
        },
        //选择文件
        changeFile(file,fileList){
            this.fileList = fileList;
            let type = file.name.substring(file.name.lastIndexOf('.')+1);
            this.typeValidate(type,file);//选择文件时验证文件
        },
        //选择文件，验证大小及格式
        typeValidate(type,file){
            const limit2M = file.size / 1024 / 1024 < 2;
            const limit100M = file.size / 1024 / 1024 < 100;
            if (!limit2M && (type === 'jpg' || type === 'png' || type === 'JPG'|| type === 'PNG'|| type === 'jpeg' || type === 'JPEG')) {
                this.$message.warning('每张图片大小不能超过 2MB!已为您自动过滤超过2M的图片');
                this.fileList.forEach((item,index)=>{
                    if(item.uid == file.uid){
                        this.fileList.splice(index,1);
                    }
                })
            }else if(limit2M && (type === 'jpg' || type === 'png' || type === 'JPG'|| type === 'PNG'|| type === 'jpeg' || type === 'JPEG')){
                this.images.push(file.url);

            }
            if (!limit100M && (type === 'mp4' || type === 'avi'|| type === 'MP4'|| type === 'AVI')) {
                this.$message.warning('每个视频大小不能超过 100MB!已为您自动过滤超过100M的视频');
                this.fileList.forEach((item,index)=>{
                    if(item.uid == file.uid){
                        this.fileList.splice(index,1);
                    }
                })
            }else if(limit100M && (type === 'mp4' || type === 'avi'|| type === 'MP4'|| type === 'AVI')){
                this.videos.push(file.url)
            }
            if(type !== 'mp4' && type !== 'avi'&& type !== 'jpg' && type !== 'png' && type !== 'JPG'&& type !== 'PNG'&& type !== 'jpeg'&& type !== 'JPEG'&& type !== 'MP4'&& type !== 'AVI'){
                this.$message.warning('图片仅支持png/jpg格式、视频仅支持avi/mp4格式!');
            }
            if(file.status == "ready"){
                this.checkRepeat(file);//验重
            }
            if(file.name.length>40){
                this.$message.warning('资源名称不能超过40个字符！');
                this.fileList.forEach((item,index)=>{
                    if(item.uid == file.uid){
                        this.fileList.splice(index,1);
                    }
                })
            };
        },
        //限制上传大小
        beforeUpload(file){
            // var formData = new FormData();
            // this.formData.append('files',file);
            // this.formList = formData;
            // let type = file.name.substring(file.name.lastIndexOf('.')+1);
            // this.typeValidate(type,file);
        },
       
        //点击保存
        save(infoForm){
            this.$refs[infoForm].validate(valid => {
                if(valid){
                    if(this.fileList.length == 0){
                        this.$message.warning('请上传资源!');
                        return false
                    }else{
                        this.fileList.forEach(item=>{
                            item.status = 'ready'
                        })
                        this.uplodeData.resourceType = this.infoForm.moduleId;
                        this.uplodeData.description = this.infoForm.description;
                        this.$nextTick(tick=>{
                            this.$refs.upload.submit();
                        })
                        this.loading = true
                        this.isDisabled = true;
                    }
                }else{
                    this.$message.warning('请选择模块!');
                    return false;
                }

            })
        },
        //上传成功
        uploadSuccess(response, file, fileList){
            let resArr = [];
            fileList.forEach(ele=>{
                if(ele.status == 'success'){
                    resArr.push(ele);
                }
            })
            let that = this;
            if(resArr.length == fileList.length){
                this.loading = false;
                this.$emit('updateView','resourceInfo')
                setTimeout(
                    function(){
                        that.$message.success('保存成功!');
                    },500)
            }

        },
        //上传失败
        uploadErr(err,file){
        },
        //取消保存
        cancel(infoForm){
            this.$refs[infoForm].resetFields();
            this.$emit("updateView","resourceInfo")
        },
        //点击上传列表触发
        handlePictureCardPreview(file){
            this.fileName = file.name
            this.fileList.forEach(item=>{
                item.status = 'ready';
            });
            file.status = 'on';
            let index = this.fileList.indexOf(file);
            this.setActiveItem(index);

        },
        //点击列表控制图片
        setActiveItem(index){
            this.$refs.carousel.setActiveItem(index);
        },
        //切换图片，控制列表高亮
        changeImg(index){
            for(let i=0;i<this.fileList.length;i++){
                 this.fileList[i].status = 'ready'
            }
            this.fileList[index].status = 'on';
        },
        //移除图片事件
        romove(file){
            this.fileList.forEach((item,index)=>{
                if(item.uid == file.uid){
                    this.fileList.splice(index,1);
                }
            })
            let fileType = file.name.substring(file.name.lastIndexOf('.')+1);
            if(fileType == 'jpg'||fileType == 'png' || fileType === 'JPG'|| fileType === 'PNG'|| fileType === 'jpeg' || fileType === 'JPEG'){
                let index = this.images.indexOf(file.url)
                this.images.splice(index,1);
            }else if(fileType == 'mp4'||fileType == 'avi' || fileType === 'MP4'|| fileType === 'AVI'){
                let index = this.videos.indexOf(file.url)
                this.videos.splice(index,1)
            }

        },
        //校验文件名是否重复
        checkRepeat(file){
            this.$ajax.get(url.checkDuplicateFileNameUrl,{
                params:{
                   fileName: file.name
                }
            }).then(res => {
                if(res.data.status == 'success'){

                }else{
                    this.romove(file);
                    this.$message.error('为您自动过滤重复文件');
                    if(this.fileList.length != 0){
                        this.fileList[0].status = 'on';
                    }
                }
                // let data = this.$ajaxCheck(res);
            }).catch(err => {
                this.$ajaxError(err);
            })
            .finally(ok => {
            });
        },
    }

}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";

.addResource{
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
        .imgInfo{
            padding: 24px 24px;
            height: 620px;
            background: #fff;
            .baseBorder();
            margin-top: 16px;
            .infoList{
                width: 49%;
                margin-right:1%;
                float: left;
                .addBtn{
                    width: 210px;
                    height: 40px;
                    color: #2DB7F5;
                }
                .el-upload-list--text{
                    height: 450px;
                    .baseBorder();
                }
                .noData{
                    text-align: center;
                    line-height: 450px;
                    .baseBorder();
                    background: #F8F8F8;
                }
                .resourceListBox{
                    max-height: 450px;
                    min-height: 450px;
                    border: 1px solid @borderColor;
                    border-bottom:0;
                    background: #F8F8F8;
                    margin-top: 10px;
                    overflow-y: auto;
                    .resourceItem{
                        height:36px;
                        line-height:36px;
                        border-bottom: 1px solid @borderColor;
                        padding:0px 10px;
                        position: relative;
                        .deleteIcon{
                            position:absolute;
                            line-height: 36px;
                            right:20px;
                            font-size: 20px;
                            cursor: pointer;
                            display: none;
                            top:0;
                            color:#333;
                        }
                    }
                    .resourceItem:hover{
                        div{
                            color:@themeColor;
                            font-weight:bold;
                        }
                        .deleteIcon{
                            display: block;
                        }
                    }
                    .active{
                        font-weight:bold;
                        color: @themeColor;
                    }
                }
            }
            .infoPreview{
                width: 49%;
                height: 450px;
                float: right;
                padding-top: 70px;
                .el-carousel{
                    height: 452px;
                    padding: 10px;
                }
                .el-carousel__item{
                    img{
                        width: 100%;
                        height: 100%;;
                    }
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
            height: 450px;
        }
        .btnBox{
            margin-top: 16px;
            .el-button{
                width: 160px;
                height: 44px;
                // background: @themeColor;
            }
        }
        .upload-demo{
            .el-upload-list{
                width:48% !important;
                .el-upload-list__item{
                    width:48% !important;
                }
            }
            .el-upload-list__item-name{
                 width:48% !important;
            }
        }
    }

}




</style>
