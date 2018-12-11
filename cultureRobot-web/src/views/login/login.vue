<!--
by: yingdong 2018/08/06
name: 登录页
notes:
-->
<template>
    <div id="loginPage" class="loginPage">
        <div class="loginArea">
            <div class="loginTitle">智能考场后台管理系统</div>
            <form method="post" ref="loginForm">
                <div class="accountName">
                    <input type="text" name="name" value="" v-model="userName" placeholder="用户名">
                    <div class="errorTip" v-show="showNameError">请输入用户名</div>
                </div>
                <div class="accountPwd">
                    <input type="password" name="password" value="" v-model="userPwd" placeholder="密码" @keypress="enterLogin($event)" @focus="hideEwdErrorTip" maxlength='6'>
                    <div class="errorTip" v-show="showPwdError" v-text="pwdErrorTip">请输入密码</div>
                </div>
                <div class="loginBtn" @click='login'>登录</div>
            </form>
        </div>
        <div class="copyRight">Copyright©2015 IFLYTEK.All rights reserved. 棋智科技 版权所有</div>
    </div>

</template>

<script>
    import dataUrl from '@/libs/interface/public.js'

    export default {
        name: 'login',
        data () {
            return {
                loading: false,
                userName:'',
                userPwd:'',
                formAction:"",
                showPwdError:false,
                showNameError:false,
                pwdErrorTip:'请输入密码'
            }
        },
        mounted(){
            this.formAction = dataUrl.loginUrl;
            if(this.getCookie('iflytek_2018_cookie_key_')){
                this.$router.push({name: '/contentBody/moduleManage.html'})
            };
        },
        methods: {

            // password 类型转换
            showPassword () {
                this.showPass = !this.showPass
                if (this.showPass) {
                    this.passwordFieldType = 'text'
                } else {
                    this.passwordFieldType = 'password'
                }
                this.passImage = this.passImage === eyeClose ? eyeOn : eyeClose
            },
            //获取cookie
            getCookie(name){
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
                else
                return null;
            },
            // 登录
            login () {
                var password = this.$md5(`iflytek2018_md5${this.userPwd}`);
                var updata={
                    name:this.userName,
                    password:password
                }
                if(!this.userName){
                    this.showNameError = true;
                    return;
                }else{
                    this.showNameError = false;
                }
                if(!this.userPwd){
                    this.showPwdError = true;
                    this.pwdErrorTip = '请输入密码';
                    return;
                }else{
                    this.showPwdError = false;
                }
                this.$ajax.post(dataUrl.loginUrl,updata).then((res) => {
                    if(res.data.status=='error'){
                        this.showPwdError = true;
                        this.pwdErrorTip = '用户名或密码输入错误，请重新输入';
                    }else{
                        let data = this.$ajaxCheck(res);
                        let firstLogin = data.firstLogin
                        if (firstLogin == '1') {// 1表示第一次登陆  0不是第一次登陆
                            this.$router.push({name: '/contentBody/moduleManage.html', query: {firstLogin: true}})
                        } else {
                            this.$router.push({name: '/contentBody/moduleManage.html'})
                        }
                    }
                }).catch(err => {
                    this.$ajaxError(err)
                }).finally(ok => {
                })
            },
            //回车登录
            enterLogin(e){
                var e = e|| window.event();
                if(e.keyCode == 13){
                    this.login();
                }
            },
            //隐藏密码错误提示
            hideEwdErrorTip(){
                this.showPwdError = false;
            }
        },
        watch: {
            // 账号/密码栏，应不允许输入特殊字符
            /*'loginForm.username' (newValue, oldValue) {
                if (!/^[0-9a-zA-Z_]+$/.test(newValue)) {
                    this.$nextTick(() => {
                        this.loginForm.username = oldValue
                    })
                }
            }*/
        }
    }
</script>
<style scoped lang="less">
    input::-webkit-input-placeholder{
        color:#fff;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:#fff;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:#fff;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
    color:#fff;
    }
    input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
    	-webkit-text-fill-color: #ededed !important;
    	-webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
        background-color:transparent;
        background-image: none;
         transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
    }
    input {
    	 background-color:transparent;
    }
    .loginPage{
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        min-height: 600px;
        min-width: 1000px;
        position: fixed;
        overflow: hidden;
        background: url(~@/libs/images/login/bg_login.png)no-repeat center;
        background-size: cover;
        .copyRight{
            position: absolute;
            bottom: 50px;
            text-align: center;
            width:100%;
            color: #fff;

        }
        .loginArea{
            width:420px;
            height:448px;
            margin:145px auto;
            padding: 0 40px;
            background:rgba(255,255,255,.1);
            border-radius: 12px;
            background: -webkit-linear-gradient(rgba(0,153,255,.7), transparent); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(rgba(0,153,255,.7), transparent); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(rgba(0,153,255,.7), transparent); /* Firefox 3.6 - 15 */
            background: linear-gradient(rgba(0,153,255,.7), transparent); /* 标准的语法（必须放在最后） */
            .loginTitle{
                width:100%;
                height:120px;
                line-height: 120px;
                font-size: 30px;
                color: #fff;
                font-weight: bold;
                text-align: center;
            }
            .accountName,.accountPwd{
                border-bottom:1px solid #fff;
                width:100%;
                height:52px;
                line-height: 52px;
                color: #fff;
                background: url(~@/libs/images/login/accountIcon.png)no-repeat left center;
                background-size: 14px;
                padding-left: 24px;
                span{
                    opacity: 0.7;
                    font-size: 14px;
                }
                input{
                    border:none;
                    background: transparent;
                    width: 260px;
                    margin-left: 10px;
                    color: #fff;
                    opacity: 0.7;
                }
                .errorTip{
                    line-height:20px;
                    color:red;
                }
            }
            .accountPwd{
                background: url(~@/libs/images/login/pwdIcon.png)no-repeat left center;
                margin-top:10px;
            }
            .loginBtn{
                width:100%;
                border:1px solid #fff;
                border-radius:6px;
                height:46px;
                line-height: 46px;
                text-align: center;
                margin-top:56px;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
            }
        }
    }
</style>
