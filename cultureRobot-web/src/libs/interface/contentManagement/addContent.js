/*
    by: yingdong
    name: 创建和编辑内容
*/
const testUrl = "/national-lib";
let urlInterface = {
    moudleList: testUrl + "/module/queryForList", //查询所有模板下拉接口
    getResourceListUrl:testUrl + "/resource/getResourceList",//资源搜索
    derectionUrl:testUrl + "/sysDic/queryForList",//获取目录
    findContentUrl:testUrl +"/content/findContent",//编辑内容的反显
    addOrUpdateUrl:testUrl +"/content/addOrUpdate",//添加或编辑内容的提交
    coverListUrl:testUrl +"/content/cover"
};
export default urlInterface;
