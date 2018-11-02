import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/common/utils'

Vue.use(Vuex)

const state = {
  notSubmitRocerd: [], // 当前未提交的消息
  rocerd: [], // 当前已经提交的消息
  username: '', // 当前登录人用户名
  checkoutStatus: null,
  friendsList: [] // 当前的好友列表
}

// getters
const getters = {}
// actions
const actions = {
  postMsg ({ commit, state }, products) {
    console.log('postMsg被触发了')
    commit('postMsg', products)
  },
  getContentMsg ({ commit, state }, products) {
    console.log('getContentMsg被触发了')
    commit('getContentMsg')
  },
  getFriendsList ({ commit, state }, products) {
    console.log('getFriendsList被触发了')
    commit('getFriendsList')
  }
}

// mutations
const mutations = {
  getFriendsList () {
    state.friendsList = JSON.parse(localStorage.getItem('friendsList'))
  },
  postMsg (state, products) {
    console.log('mutations被触发了', products)
    let record = {
      content: products.msgContent,
      type: products.msgType,
      id: products.msgId,
      time: new Date().getTime(),
      msgType: 1
    }
    utils.pushStorage('notSubmitRocerd', localStorage.getItem('friendUserName'), record)
    utils.setStorage('friendsList', localStorage.getItem('friendUserName'), record)
    state.friendsList = JSON.parse(localStorage.getItem('friendsList'))
    state.rocerd.push(record)
  },
  getContentMsg (state) {
    // 获取当前好友用户名
    var username = localStorage.getItem('friendUserName')
    var record = null
    var notSubmitRocerd = null
    // 如果当前是第一次聊天，会先给当前聊天信息创建一个容器
    if ((JSON.parse(localStorage.getItem('record')))[username]) {
      record = (JSON.parse(localStorage.getItem('record')))[username]
    } else {
      let a = JSON.parse(localStorage.getItem('record'))
      a[username] = []
      localStorage.setItem('record', JSON.stringify(a))
      record = []
    }

    if ((JSON.parse(localStorage.getItem('notSubmitRocerd')))[username]) {
      notSubmitRocerd = (JSON.parse(localStorage.getItem('notSubmitRocerd')))[username]
    } else {
      let a = JSON.parse(localStorage.getItem('notSubmitRocerd'))
      a[username] = []
      localStorage.setItem('notSubmitRocerd', JSON.stringify(a))
      notSubmitRocerd = []
    }
    record.push(...notSubmitRocerd)
    state.rocerd = record
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
