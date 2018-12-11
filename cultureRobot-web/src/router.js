var context =require("../src/libs/interface/context.js");

module.exports = [{
    path: context.name + '/contentBody',
    name: '/contentBody',
    meta: {
        title: '首页',
        author:"yingdong"
    },
    component: resolve=>resolve(require('./views/contentBody/index.vue')),
    children: [{
        path: context.name + '/contentBody/moduleManage.html',
        name:'/contentBody/moduleManage.html',
        meta: {
            title: '模块管理',
            author:""
        },
        component: resolve => resolve(require('./views/contentBody/moduleManagement/moduleManage.vue'))
    },
    {
        path: context.name + '/contentBody/resourceManage.html',
        name:'/contentBody/resourceManage.html',
        meta: {
            title: '资源管理',
            author:"ssfei"
        },
        component: resolve=>resolve(require('./views/contentBody/resourceManagement/resourceManage.vue'))
    },
    {
        path: context.name + '/contentBody/contentManage.html',
        name: '/contentBody/contentManage.html',
        meta: {
            title: '内容管理',
            author: 'yingdong',
            parentRouter: ''
        },
        // component: resolve => resolve(require('./views/contentBody/contentManagement/addKnowledgePoint.vue'))
        component: resolve => resolve(require('./views/contentBody/contentManagement/contentManage.vue'))
    },
    {
        path: context.name + '/contentBody/addBookContent.html',
        name: '/contentBody/addBookContent.html',
        meta: {
            title: '新增书籍类内容',
            author: 'yingdong',
            parentRouter: ''
        },
        // component: resolve => resolve(require('./views/contentBody/contentManagement/addKnowledgePoint.vue'))
        component: resolve => resolve(require('./views/contentBody/contentManagement/addBookContent.vue'))
    }
    ]
},
{
    path: context.name + '/login.html',
    name: '/login.html',
    meta: {
        title: '登录',
        author:"yingdong"
    },
    component: resolve => resolve(require('./views/login/login.vue'))
},
{
    path: context.name + '/help.html',
    name: '/help',
    meta: {
        title: '帮助页',
        author:"yingdong"
    },
    component: resolve => resolve(require('./views/login/help.vue'))
}
];
