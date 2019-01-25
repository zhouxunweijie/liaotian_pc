<template>
    <div class="content">
      <div class="friend">
        <ul>
          <!-- <liItem v-for="(el ,index) in friendList" :key="index" @showContent="showContent(index,el)" :class="{show:isShow === index}" :item="el" :index="index"/> -->
          <li @click="showContent(index,el)" v-for="(el ,index) in friendList" :key="index" :class="{show:isShow === index}">
            <img :src="el.userHead" alt="">
            <div class="li_content">
              <div class="li_title">
                <span>{{el.nickName}}</span>
                <!-- <i>{{item.birth | moment}}</i> -->
              </div>
              <div class="msg_content">
                <p v-html="el.msg"></p>
                <i v-show="el.hint" v-text="el.hint"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="chat_content" v-show="msgContentType">
        <div class="div1">
          <div class="nikeName">{{friend.nickName}}</div>
          <div class="msg_content" id="msg_content">
              <div v-for="(el, index) in messageList" :key="index">
                <left-content v-if="el.msgType === 1" :item="el"></left-content>
                <right-content v-if="el.msgType === 2" :item="el"></right-content>
              </div>
          </div>
        </div>
        <div class="div2">
          <!-- <div class="utils"> -->
            <!-- <span class="biaoqing" @click="ShowEmotion()"></span> -->
          <!-- </div> -->
          <textarea class="input_content" @keydown.enter="postMessage" v-model="content" spellcheck="false">
            
          </textarea>
          <!-- <emotion @emotion="handleEmotion" class="emotion" v-show="isShow"></emotion> -->
        </div>
      </div>
      <div class="chat_content" v-show="!msgContentType"></div>
    </div>
</template>

<script>

import liItem from './components/liItem'
import rightContent from './components/RightContent'
import leftContent from './components/LeftContent'
//import emotion from './components/Emotion'
import store from '@/store'
import utils from '@/common/utils'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      item: {},
      isShow: -1,
      msgContentType: false, // 当前是否有默认展示的好友
      content: ''
    }
  },
  computed: {
    ...mapGetters(['messageList']),
    ...mapState({
      friend: state => state.friend,
      friendList: state => state.friendList,
    })
  },
  methods: {
    ...mapActions(['postMsg']),
    // 当前点击好友时获取当前好友信息
    showContent (index, item) {
      this.$store.state.friend = item
      this.isShow = index;
      this.msgContentType = true
      
      // 将滚动条置到底部
      this.scrollToBottom()

    },
    // 发送信息
    postMessage () {
      var that = this
      this.postMsg({
        content: this.content,
        msgType: 2,
        msgDateCreated: new Date().getTime()
      }).then(res => {
        this.content = ''
      })
    },
    scrollToBottom () {
      this.$nextTick(() => {
        var dome = document.getElementById('msg_content')
        dome.scrollTop = dome.scrollHeight
      })
    }
  },
  watch: {
    'messageList': function (arr) {
      this.scrollToBottom()
    },
    '$store.state.friendList': function (arr) {
      console.log(arr, '好友列表信息改变了')
    }
  },
  mounted () {
    // 触发当前获取所有好友列表
    this.$store.commit('getFriendList')
    // 触发当前获取所有好友聊天记录
    this.$store.commit('getMessage')
  },
  components:{
    liItem,
    rightContent,
    leftContent
  }
}
</script>

<style scoped>
.show{
    background-color:#515050
  }
  .content{
    width: 900px;
    height: 600px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    /* border: 1px solid #d9d9d9; */
    background: #000;
    overflow: hidden;
  }
  .friend{
    height: 100%;
    width: 235px;
    float: left;
    overflow: hidden;
  }
  .friend ul{
    height: 100%;
    overflow-x:hidden;
    overflow-y: scroll;
    background: #3a3a3a;
    margin-right: -16px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-size: 12px;
    color: #63686e
  }
  .chat_content{
    width: 665px;
    float: left;
    height: 100%;
    background-color: #f2f2f2;
    box-shadow: #63686e;
    font-size: 12px;
    background-image: url(../assets/images/logo.png);
    background-repeat: no-repeat;
    background-position: 50%
  }
  .chat_content .div1{
    height: 410px;
    overflow: hidden;
  }
  .chat_content .div1 .nikeName{
    height: 30px;
    text-align: center;
    color: #616161;
    background-color: #ececec;
    line-height: 30px
  }
  .chat_content .div1 .msg_content{
    height: 380px;
    padding: 10px;
    margin-right: -10px;
    overflow-y: scroll;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: #f2f2f2;
  }
  .chat_content .div2{
    height: 188px;
    border: 1px solid #e7e5e5;
    background-color: #fff;
    overflow: hidden;
    position: relative;
  }
  .chat_content .div2 .utils{
    height: 35px;
    line-height: 35px
  }
   .chat_content .div2 .utils{
     padding-top: 10px;
     overflow: hidden;
   }
  .chat_content .div2 .utils span{
    display: block;
    float: left;
    width: 18px;
    height: 18px;
    margin-left: 10px;
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .chat_content .div2 .utils .biaoqing{
    background-image: url(../assets/images/biaoqing.png)
  }
  .chat_content .div2 .input_content{
    height: 178px;
    font-style: 12px;
    color: #000;
    display: block;
    border: none;
    font-family: inherit;
    box-sizing: border-box;
    width: calc( 100% + 20px );
    padding: 10px 20px 5px 10px;
  }
  .chat_content .div2 .emotion{
    position: absolute;
    top: 0px;
    left: 30px;
    width: 50%;
    background: #fff;
  }
  
   li{
    padding: 5px 8px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
  }
  li:hover{
    background-color:#3e3e3e
  }
  li img{
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    border-radius: 50%
  }
  li .li_content{
    float: left;
    width: calc(100% - 50px);
    padding: 5px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box
  }
  li .li_content .li_title{
    margin-top: 5px;
    margin-bottom: 10px;
  }
  li .li_content .li_title span{
    display: inline-block;
    width: calc(100% - 45px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color:#d0cfcf
  }
  li .li_content .li_title i{
    display: block;
    width: 45px;
    float: right;
    transform: scale(.8);
  }
  li .li_content .msg_content{
    position: relative;
  }
  li .li_content .msg_content p{
    width: calc(100% - 5px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  li .li_content .msg_content i{
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #ff3b30;
    right: -8px;
    bottom: 0;
    transform: scale(0.8);
    text-align: center;
    line-height: 15px;
    font-style: normal;
  }
</style>
