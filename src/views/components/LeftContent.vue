<template>
    <div class="left">
        <div class="left_img">
            <img :src="imgUrl" alt="">
        </div>
        <div class="left_content" v-html="item.content">
        </div>
    </div>
</template>
<script>
export default {
  props: ['item'],
  computed: {
    imgUrl () {
      return this.$store.state.friend.userHead
    }
  }
}
</script>

<style scoped>
.left{
  width: 100%;
  overflow: hidden;
  text-align: left;
  margin-top: 15px
}
.left .left_img{
  margin-right: 14px;
  display: block;
  float: left;
}
.left .left_img img{
  width: 40px;
  height: 40px;
  display: block;
  border-radius: 50%;
}
.left .left_content{
  max-width:calc( 100% - 54px);
  padding: 15px;
  display: inline-block;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px
}
</style>
