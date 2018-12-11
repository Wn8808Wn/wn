/*
    by: ssfei
    name: 资源管理
*/
const testUrl = "/national-lib";
let urlInterface = {
    getResourceListUrl:testUrl+"/resource/getResourceList",//列表分页接口
    queryForListUrl:testUrl+'/module/queryForList',//获取模板下拉列表
    addUrl:testUrl+'/resource/createResource',//新增资源
    updateUrl:testUrl+'/resource/update',//编辑资源
    deleteByIdsUrl:testUrl+'/resource/deleteByIds',//删除资源
    batchImportUrl:testUrl+'/resource/batchImport',//导入资源
    getResourceDetailUrl:testUrl+'/resource/getResourceDetail',//编辑查看资源
    checkDuplicateFileNameUrl:testUrl+'/resource/checkDuplicateFileName'//检查文件是否重复
};

export default urlInterface;