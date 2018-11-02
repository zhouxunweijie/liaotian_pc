<template>
  <li @click="showContent">
      <img :src="item.imgUrl" alt="">
      <div class="li_content">
        <div class="li_title">
          <span>{{item.nickName}}</span>
          <!-- <i>{{item.birth | moment}}</i> -->
        </div>
        <div class="msg_content">
          <p v-html="item.msg"></p>
          <i v-show="item.hint" v-text="item.hint"></i>
        </div>
      </div>
  </li>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn');

export default {
  props:['item'],
  data () {
    return {}
  },
  methods: {
    showContent () {
      console.log(this.item, 'dfagagfasghag')
      this.$emit('showContent')
    }
  },
  filters: {
    moment: function (birth) {
      return moment(birth).fromNow();
    }
  }
};
</script>

<style scoped>
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
