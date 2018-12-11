import axios from "axios";
import config from "./config.js";
import { Message } from "element-ui";
import router from "../../router";
let nowTime; // 当前时间
let lifeTime; // 过期时间
let errcallback;
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    if (sessionStorage.dsToken) {
      config.headers.Authorization = 'Bearer ' + sessionStorage.dsToken;
    }
    return config;
  },
  error => {
    // 请求错误 应该有对应的页面显示
    Message({
      //饿了么的消息弹窗组件,类似toast
      showClose: true,
      message: error,
      type: "error"
    });
    return Promise.reject(error);
  }
);
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
    lifeTime = JSON.parse(window.sessionStorage.getItem("lifeTime"));//秒
    nowTime = parseInt(new Date().getTime() / 1000);// 当前时间(秒)
    let refreshTime = Math.abs(lifeTime - Math.floor(nowTime));//还有多久过期
    /* if (refreshTime <= 1800) {//连续调取数据30分钟，获取新的过期时间和token
      let appId = sessionStorage.getItem('appid');
      let appSecert = sessionStorage.getItem('appsecert');
      let refreshToken = sessionStorage.getItem('refreshToken');
      axios.post(`${getUrl}/v2/domian/GetUserRefreshTokenResponse`, {
        "appid": appId,
        "appsecert": appSecert,
        "refreshToken": refreshToken
      }).then((response) => {
        res = response.data
        if (res.status === 200 && res.ret === 0) {
          let accessToken = res.data.accessToken;
          let refreshToken = res.data.refreshToken;
          let lifeTime = res.data.expiration;
          sessionStorage.setItem('token', accessToken);//把token存到本地
          sessionStorage.setItem('refreshToken', refreshToken)//获取的刷新token
          sessionStorage.setItem('lifeTime', lifeTime);//过期时间戳
        }
      })
    } */
    // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
    if (!window.sessionStorage.getItem("dsToken")) {
      //第一次登录时条件是成立的，但延时1秒跳转，此时还在login页，这个时间内又一次指向登录页，再跳转到首页不受影响
      router.push({ path: "/" });
    }
    if (res.data.status == 400 && res.data.ret == -1050) {
      router.push({ path: "/" });
      Message({ //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: res.data.message,
        type: "error"
      });
    }
    // 对响应数据做些事 下面是请求失败的时候提示
    if (res.data.status == 400 && res.data.ret == -1) {
      return Promise.resolve(res);
    }
    if (res.data.ret != 0 && res.data.status != 200 && res.data.ret != -1 && res.data.status != 400) {
      Message({ //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: res.data.message,
        type: "error"
      });
      return Promise.reject(res.data.message);
    }
    return res;
  },
  error => {
    // 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳 直接丢localStorage或者sessionStorage
    // 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间,返回去登录页重新登录
    lifeTime = JSON.parse(window.localStorage.getItem("lifeTime"));//秒
    nowTime = parseInt(new Date().getTime() / 1000);// 当前时间(秒)
    // console.log(nowTime, lifeTime);
    if (nowTime > lifeTime) {
      Message({
        showClose: true,
        message: "登录状态信息过期,请重新登录",
        type: "error"
      });
      sessionStorage.removeItem('lifeTime');
      sessionStorage.removeItem('dsToken');
      router.push({
        path: "/"
      });
    } else {
      // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
      // if (error.response.status === 403) {
      // 	router.push({
      // 		path: "/error/403"
      // 	});
      // }
      // if (error.response.status === 500) {
      // 	router.push({
      // 		path: "/error/500"
      // 	});
      // }
      // if (error.response.status === 502) {
      // 	router.push({
      // 		path: "/error/502"
      // 	});
      // }
      // if (error.response.status === 404) {
      // 	router.push({
      // 		path: "/error/404"
      // 	});
      // }
      return;
    }
    // 返回 response 里的错误信息
    // let errorInfo = error.data.error ? error.data.error.message : error.data;
    // return Promise.reject(errorInfo);
  }
);

/**
 * @description 封装了axios的调用方式，得到的直接是接口返回的数据，对于code
 * @class API
 */

class API {
  constructor() {
    this.url = "";
    this.data = {};
    this.callback = "";
    this.method = "post";
    this.isLoading = false;
  }
  //发送请求
  sendRequest (params) {
    let method = params.method || "post";
    if (method == "get") {
      this.get();
      return null;
    }
    this.post(params);
  }

  get () { }
  //响应请求
  post (params) {
    //响应容错
    errcallback = params.errcallback || "";
    let callback = params.callback || "";
    let url = params.url || "";
    let data = params.data || {};
    config.data = this.data;
    return axios.post(`${url}`, data, config).then(res => {
      let rst = res.data;
      //响应成功的处理
      if (rst.status === 400 && rst.ret === -1) {
        return callback(rst)
      } else if (rst.data === false && rst.ret === -1) {
        return callback(rst)
      } else if (rst.status === 500 && rst.ret === -1) {
        return callback(rst)
      } else if (rst.status === 200 && rst.ret === 0) {
        return callback(rst)
      } else {
        //响应失败的处理
        //获取失败的返回值
        errcallback && errcallback(rst.message || {});
      }
      this.isLoading = false;
    }).catch(e => {
      console.log(e);
    });
  }
}
const http = new API();

export default {
  install: (Vue, Option) => {
    Object.defineProperty(Vue.prototype, "$http", { value: http });
  }
};
//  引用方法
// import http from "./public/api";
// Vue.use(http);
/* let params = {
  url: 'OR9100071',
  data: {
    type: '2'
  },
  method: 'post',
  callback: res => {
    console.log(res);
  }
}
this.$http.sendRequest(params) */