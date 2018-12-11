/*
    by: ruizhesun
    name: 内容管理
*/
const testUrl = "/national-lib";
let urlInterface = {
    queryForPageUrl: testUrl + "/content/queryForPage" ,//内容管理列表
    queryForListUrl:testUrl+"/module/queryForList",
    deleteContentByIdsUrl:testUrl+"/content/deleteContentByIds",
    getBookTemplateUrl:testUrl+"/content/getTemplate/1",
    getKnowledgeTemplateUrl:testUrl+"/content/getTemplate/2",
    uploadBookContentUrl:testUrl+"/content/importContent/1/",
    uploadKnowledgeContentUrl:testUrl+"/content/importContent/2/",
    exportUrl:testUrl+"/content/exportTemp"

};
export default urlInterface;
