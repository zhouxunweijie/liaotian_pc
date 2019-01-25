import MD5 from 'js-md5'
import store from '@/store'

let RL_YTX = window.RL_YTX

function IM () {
  // 应用ID
  this.appid = '8aaf0708669b101e01669ea18b6d01ed'
  // 应用token
  this.appToken = 'c72930dbb2830afaa7cff043bb209a1a'
  // 是否第三方获取sig
  this.flag = false
  // 当前登录状态
  this.loginType = 1
  // 用户名
  this.userName = '00001'
  // 昵称
  this.nickName = ''
  // 出生年月
  this.birth = ''
  // 性别
  this.sex = ''
  // 个性签名
  this.sign = ''
  // 用户id
  this.userId = ''
  // 当前信息版本号
  this.version = ''
  this.timestamp = function () {
    var now = new Date()
    var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? '' + (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds())
    return timestamp
  }
  this.sig = function () {
    return MD5(this.appid + this.userName + this.timestamp() + this.appToken)
  }
}

IM.prototype = {
  init () {
    var resp = RL_YTX.init(this.appid)
    if (resp.code === 170002) {
      // 缺少必要参数，详情见msg参数
      // 用户逻辑处理
    } else if (resp.code === 174001) {
      // 不支持HTML5，关闭页面//用户逻辑处理}
    } else if (resp.code === 200) {}
    // 通过自己的服务器获取完登录用户信息后登录
    
    // 客服登陆
    this.login()
  },
  /**
   * 登录
   */
  login () {
    // var that = this
    // 账号登录参数设置
    var loginBuilder = new RL_YTX.LoginBuilder()
    // 登录类型 1账号登录，3voip账号密码登录
    loginBuilder.setType(this.loginType)
    // 设置用户名
    loginBuilder.setUserName(this.userName)
    // 设置sig
    loginBuilder.setSig(this.sig())
    // 设置时间戳
    loginBuilder.setTimestamp(this.timestamp())
    // 执行用户登录
    RL_YTX.login(loginBuilder, function (obj) {
      // 登录成功回调
    // 注册接收消息事件监听
      console.log(obj, '用户登录成功')
      RL_YTX.onMsgReceiveListener(function (obj) {
        // 收到push消息或者离线消息或判断输入状态//如果obj.msgType==12  判断obj.msgDomainn的值//obj.msgDomain 0 无输入状态  1 正在输入  2 正在录音
        console.log('有新的消息', obj)
        store.dispatch('newestMsg', {
          msgDateCreated: obj.msgDateCreated,
          msgSender: obj.msgSender,
          content: obj.msgContent,
          msgType: 1,
          senderId: obj.msgDomain
        })
      })
    }, function (obj) {
      console.log('登录失败')
    })
  },
  /**
   * 当前只能够发送文本信息和图片信息
   * 向当前好友发送信息
   */
  postMsg (msgType, data, id) {
    return new Promise(resolve => {
      var msgid = new Date().getTime()
      // 新建消息体对象
      var obj = new RL_YTX.MsgBuilder()
      // 设置自定义消息id
      obj.setId(msgid)
      // 设置发送的消息类型1:文本消息 4:图片消息 6:压缩文件 7:非压缩文件
      // 发送非文本消息时，text字段将被忽略，发送文本消息时 file字段将被忽略
      obj.setType(msgType)
      // 设置接收者
      obj.setReceiver(id)
      if (msgType === 1 || msgType === 2) {
        // 设置发送的文本内容
        obj.setText(data)
        RL_YTX.sendMsg(obj, function (res) {
        // 发送消息成功
        // 处理用户逻辑，通知页面
          resolve(res)
          console.log(res, '消息发送成功')
        }, function (res) { // 失败
        // 发送消息失败
        // 处理用户逻辑，通知页面刷新，展现重发按钮
          console.log(res, '发送消息失败')
        })
      } else if (msgType === 4) {
        obj.setFile(data)
        RL_YTX.sendMsg(obj, function (res) {
        // 发送消息成功
        // 处理用户逻辑，通知页面
          resolve(res)
        }, function (obj) { // 失败
        // 发送消息失败
        // 处理用户逻辑，通知页面刷新，展现重发按钮
        }, function (sended, total) {
        // 发送图片或附件时的进度条
        // 如果发送文本消息，可以不传该参数
        })
      }
    })
  }
}

window.YTX = new IM()
