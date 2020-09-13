<template>
  <div class="pub router_box_ noCache">
    <div class="Navigation">
      <div class="Navigation_title">
        <span @click="$router.back(-1)">
          <img src="http://47.114.57.144:90/cdn_wf/static/img/fh.png" class="Return"></span>
        <i>绑定微信</i></div>
    </div>
    <div class="box_">
      <div class="box_top">
        <div class="content">
          <div class="modify">
            <div class="binding">
              <div class="qrdiv">
                <div class="titl">请用您的手机打开微信扫描此二维码</div>
                <div class="titl">二维码{{expire}}秒到期</div> <!---->
                <div class="qr">
                  <img src="1.png" />
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
        qrcode: ''
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
          workId: this.listUserId
        }).then(res => {
          this.qrcode = res.QrUrl
          this.uuid = res.Uuid
          this.checkWxScanLogin()
        })
      },
      handleExpire(){
        let timer = setInterval(() => {
          this.expire -= 1
          if (!this.expire) {
            clearInterval(timer)
            this.$toast('二维码过期')
            this.$router.push('/')
          }
        }, 1000)
      },
      checkWxScanLogin(){
        let i = 0
        let timer = setInterval(() => {
          i++
          if (i === 1) {
            clearInterval(timer)
            this.$toast.success('扫码成功')
            setTimeout(() => {
              this.$router.push('/')
            }, 300)
          }
        }, 5 * 1000)


        // let timer = setInterval(() => {
        //   commonApi.checkWxScanLogin({uuid: this.uuid}).then(res => {
        //     clearInterval(timer)
        //     this.$toast('扫码成功')
        //     this.$router.push('/')
        //   })
        // }, 5 * 1000)
      },
    },
    mounted() {
      const { id } = this.$route.query
      this.listUserId = id

      this.handleExpire()
      this.checkWxScanLogin()
      // this.getWxQrcode()
    },
  }
</script>

<style lang="less" scoped>
  .pub {
    height: 100%;
    background-color: #fff
  }

  .pub img {
    margin: 0
  }

  .pub .van-dropdown-menu__item {
    min-width: 100%
  }

  .pub .van-popup {
    height: auto
  }

  .pub .Return1 img {
    width: .2rem;
    height: .35rem;
    position: relative;
    top: .05rem;
    margin-right: .13rem
  }

  .pub .titles {
    font-size: .58rem;
    color: #3c3635;
    padding-bottom: .7rem;
    font-weight: 600;
    position: relative;
    display: inline-block;
    float: left;
    margin-left: .58rem;
    margin-top: 1rem
  }

  .pub .titles i {
    position: relative;
    z-index: 2
  }

  .pub .titles span {
    background: #50e54e;
    width: 100%;
    height: .15rem;
    position: absolute;
    left: 0;
    top: .58rem;
    z-index: 1
  }

  .pub .content {
    width: 100%;
    height: auto
  }

  .pub .content .cz {
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

  .pub .content .Account {
    width: 100%;
    height: 2.04rem;
    background: #fff
  }

  .pub .content .Account .center_box {
    width: 90%;
    height: 1.3rem;
    margin: 0 auto;
    position: relative;
    top: .4rem
  }

  .pub .content .Account .center_box .img_icon {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    overflow: hidden;
    float: left
  }

  .pub .content .Account .center_box .img_icon img {
    width: 100%;
    height: 100%
  }

  .pub .content .Account .center_box .information {
    float: left;
    width: 70%;
    text-align: left;
    margin-left: .2rem
  }

  .pub .content .Account .center_box .information .name {
    font-size: .3rem;
    color: #232323
  }

  .pub .content .Account .center_box .information .Effective {
    font-size: .22rem;
    color: #888;
    padding: .1rem 0
  }

  .pub .content .Account .center_box .information .Edition {
    color: #f60;
    font-size: .22rem
  }

  .pub .content .modify {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff
  }

  .pub .content .modify .input_div {
    width: 60%;
    height: auto;
    margin: .32rem auto .28rem
  }

  .pub .content .modify .input_div input {
    width: 100%;
    height: .6rem;
    border-radius: .05rem;
    border: 1px solid #ececec;
    font-size: .24rem;
    text-indent: .2rem;
    margin-bottom: .2rem;
    display: block
  }

  .pub .content .modify .input_div .Determine {
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

  .pub .content .modify .binding {
    width: 80%;
    height: auto;
    margin: .5rem auto;
    font-size: .24rem;
    color: #666;
    padding-bottom: .2rem
  }

  .pub .content .modify .dispose {
    padding: 1rem 0
  }

  .pub .content .modify .dispose div {
    width: 4rem;
    height: .6rem;
    line-height: .6rem;
    font-size: .26rem;
    color: #fff;
    border-radius: .05rem;
    margin: 0 auto .5rem
  }

  .pub .content .modify .text {
    color: #666;
    width: 100%;
    height: auto;
    margin: .5rem auto;
    font-size: .26rem;
    background: #fff
  }

  .pub .content .modify .text i {
    width: 75%;
    margin: 0 auto;
    display: block;
    text-align: center;
    margin-top: .3rem;
    overflow: hidden;
    color: #999
  }

  .pub .content .modify .text i .spans {
    display: block;
    float: left
  }

  .pub .content .modify .text i .span {
    width: 90%;
    text-align: left;
    display: block;
    float: left
  }

  .pub .content .modify .text .start {
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

  .pub .content .modify .qrdiv {
    text-align: center;
    color: #666;
    font-size: .28rem
  }

  .pub .content .modify .qrdiv .titl {
    padding-bottom: .3rem
  }

  .pub .content .modify .qrdiv .qr {
    width: 2.97rem;
    height: 2.97rem;
    margin: 0 auto
  }

  .pub .content .modify .qrdiv .qr img {
    width: 100%;
    height: 100%
  }

  .pub .content .modify .activation .Version, .pub .content .modify .upgrade .Version {
    width: 100%;
    height: 3.2rem;
    background: #fff;
    padding-bottom: .1rem
  }

  .pub .content .modify .activation .Version .center, .pub .content .modify .upgrade .Version .center {
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

  .pub .content .modify .activation .Version .center .title, .pub .content .modify .upgrade .Version .center .title {
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

  .pub .content .modify .activation .Version .center .suggest, .pub .content .modify .upgrade .Version .center .suggest {
    width: 85%;
    height: 100%;
    font-size: .24rem;
    float: left;
    text-align: left;
    color: #666
  }

  .pub .content .modify .activation .Version .center .suggest .txt, .pub .content .modify .upgrade .Version .center .suggest .txt {
    margin-left: .26rem
  }

  .pub .content .modify .activation .expansion, .pub .content .modify .upgrade .expansion {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: .4rem 0;
    text-align: center;
    font-size: .28rem;
    color: #666;
    background-color: #fff
  }

  .pub .content .modify .activation .expansion .centCode, .pub .content .modify .upgrade .expansion .centCode {
    width: 80%;
    font-size: .28rem;
    text-align: center;
    margin: 0 auto;
    color: #3e80fc;
    padding: .1rem 0
  }

  .pub .content .modify .activation .expansion .promotion, .pub .content .modify .upgrade .expansion .promotion {
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

  .pub .content .modify .activation .expansion .Prev, .pub .content .modify .upgrade .expansion .Prev {
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

  .pub .content .modify .activation .expansion .center_input, .pub .content .modify .upgrade .expansion .center_input {
    width: 6rem;
    height: auto;
    border-bottom: 1px solid #c2c2c2;
    border-radius: .05rem;
    text-align: center;
    font-size: .32rem;
    margin: .4rem auto;
    position: relative
  }

  .pub .content .modify .activation .expansion .center_input input, .pub .content .modify .upgrade .expansion .center_input input {
    width: 100%;
    height: .6rem;
    border: none;
    text-align: left;
    font-size: .32rem;
    margin-top: .2rem
  }

  .pub .content .modify .activation .expansion .center_input .van-dropdown-menu, .pub .content .modify .upgrade .expansion .center_input .van-dropdown-menu {
    width: 100%;
    height: 100%;
    color: #7fafff
  }

  .pub .content .modify .activation .expansion .center_input .van-ellipsis, .pub .content .modify .upgrade .expansion .center_input .van-ellipsis {
    color: #7fafff
  }

  .pub .content .modify .activation .expansion .center_input .van-dropdown-menu__title, .pub .content .modify .upgrade .expansion .center_input .van-dropdown-menu__title {
    font-size: .24rem
  }

  .pub .content .modify .activation .expansion .center_input .xia, .pub .content .modify .upgrade .expansion .center_input .xia {
    position: absolute;
    right: .16rem;
    top: 0;
    bottom: 0;
    margin: auto;
    width: .2rem;
    height: .12rem
  }

  .pub .content .modify .activation .expansion .center_input #xz, .pub .content .modify .upgrade .expansion .center_input #xz {
    transform: rotate(180deg)
  }

  .pub .content .modify .activation .expansion .center_input .van-dropdown-menu__title:after, .pub .content .modify .upgrade .expansion .center_input .van-dropdown-menu__title:after {
    display: none
  }

  .pub .content .modify .activation .expansion .center_input .van-dropdown-item--down, .pub .content .modify .upgrade .expansion .center_input .van-dropdown-item--down {
    width: 5rem;
    margin: auto;
    margin-top: .1rem
  }

  .pub .content .modify .activation .expansion .center_input .van-overlay, .pub .content .modify .upgrade .expansion .center_input .van-overlay {
    background: none
  }

  .pub .content .modify .activation .expansion .center_input > div, .pub .content .modify .upgrade .expansion .center_input > div {
    color: #1b1b1b;
    font-size: .32rem;
    padding-bottom: .1rem;
    font-weight: 400;
    text-align: left
  }

  .pub .Graphical {
    width: 100%;
    height: .6rem;
    line-height: .6rem;
    margin: .5rem 0 .6rem
  }

  .pub .Graphical div {
    height: .6rem;
    border: 1px solid #a0a0a0;
    font-size: .28rem;
    color: #d2d2d2
  }

  .pub .Graphical .anTxt {
    height: .5rem;
    font-size: .26rem;
    text-align: center;
    line-height: .5rem;
    margin-bottom: .2rem;
    border: none;
    color: #555
  }

  .pub .Graphical .left_input {
    float: left;
    width: 70%
  }

  .pub .Graphical .left_input input {
    width: 100%;
    height: 90%;
    border: none;
    display: block;
    text-indent: .2rem
  }

  .pub .Graphical .right_img {
    float: right;
    width: 25%
  }

  .pub .Graphical .right_img img {
    width: 100%;
    height: 100%
  }

  .pub .Navigation {
    height: 2rem;
    background-image: url(data:image/png;base64,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OwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJA9TeNgAAAOwSURBVCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAAAwdE3T/H88D0Cg/8Dn5gAAAABJRU5ErkJggg==);
    background-size: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    color: #fff;
    font-size: .35rem
  }

  .pub .Navigation .Navigation_title {
    width: 90%;
    margin: 0 auto;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: left;
    justify-content: left
  }

  .pub .Navigation .Navigation_title img {
    width: .26rem;
    height: .2rem;
    position: relative;
    margin-right: .13rem
  }

  .pub .Navigation .Navigation_title .bz_ {
    width: 1.2rem;
    height: .5rem;
    line-height: .5rem;
    border: 1px solid #fff;
    font-size: .22rem;
    margin-left: auto
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
