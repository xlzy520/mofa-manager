<template>
  <div class="reg bind router_box_ noCache">
    <div class="center_div">
      <div class="title">
        <span @click="$router.back(-1)">
          <img src="fh.png" class="Return">
        </span>
        <i>绑定微信</i>
      </div>
      <div class="back_">
        <div class="box_">
          <div class="box_top">
            <div class="content">
              <div class="modify">
                <div class="binding">
                  <div class="qrdiv">
                    <div class="titl">请用您的手机打开微信扫描此二维码</div>
                    <div class="titl">二维码{{expire}}秒到期</div> <!---->
                    <div class="qr">
                      <img :src="qrcode" />
                    </div>
                    <!--                <div class="cz">重置二维码</div>-->
                  </div>
                </div>
                <div class="text">
                  <i>小提示：</i>
                  <i>本平台为虚拟IP登录，可能会存在风险提示</i>
                  <i>如打开本页面扫描二维码，须用当前手机扫描。请用PC端打开本页面，再用手机进行扫描！</i>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import cardApi from "@/api/card";
  import commonApi from "@/api/common";

  export default {
    name: 'bindCode',
    data() {
      return {
        expire: 100,
        listUserId: '',
        name: '',
        qrcode: '',
        timer: null,
        checkLoginTimer: null
      }
    },
    computed: {
      userId() {
        return localStorage.getItem('userId')
      }
    },
    methods: {
      getWxQrcode() {
        this.$toast.loading({
          message: "获取二维码中，请稍后...",
          forbidClick: true
        })
        this.handleExpire()

        commonApi.getWxQrcode({
          workId: Number(this.listUserId)
        }).then(res => {
          this.qrcode = res.QrUrl2
          this.uuid = res.Uuid
          this.checkWxScanLogin()
        })
      },
      handleExpire(){
        this.timer = setInterval(() => {
          this.expire -= 1
          if (!this.expire) {
            this.clearTimer()
            this.$toast('二维码过期')
            this.$router.push('/')
          }
        }, 1000)
      },
      clearTimer(){
        clearInterval(this.timer)
        this.timer = null
      },
      clearCheckLoginTimer(){
        clearInterval(this.checkLoginTimer)
        this.checkLoginTimer = null
      },
      checkWxScanLogin(){
        this.checkLoginTimer = setInterval(() => {
          commonApi.checkWxScanLogin({uuid: this.uuid}).then(res => {
            if (res) {
              this.clearCheckLoginTimer()
              this.$toast('扫码成功')
              this.$router.push('/')
            }
          })
        }, 5 * 1000)
      },
    },
    mounted() {
      const { id } = this.$route.query
      this.listUserId = id
      this.getWxQrcode()
    },
    beforeDestroy() {
      this.clearTimer()
      this.clearCheckLoginTimer();
    }
  }
</script>

<style lang="less" scoped>

  .bind{
    .center_div{
      padding-top: 0;
    }
    .title{
      padding-bottom: 0;
      height: 2rem;
      line-height: 2rem;
    }
    .back_ > div{
      width: 100% !important;
    }
  }
  .reg .content {
    width: 100%;
    height: auto
  }

  .reg .content .cz {
    font-size: .28rem;
    color: #555;
    border: 1px solid #ebebeb;
    border-radius: .05rem;
    width: 2rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    margin: .5rem auto;
    background: #2b9939;
    color: #fff
  }

  .reg .content .modify {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff
  }

  .reg .content .modify .input_div {
    width: 60%;
    height: auto;
    margin: .32rem auto .28rem
  }

  .reg .content .modify .input_div input {
    width: 100%;
    height: .6rem;
    border-radius: .05rem;
    border: 1px solid #ececec;
    font-size: .24rem;
    text-indent: .2rem;
    margin-bottom: .2rem;
    display: block
  }

  .reg .content .modify .input_div .Determine {
    width: 2.2rem;
    height: .8rem;
    border-radius: .05rem;
    text-align: center;
    line-height: .8rem;
    color: #fff;
    font-size: .28rem;
    margin: .4rem auto 0;
    background-color: #3d80fc
  }

  .reg .content .modify .binding {
    width: 80%;
    height: auto;
    margin: .5rem auto;
    font-size: .24rem;
    color: #666;
    padding-bottom: .2rem
  }

  .reg .content .modify .dispose {
    padding: 1rem 0
  }

  .reg .content .modify .dispose div {
    width: 4rem;
    height: .6rem;
    line-height: .6rem;
    font-size: .26rem;
    color: #fff;
    border-radius: .05rem;
    margin: 0 auto .5rem
  }

  .reg .content .modify .text {
    color: #666;
    width: 100%;
    height: auto;
    margin: .5rem auto;
    font-size: .26rem;
    background: #fff
  }

  .reg .content .modify .text i {
    width: 75%;
    margin: 0 auto;
    display: block;
    text-align: center;
    margin-top: .3rem;
    overflow: hidden;
    color: #999
  }

  .reg .content .modify .text i .spans {
    display: block;
    float: left
  }

  .reg .content .modify .text i .span {
    width: 90%;
    text-align: left;
    display: block;
    float: left
  }

  .reg .content .modify .text .start {
    background: #83ca4e;
    font-size: .26rem;
    color: #fff;
    text-align: center;
    width: 4rem;
    height: .6rem;
    line-height: .6rem;
    border-radius: .05rem;
    margin: .5rem auto
  }

  .reg .content .modify .qrdiv {
    text-align: center;
    color: #666;
    font-size: .28rem
  }

  .reg .content .modify .qrdiv .titl {
    padding-bottom: .3rem
  }

  .reg .content .modify .qrdiv .qr {
    width: 2.97rem;
    height: 2.97rem;
    margin: 0 auto
  }

  .reg .content .modify .qrdiv .qr img {
    width: 100%;
    height: 100%
  }

  .reg .content .modify .activation .Version, .reg .content .modify .upgrade .Version {
    width: 100%;
    height: 3.2rem;
    background: #fff;
    padding-bottom: .1rem
  }

  .reg .content .modify .activation .Version .center, .reg .content .modify .upgrade .Version .center {
    width: 90%;
    height: 3rem;
    margin: 0 auto;
    position: relative;
    top: .13rem;
    border: 1px solid #e7e7e7;
    box-shadow: 2px 1px 13px 0 hsla(0, 0%, 84%, .35);
    border-radius: .1rem;
    overflow: hidden
  }

  .reg .content .modify .activation .Version .center .title, .reg .content .modify .upgrade .Version .center .title {
    width: .7rem;
    height: 100%;
    background: #ff9249;
    text-align: center;
    line-height: .7rem;
    -ms-writing-mode: tb-rl;
    writing-mode: vertical-rl;
    font-size: .3rem;
    color: #fff;
    float: left
  }

  .reg .content .modify .activation .Version .center .suggest, .reg .content .modify .upgrade .Version .center .suggest {
    width: 85%;
    height: 100%;
    font-size: .24rem;
    float: left;
    text-align: left;
    color: #666
  }

  .reg .content .modify .activation .Version .center .suggest .txt, .reg .content .modify .upgrade .Version .center .suggest .txt {
    margin-left: .26rem
  }

  .reg .content .modify .activation .expansion, .reg .content .modify .upgrade .expansion {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: .4rem 0;
    text-align: center;
    font-size: .28rem;
    color: #666;
    background-color: #fff
  }

  .reg .content .modify .activation .expansion .centCode, .reg .content .modify .upgrade .expansion .centCode {
    width: 80%;
    font-size: .28rem;
    text-align: center;
    margin: 0 auto;
    color: #3e80fc;
    padding: .1rem 0
  }

  .reg .content .modify .activation .expansion .promotion, .reg .content .modify .upgrade .expansion .promotion {
    width: 6rem;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    font-size: .28rem;
    color: #fff;
    background: #3d80fc;
    margin: 1rem auto 0;
    border-radius: .1rem
  }

  .reg .content .modify .activation .expansion .Prev, .reg .content .modify .upgrade .expansion .Prev {
    width: 6rem;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    font-size: .28rem;
    color: #3d80fc;
    background: #fff;
    border: 1px solid #3d80fc;
    margin: .5rem auto 0;
    border-radius: .1rem
  }

  .reg .content .modify .activation .expansion .center_input, .reg .content .modify .upgrade .expansion .center_input {
    width: 6rem;
    height: auto;
    border-bottom: 1px solid #c2c2c2;
    border-radius: .05rem;
    text-align: center;
    font-size: .32rem;
    margin: .4rem auto;
    position: relative
  }

  .reg .content .modify .activation .expansion .center_input input, .reg .content .modify .upgrade .expansion .center_input input {
    width: 100%;
    height: .6rem;
    border: none;
    text-align: left;
    font-size: .32rem;
    margin-top: .2rem
  }

  .reg .content .modify .activation .expansion .center_input .van-dropdown-menu, .reg .content .modify .upgrade .expansion .center_input .van-dropdown-menu {
    width: 100%;
    height: 100%;
    color: #7fafff
  }

  .reg .content .modify .activation .expansion .center_input .van-ellipsis, .reg .content .modify .upgrade .expansion .center_input .van-ellipsis {
    color: #7fafff
  }

  .reg .content .modify .activation .expansion .center_input .van-dropdown-menu__title, .reg .content .modify .upgrade .expansion .center_input .van-dropdown-menu__title {
    font-size: .24rem
  }

  .reg .content .modify .activation .expansion .center_input .xia, .reg .content .modify .upgrade .expansion .center_input .xia {
    position: absolute;
    right: .16rem;
    top: 0;
    bottom: 0;
    margin: auto;
    width: .2rem;
    height: .12rem
  }

  .reg .content .modify .activation .expansion .center_input #xz, .reg .content .modify .upgrade .expansion .center_input #xz {
    transform: rotate(180deg)
  }

  .reg .content .modify .activation .expansion .center_input .van-dropdown-menu__title:after, .reg .content .modify .upgrade .expansion .center_input .van-dropdown-menu__title:after {
    display: none
  }

  .reg .content .modify .activation .expansion .center_input .van-dropdown-item--down, .reg .content .modify .upgrade .expansion .center_input .van-dropdown-item--down {
    width: 5rem;
    margin: auto;
    margin-top: .1rem
  }

  .reg .content .modify .activation .expansion .center_input .van-overlay, .reg .content .modify .upgrade .expansion .center_input .van-overlay {
    background: none
  }

  .reg .content .modify .activation .expansion .center_input > div, .reg .content .modify .upgrade .expansion .center_input > div {
    color: #1b1b1b;
    font-size: .32rem;
    padding-bottom: .1rem;
    font-weight: 400;
    text-align: left
  }

  .pub .box_ {
    margin-top: 2rem;
    background: #3b7df5
  }

  .pub .box_ .box_top {
    border-radius: .4rem .4rem 0 0
  }

  .chat, .pub .box_ .box_top {
    width: 100%;
    overflow: hidden
  }

</style>
