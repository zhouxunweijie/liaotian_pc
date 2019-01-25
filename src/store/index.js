import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import utils from '@/common/utils'

Vue.use(Vuex)

const state = {
  message: {}, // 储存聊天信息
  friend: {}, // 当前进行聊天的好友
  friendList: [], // 所有好友列表
  msgGroup: {}, // 如果当前没有发送消息好友的信息，需要先异步获取好友信息，再将聊天信息保存，暂存在这个容器内
}

// getters
const getters = {
  messageList: state => state.message[state.friend.userId]
}
// actions
const actions = {
  // 接受到最新消息时
  newestMsg ({state, commit}, products) {
    if(state.friendList.findIndex(el => el.userId === products.senderId) === -1){
      if(!state.msgGroup[products.msgSender]){
        state.msgGroup[products.msgSender] = []
      }
      // 根据发送者的容联云账号储存消息
      state.msgGroup[products.msgSender].push(products)

      // 只让第一次请求好友信息时执行
      if(state.msgGroup[products.msgSender].length === 1){
        axios.get('web/messengerAccount/getUserInfoByAccount', {
          baseURL: 'http://admin.minmai1688.com/',
          params: {
            accountNumber: products.msgSender
          }
        }).then(res => {
          let friend = res.data.data

          // 将好友添加进好友列表
          state.friendList.unshift(friend)
          // 循环好友信息添加进历史信息
          state.msgGroup[products.msgSender].forEach(element => {

            commit('updateMessage', Object.assign(element, {userId: friend.userId}))

            commit('updateFriendList', {userId: friend.userId, hint: true, time: products.msgDateCreated, msg: products.content, accountNumber: products.msgSender})

          });
          // 将缓存之前的数据清空
          state.msgGroup[products.msgSender] = []
          
        }).catch(res => {
          console.log('好友信息获取失败')
        })
      }
    } else {
      let friend = state.friendList.find(el => el.userId === products.senderId)

      commit('updateMessage', Object.assign(products, {userId: friend.userId}))

      commit('updateFriendList', {userId: friend.userId, hint: true, time: products.msgDateCreated, msg: products.content, accountNumber: products.msgSender})
    }
  },
  // 向好友发送消息
  postMsg ({state, commit} ,obj) {
    YTX.postMsg(1, obj.content, state.friend.accountNumber).then(res => {

      commit('updateMessage', Object.assign(obj, {userId: state.friend.userId}))

      commit('updateFriendList', {userId: state.friend.userId, hint: false, time: obj.msgDateCreated, msg: obj.content})
    })
  }
}

// mutations
const mutations = {
  // 向消息列表中添加消息
  updateMessage (state, obj) {
    return new Promise(resolve => { 
      let message = JSON.parse(localStorage.getItem('message'))
      // 向内存中添加最新消息
      if(!message[obj.userId]){
        message[obj.userId] = []
      }
      message[obj.userId].push(obj)

      localStorage.setItem('message', JSON.stringify(message))
      // 向store中添加最新消息
      if(!state.message[obj.userId]){
        state.message[obj.userId] = []
      }
      state.message[obj.userId].push(obj)
      state.message = Object.assign({}, state.message)
    })
  },
  // 更新好友列表最新消息的条数和状态
  updateFriendList (state, obj) {
    return new Promise((resolve) => {
      // 获取当前好友的索引
      let index = state.friendList.findIndex(el => el.userId === obj.userId)
      // 获取当前好友数据
      let item = state.friendList.find(el => el.userId === obj.userId)

      if(obj.hint){
        item.hint ? ++item.hint : item.hint = 1
      } else {
        item.hint = 0
      }
      item['msg'] = obj.msg
      item['time'] = obj.time
      item['accountNumber'] =  obj.accountNumber || item.accountNumber

      // 在当前位置删除
      Vue.delete(state.friendList, index)

       // 置顶当前最新动态的好友并更新数据
      // Vue.set(state.friendList, index)
      state.friendList.unshift(item)

      // 更新本地缓存中的数据，保存未读的消息
      localStorage.setItem('friendList', JSON.stringify(state.friendList))
    })
  },
  // 获取本地的好友列表
  getFriendList () {
    let friendList = JSON.parse(localStorage.getItem('friendList'))
    if ( friendList && friendList.length > 0) {
      state.friendList = friendList
    } else {
      state.friendList = []
      localStorage.setItem('friendList',"[]")
    }
  },
  // 获取本地的消息数据
  getMessage () {
    let message = JSON.parse(localStorage.getItem('message'))
    if ( message ) {
      state.message = message
    } else {
      state.message = []
      localStorage.setItem('message',"{}")
    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
