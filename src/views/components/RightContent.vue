<template>
    <div class="right">
        <div class="right_content" v-html="item.content">
        </div>
         <div class="right_img">
            <img :src="imgUrl" alt="">
        </div>
    </div>
</template>
<script>
export default {
  props: ['item'],
  computed: {
    imgUrl () {
      return 'http://systemmaiyuan.minmai1688.com/d408bd27bcd44393bcca5ec3b9010bc9customer_service.png'
    }
  }
}
</script>

<style scoped>
.right{
  width: 100%;
  overflow: hidden;
  text-align: right;
  margin-top: 15px
}
.right .right_img{
  margin-left: 14px;
  display: block;
  float: right;
}
.right .right_img img{
  width: 40px;
  height: 40px;
  display: block;
  border-radius: 50%;
}
.right .right_content{
  max-width:calc( 100% - 54px);
  padding: 15px;
  display: inline-block;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px
}
</style>
