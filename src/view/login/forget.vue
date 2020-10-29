<template>
  <div class="forget router_box_ noCache">
    <div class="center_div">
      <div class="title"><span><img src="http://47.114.57.144:90/cdn_wf/static/img/fh.png" class="Return"></span> <i>找回密码</i>
      </div>
      <div class="back_">
        <div class="input_box">
          <div>账号</div>
          <input type="text" placeholder="请输入账号" maxlength="20" onkeyup="value=value.replace(/[^\w\/]/ig,'')"></div>
        <div class="Graphical "><p>验证码</p>
          <div class="left_input"><input type="text" placeholder="请输入图形验证码"></div>
          <div class="right_img"><img
              src="http:///118.178.143.116:91/captcha/img/962fbb7ff9d1a176f67645ae05c1d05523fb3efdb3276e57baddf0d500a55924a87537b45e11"
              alt=""></div>
        </div>
        <div class="Modular" style="height: auto; overflow: hidden; display: none;">
          <div class="anTxt">
            问题1：
          </div>
          <div class="left_input" style="width: 99%;"><input type="text" placeholder="请输入问题" maxlength="20"></div>
        </div>
        <div class="Modular" style="height: auto; overflow: hidden; display: none;">
          <div class="anTxt">
            问题2：
          </div>
          <div class="left_input" style="width: 99%;"><input type="text" placeholder="请输入问题" maxlength="20"></div>
        </div>
        <div class="input_box" style="display: none;">
          <div>密码</div>
          <input type="password" placeholder="请输入登录密码" maxlength="20"></div>
        <div class="input_box" style="margin-bottom: 1rem; display: none;">
          <div>确认密码</div>
          <input type="password" placeholder="请确认登录密码" maxlength="20"></div>
        <div class="Land">下一步</div>
      </div>
    </div>
  </div>
</template>

<script>
  import cardApi from "@/api/card";

  export default {
    name: 'information',
    data() {
      return {
        card: 'JK84488ecae54ca089a02cf16dca7b94',
        // card: 'KgNjQmTqVtYv2y5ADaFc',
        show: false,
        data: [],
        user: 0
      }
    },
    methods: {
      query() {
        if (!this.card) {
          this.$toast("激活码不能为空！")
          return;
        }
        const data = this.card.split(',');
        cardApi.check({cards: data}).then((res) => {
          console.log(res);
          this.$toast('查询成功')
          this.show = true
          this.data = res
          var a = "";
          // a = s.绑定账号 && "" != s.绑定账号 ? "您的账号为：" + s.绑定账号 : "该激活码尚未绑定账号！",
          //   Dialog.alert({
          //     title: "提示",
          //     message: a
          //   }).then(function() {
          //     t.card = ""
          //   })

        })
      },
      queryText() {
        if (this.show) {
          return '重新查询'
        } else {
          return this.user ? '查询账号' : '查询卡密'
        }

      }
    },
    mounted() {
      if (this.$route.fullPath.split("?")[1]) {
        this.user = 1
      }
    }
  }
</script>

<style lang="less" scoped>
  .information {
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff
  }

  .information .Return1 {
    font-size: .3rem;
    color: #555;
    position: absolute;
    left: .26rem;
    top: .32rem
  }

  .information .Return1 .Return {
    width: .2rem;
    height: .35rem;
    position: relative;
    top: .05rem;
    margin-right: .13rem
  }

  .information .text {
    font-size: .32rem;
    margin: .5rem 0
  }

  .information .title {
    color: #3c3635;
    padding-bottom: 1.13rem;
    font-weight: 400;
    position: relative;
    text-indent: .6rem;
    color: #fff;
    font-size: .35rem
  }

  .information .title i {
    position: relative;
    z-index: 2
  }

  .information .title span {
    width: 2rem
  }

  .information .title .Return {
    width: .26rem;
    height: .2rem;
    position: relative;
    margin-right: .13rem
  }

  .information .center_div {
    width: 100%;
    height: auto;
    padding-top: 1.16rem;
    margin: 0 auto;
    text-align: left;
    background-image: url('/login_bg.png');
    background-size: 100%
  }

  .information .center_div .input {
    width: 100%;
    margin-top: .3rem
  }

  .information .center_div .input input {
    width: 100%;
    height: .8rem;
    font-size: .3rem;
    border: none;
    font-size: .22rem;
    border-bottom: 1px solid #ccc;
    display: block
  }

  .information .center_div .input > div {
    color: #1b1b1b;
    font-size: .32rem;
    padding-bottom: .1rem;
    font-weight: 400
  }

  .information .center_div .query {
    width: 100%;
    height: .8rem;
    font-size: .28rem;
    text-align: center;
    line-height: .8rem;
    margin: 2.3rem auto .5rem;
    border-radius: .1rem;
    color: #fff;
    background: #3e80fc
  }

  .information .text_div {
    padding-top: .3rem;
    font-size: .3rem
  }

  .information .back_ {
    background: #fff;
    border-radius: .4rem .4rem 0 0;
    width: 100%;
    padding-top: 1.53rem;
    padding-bottom: .5rem
  }

  .information .back_ > div {
    width: 80% !important;
    margin: 0 auto
  }

</style>
