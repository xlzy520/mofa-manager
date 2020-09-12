<template>
  <van-popup class="qr_div" :value="show" @close="close">
    <img src="http://47.114.57.144:90/cdn_wf/static/img/colse1.png" class="clorsICON">
    <div class="QRdiv">
      <div style="padding-bottom: 0.5rem;">二维码到期时间:117 秒</div>
      <div index="0" class="qrLIST">
        <div>{{name}}</div>
        <div style="padding: 0.5rem 0px; display: none;"></div>
        <div>
          <div>请扫描二维码</div>
          <img :src="qrcode">
          <div>等待扫码</div>
        </div>
      </div>
      <div>如打开本页面扫描二维码，须用当前手机扫描。请用PC端打开本页面，再用手机进行扫描！</div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'wxQRCode',
  props: {
    name: {
      type: String,
      default: ''
    },
    qrcode: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {

    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
}
</script>

<style lang="less">
  .qr_div .QRdiv {
    width: 90%;
    height: auto;
    margin: 0 auto;
    text-align: center;
    font-size: .28rem;
    color: #fff;
    padding-top: .5rem
  }

  .qr_div .QRdiv .qrLIST {
    padding-bottom: .5rem
  }

  .qr_div .QRdiv img {
    width: 3rem;
    height: 3rem;
    display: block;
    margin: 0 auto
  }

  .qr_div .qrLIST:last-child {
    padding-bottom: 1rem
  }

</style>
