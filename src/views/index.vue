<template>
    <div class="content">
      <div class="friend">
        <ul>
          <liItem v-for="(el ,index) in friendsList" :key="index" @showContent="showContent(index,el)" :class="{show:isShow === index}" :item="el" :index="index"></liItem>
        </ul>
      </div>
      <div class="chat_content" v-show="msgContentType">
        <div class="div1">
          <div class="nikeName">小可爱</div>
          <div class="msg_content" id="msg_content">
              <div v-for="(el, index) in rocerd" :key="index">
                <left-content v-if="el.msgType === 1" :item="el"></left-content>
                <right-content v-if="el.msgType === 2" :item="el"></right-content>
              </div>
          </div>
        </div>
        <div class="div2">
          <div class="utils">
            <span class="biaoqing" @click="ShowEmotion()"></span>
          </div>
          <textarea class="input_content" @keydown.enter="postMsg()" v-model="content" spellcheck="false">
            
          </textarea>
          <emotion @emotion="handleEmotion" class="emotion" v-show="isShow"></emotion>
        </div>
      </div>
      <div class="chat_content" v-show="!msgContentType"></div>
    </div>
</template>

<script>

import liItem from './components/liItem'
import rightContent from './components/RightContent'
import leftContent from './components/LeftContent'
import emotion from './components/Emotion'
import store from '@/store'
import utils from '@/common/utils'

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
    rocerd () {
      return this.$store.state.rocerd
    },
    // username () {
    //   return localStorage.getItem('username')
    // },
    friendsList () {
      return this.$store.state.friendsList
    }
  },
  methods: {
    // 当前点击好友时获取当前好友信息
    showContent (index, item) {
      console.log(index,item)
      this.item = item
      this.isShow = index;
      this.msgContentType = true
      // 获取当前用户的聊天信息
      this.$store.dispatch('getContentMsg')
      // 将滚动条置到底部
      this.scrollToBottom()
      // 保存当前聊天好友的信息
      localStorage.setItem('friendUserName', this.item.username)
      localStorage.setItem('friendImg', this.item.imgUrl)
      utils.setStorage('friendsList', this.item.username, this.item, 2) // 设置当前好友的未读条数为0
      this.$store.dispatch('getFriendsList') // 触发当前获取好友列表的dispatch
    },
    // 显示或隐藏当前的表情框
    ShowEmotion () {
      if (this.isShow) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    // 发送信息
    postMsg () {
      var that = this
      this.isShow = false
      window.YTX.postMsg(1, that.content, this.item.username, function (res) {
        let record = {
          id: res.msgClientNo, // 服务器返回的消息ID
          content: that.content,
          type: 1,
          imgUrl: localStorage.getItem('portrait'),
          msgType: 2,
          time: new Date().getTime()
        }

        utils.pushStorage('notSubmitRocerd', that.item.username, record)

        that.content = ''

        store.dispatch('getContentMsg')

        // 设置当前好友列表的最新消息
        utils.setStorage('friendsList', that.item.username, that.item, 2) // 设置当前好友的未读条数为0
        that.$store.dispatch('getFriendsList') // 触发当前获取好友列表的dispatch
        // that.$emit('getContent', that.username)
      })
    },
    handleEmotion (i) {
      var that = this
      this.ShowEmotion()
      window.YTX.postMsg(1, i, this.item.username, function (res) {
        let record = {
          id: res.msgClientNo, // 服务器返回的消息ID
          content: i,
          type: 2,
          imgUrl: localStorage.getItem('portrait'),
          msgType: 2,
          time: new Date().getTime()
        }

        utils.pushStorage('notSubmitRocerd', that.item.username, record)

        store.dispatch('getContentMsg')
        // that.$emit('getContent', that.username)

        // 设置当前好友列表的最新消息
        utils.setStorage('friendsList', that.item.username, that.item, 2) // 设置当前好友的未读条数为0
        that.$store.dispatch('getFriendsList') // 触发当前获取好友列表的dispatch
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
    'rocerd': function (arr) {
      console.log(arr, '改变之后的值')
      this.scrollToBottom()
    }
  },
  mounted () {
    // 触发当前获取所有好友列表
    this.$store.dispatch('getFriendsList')
  },
  components:{
    liItem,
    rightContent,
    leftContent,
    emotion
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
    height: 143px;
    font-style: 12px;
    color: #000;
    display: block;
    border: none;
    font-family: inherit;
    box-sizing: border-box;
    width: calc( 100% + 20px );
    padding: 0 20px 5px 10px;
  }
  .chat_content .div2 .emotion{
    position: absolute;
    top: 0px;
    left: 30px;
    width: 50%;
    background: #fff;
  }
  
</style>
