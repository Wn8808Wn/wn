<template>
    <div class="headerBox">
        <div class="content">
            <div class="logoBox"></div>
            <div class="userInfoBox">
                <div class="operateIcon helpIcon" @click="showHelpEvent"></div>
                <div class="operateIcon resetPwdIcon" @click="showChangePwdEvent"></div>
                <div class="operateIcon logoutIcon" @click="clickQuit"></div>
            </div>
        </div>
        <helpPage
            :dialogHelpVisible="showHelp"
            @dialogClose="dialogCloseEvent"
        ></helpPage>
        <changePwd
            :dialogFormVisible="showChangePwd"
            @resetPwdDialogClose="resetPwdDialogCloseEvent"
            >
        </changePwd>
        <el-dialog
            title="提示信息"
            :visible.sync="quitDialog"
            width="30%"
            :append-to-body="true">
            <span class="themeText">您确定要退出系统吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="logout">确 定</el-button>
                <el-button @click="quitDialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import interfaceUrl from '@/libs/interface/public.js'
import {mapState,mapMutations} from "vuex";
import defaultPhoto from '@image/public/default.png';  // .....
import helpPage from "@/views/login/help.vue";
import changePwd from "@/views/login/changePwd.vue";
export default {
    data(){
        return {
            defaultPhoto:defaultPhoto,
            showHelp:false,
            quitDialog:false,
            showChangePwd:false
        }
    },
    computed: {
        ...mapState(["userInfo"])
    },
    components:{
        helpPage,
        changePwd
    },
    mounted() {
        if(this.$route.query.firstLogin){
            this.showHelpEvent();
        }
    },
    methods: {
        ...mapMutations(["setSystemNav"]),

        logout(){
            this.$ajax.get(interfaceUrl.logoutUrl).then(res => {
                var data = this.$ajaxCheck(res);
                if (!data) return;
                this.$router.push({
                    name:"/login.html"
                })
            }).catch(err => {
                this.$ajaxError(err);
            })
        },
        showHelpEvent(){
            this.showHelp = true;
        },
        //隐藏帮助弹框
        dialogCloseEvent(){
            this.showHelp = false;
        },
        clickQuit(){
            this.quitDialog = true;
        },
        okQuit(){
            this.quitDialog = false;
        },
        showChangePwdEvent(){
            this.showChangePwd = true;
        },
        resetPwdDialogCloseEvent(){
            this.showChangePwd = false;
        }
    }
}
</script>

<style scoped lang="less">
@import "~@/libs/css/theme/theme.less";
.headerBox{
    width: 100%;
    height: 50px;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 999;
    .content{
        width: 100%;
        max-width: 1366px;
        background: #fff;
        height: 100%;
        margin: 0 auto;
        padding: 0 10px;
        position: relative;
        .logoBox{
            background-image: url("~@image/public/header_logo.png");
            background-repeat: no-repeat;
            height: 50px;
            line-height: 50px;
            min-width: 200px;
            max-width: 200px;
            float: left;
            background-size:contain;
            background-position: center;
        }
        .userInfoBox{
            width: 140px;
            height: 50px;
            position: relative;
            float:right;
            .operateIcon{
                width:30px;
                height:30px;
                margin-top:10px;
                border-radius:50%;
                border:1px solid #d5d5d5;
                margin-right:16px;
                float:left;
                cursor:pointer;
            }
            .helpIcon{
                background:url("~@image/public/helpIcon.png")no-repeat center;
            }
            .resetPwdIcon{
                background:url("~@image/public/resetPwd.png")no-repeat center;
            }
            .logoutIcon{
                background:url("~@image/public/logoutIcon.png")no-repeat center;
                margin-right:0 !important;
            }
        }
    }
}
.themeText{
    font-size: 16px;
    font-weight: bold;
    color: @themeColor;
}
</style>
