<template>
  <van-popup class="qr_div" :value="show" @close="close">
    <img src="http://47.114.57.144:90/cdn_wf/static/img/colse1.png" class="clorsICON" @click="close">
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
      default: 'http://118.178.143.116:91/bot/qrimg/6c114193af67c50a8a077d28795153ebbd89fa57f9823c4347c6b528e2932dee5fdf3d808a20a24c528dfeddea7d875f4424070fe88a46cb3857a200f78072a0'
    },
    show: {
      type: Boolean,
      default: false
    },
    expireTime: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      _expireTime: null,
      timer: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
  mounted() {
    this._expireTime = this.expireTime
    this.timer = setInterval(() => {
      if (this._expireTime) {
        this._expireTime -= 1
      } else {
        this.close()
      }
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
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
