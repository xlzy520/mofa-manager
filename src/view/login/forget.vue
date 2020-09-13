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
  import cardApi from "../api/card";

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
    background-image: url(data:image/png;base64,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OwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJA9TeNgAAAOwSURBVCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAAAwdE3T/H88D0Cg/8Dn5gAAAABJRU5ErkJggg==);
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
