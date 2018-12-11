export default {
  url: '',
  method: '',
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: '',
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  // transformRequest: [
  //   data => data
  // ],
  transformResponse: [],
  // 请求头在这里配置
  headers: { 'Content-Type': 'application/json' },
  params: {},
  data: {},
  timeout: 20000,
  withCredentials: false, // default
  responseType: 'json', // default
  maxContentLength: 2000,
  validateStatus: function (status) {
    // default
    return status >= 200 && status < 300
  },
  maxRedirects: 5 // default
}
