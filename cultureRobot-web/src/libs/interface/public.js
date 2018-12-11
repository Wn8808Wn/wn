/*
    by: yingdong 2018年09月06日
    name: 公共接口
*/
const testUrl = "/national-lib";
let urlInterface = {
    loginUrl: testUrl + "/user/login", //登录接口
    logoutUrl:testUrl + "/user/logout",//退出登录
    checkOldPassword:testUrl+"/user/checkOldPwd",
    checkChangePassword:testUrl+"/user/updatePwd"
};

export default urlInterface;
