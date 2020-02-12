//index.js
import mqtt from '../../utils/mqtt.js';
const host = 'wxs://mig17km.mqtt.iot.bj.baidubce.com/mqtt'; //服务器域名
const options = {
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000, //两次重新连接之间的间隔
  connectTimeout: 30 * 1000, //等待收到CONNACK的时间
  username: 'mig17km/wechat_client',
  password: 'iYPZpUKHOf6RsGO2',
  resubscribe: true
}
var client = null;
var subTopic = { //订阅的主题，数据类型为String、Array、Object
  'test': {
    qos: 1
  }
}
var unsubTopic = ['test'] //退订的主题，数据类型为String、Array
var pubTopic = 'test' //发布消息主题，数据类型为String

Page({
  data: {
    returnCode: ''
  },

  onLoad: function() {

  },

  /**
   * API：connect([url], options)
   * description：连接到由给定的url和options
   */
  mqttConnect: function() {
    client = mqtt.connect(host, options);

    //事件 'connect'，在成功（重新）连接时发出（即connack rc = 0）。
    client.on('connect', (connack) => {
      wx.showToast({
        title: '连接成功',
      })
      this.setData({
        returnCode: connack.returnCode
      })
    })

    //事件 'reconnect'，重新连接开始时发出。
    client.on('reconnect', () => {
      console.log("clientReconnect")
    })

    //事件 'close'，断开连接后发出。
    client.on('close', () => {
      console.log("clientClose")
    })

    //事件 'offline'， 客户端脱机时发出。
    client.on('offline', () => {
      console.log("clientOffline")
    })

    //事件 'error'，当客户端无法连接（即connack rc！= 0）或发生解析错误时发出。
    client.on('error', (error) => {
      console.log(error)
    })

    //事件 'end'在调用时发出。如果将回调传递给，则回调返回后将触发此事件。
    client.on('end', () => {
      console.log("clientEnd")
    })

    //事件 'message'， 客户端收到发布数据包时发出。
    client.on('message', (topic, message, packet) => {
      console.log("收到" + topic + "主题的消息" + message)
      wx.showModal({
        title: '提示',
        content: "收到" + topic + "主题的消息" + message,
        showCancel: false
      })
    })

    //事件 'packetsend'，客户端发送任何数据包时发出。
    client.on('packetsend', (packet) => {
      console.log(packet)
    })

    //事件 'packetreceive' 当客户端收到任何数据包时发出。
    client.on('packetreceive', (packet) => {
      console.log(packet)
    })

  },

  /**
   * API：subscribe(topic/topic array/topic object, [options], [callback])
   * description：订阅一个或多个主题
   */
  subscribeTopic: function() {
    if (client) {
      client.subscribe(subTopic, (err, granted) => {
        if (!err) {
          wx.showToast({
            title: '订阅成功',
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先连接服务器',
        showCancel: false
      })
    }
  },

  /**
   * API：publish(topic, message, [options], [callback])
   * description：将消息发布到主题
   */
  publishMessage: function() {
    if (client && !this.data.returnCode) {
      client.publish(pubTopic, "Hello,I am client!")
    } else {
      wx.showModal({
        title: '提示',
        content: '请先连接服务器',
        showCancel: false
      })
    }
  },

  /**
   * API：unsubscribe(topic/topic array, [options], [callback])
   * description：退订一个或多个主题
   */
  unsubscribeTopic: function() {
    if (client) {
      client.unsubscribe(unsubTopic, (err) => {
        if (!err) {
          wx.showToast({
            title: '退订成功',
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先连接服务器',
        showCancel: false
      })
    }
  },

  /**
   * API：end（[force]，[options]，[cb]）
   * description：关闭客户端
   */
  closeClient: function() {
    if (client) {
      client.end();
      this.setData({
        returnCode: !this.data.returnCode
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先连接服务器',
        showCancel: false
      })
    }
  }
})