/*
    by: ssfei
    name: 模块管理
*/
const testUrl = "/national-lib";
let urlInterface = {
    queryForPageUrl:testUrl+"/module/queryForPage",//列表分页接口
    addUrl:testUrl+"/module/add",//添加模块
    updateStatusUrl:testUrl+"/module/updateStatus",//状态切换（显示/隐藏）
    deleteByIdsUrl:testUrl+"/module/deleteByIds",//批量删除
    findByIdUrl:testUrl+'/module/findById',//编辑查看接口
    updateUrl:testUrl+'/module/update'//编辑保存接口
};
export default urlInterface;
