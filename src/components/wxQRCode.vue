<template>
  <van-popup class="qr_div" :value="true" @close="close">
    <img src="colse1.png" class="clorsICON" @click="close">
    <div class="QRdiv">
      <div style="padding-bottom: 0.5rem;">二维码到期时间:{{expire}} 秒</div>
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
      default: '1.png'
    },
    expireTime: {
      type: Number,
      default: 100
    },
  },
  data() {
    return {
      expire: null,
      timer: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
  mounted() {
    this.expire = this.expireTime
    let timer = setInterval(() => {
      if (this.expire) {
        this.expire -= 1
      } else {
        clearInterval(timer)
        this.close()
      }
    }, 1000)
  }
}
</script>

<style lang="less">
  .qr_div {
    background: rgba(0,0,0,.4)
  }

  .qr_div .bind {
    width: 1.8rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    background: #09bb07;
    color: #fff;
    font-size: .2rem;
    position: absolute;
    right: .2rem;
    top: .2rem;
    border-radius: .1rem;
    cursor: pointer
  }

  .qr_div .clorsICON {
    width: .36rem;
    height: .36rem;
    position: fixed;
    top: .3rem;
    left: .2rem
  }

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
