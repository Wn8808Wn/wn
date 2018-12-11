<template>
  <div>
    {{data}}
  </div>
</template>

<script>
export default {
  name: 'Common',
  data () {
    return {
      data: null,
      websock: null
    }
  },
  methods: {
    initWebSocket () { // 初始化weosocket
      const wsuri = 'http://192.168.1.34:15000/signalrHubs'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock = this.websocket
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      let actions = { 'test': '12345' }
      this.websocketsend(JSON.stringify(actions))
    },
    websocket () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      console.log(redata)
    },
    websocketsend (Data) { // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    }
  },
  created () {
    this.initWebSocket()
    // this.data = decodeURI(this.$route.query.params)
    // console.log(this.data + ' ' + '挂载完')
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  watch: {
    '$route' () {
      if (this.$route) {
        this.data = decodeURI(this.$route.query.params)
        console.log('更新')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
