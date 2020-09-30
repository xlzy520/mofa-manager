<template>
  <div class="login router_box_ noCache">
    <div class="oper anm">
      <div class="center_div">
        <div class="title">
          <i>欢迎登录</i>
          <span>魔法管家—辅助工具</span>
        </div>
        <div class="back_">
          <ul class="home_table">
            <li :class="isActive(0)" @click="changeTab(0)">账号密码登录</li>
            <li :class="isActive(1)" @click="changeTab(1)">激活码登录</li>
          </ul>
          <div class="input_box" v-if="isPasswordLogin">
            <div>账号</div>
            <input type="text" placeholder="请输入账号" maxlength="18"
                   v-model="userName"
                   @keyup="userName=userName.replace(/[^\w\/]/ig,'')" />
          </div>
          <div class="input_box" style="margin-bottom: 0.1rem;" v-if="isPasswordLogin">
            <div>密码</div>
            <input type="password" @keyup.enter="Land" placeholder="请输入密码" maxlength="20"
                   v-model="password"></div>
          <div class="input_box" v-if="isCodeLogin">
            <div>激活码</div>
            <input type="text" placeholder="请输入激活码" maxlength="32" v-model="card"
                   @keyup="card=card.replace(/[^\w\/]/ig,'')"></div>
          <div class="wjmm" v-if="isPasswordLogin" v-show="false">
            <span @click="redirect('/information?1')">忘记账号</span>
            |
            <span @click="redirect('forget')">忘记密码</span></div>
          <div class="Land" @click="Land">确认登录</div>
          <div class="forget" style="width: 60% !important;">
            <span @click="redirect('register')">立即注册 </span>
            <span @click="redirect('information')">卡密查询</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'vant'
  import userApi from '@/api/user'
  import commonApi from "@/api/common";

  export default {
    name: 'login',
    data() {
      return {
        str: true,
        userName: 'abc',
        card: "KhNjQnTqVtYv2y5A7DaF",
        password: "123456",
        isShow: false,
        name: "",
        id: 0,

      }
    },
    computed: {
      isPasswordLogin() {
        return this.id === 0
      },
      isCodeLogin() {
        return this.id === 1
      }
    },
    methods: {
      isActive(id) {
        if (id === this.id) {
          return 'homepath'
        }
      },
      changeTab(id) {
        this.id = id
      },
      redirect(path){
        this.$router.push(path)
      },
      Land(){
        let e = this;
        if (0 === this.id) {
          if ("" === this.userName){
            return Toast("请输入账号！")
          }
          if ("" === this.password){
            return Toast("请输入密码！")
          }
        } else {
          if ("" === this.card){
            return Toast("请输入激活码！")
          }
        }
        const loading = this.$toast.loading({
          duration: 0,
          message: "请稍后...",
          forbidClick: true
        })
        let data = {}
        data = {
          loginType: this.id,
          card: this.card,
          userName: e.userName,
          password: e.password,
        }
        userApi.login(data).then(res => {
          this.$toast('登录成功')
          e.str = true
          e.token = res.token;
          this.$store.dispatch('user/saveUserInfo', res)
          commonApi.getWork({
            userId: res.UserInfo.id
          }).then(res1 => {
            if (this.isPasswordLogin) {
              if (!res1.length) {
                this.$router.push('/bindCode')
              } else {
                this.$router.push('/')
              }
            } else {
              if (!res1.length) {
                this.$router.push('/bindCode?id='+res.UserInfo.id)
              } else {
                this.$router.push('/')
              }
            }

          })
        }).finally(() => {
          // loading.close()
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  @keyframes mymove-data-v-f2cdea6e {
    0% {
      width: 3.4rem;
      height: 3rem;
      right: 30%;
      top: 35%;
      opacity: .5
    }

    50% {
      opacity: 1
    }

    to {
      width: 3.4rem;
      height: 3rem;
      right: -15%;
      top: -10%;
      opacity: 1
    }
  }

  @keyframes mymove1-data-v-f2cdea6e {
    0% {
      width: 3.4rem;
      height: 3rem;
      left: 25%;
      bottom: 42%;
      opacity: .5
    }

    50% {
      opacity: 1
    }

    to {
      width: 3.4rem;
      height: 3rem;
      left: -15%;
      bottom: -10%;
      opacity: 1
    }
  }

  @keyframes mymove2-data-v-f2cdea6e {
    0% {
      opacity: 0
    }

    to {
      opacity: 1
    }
  }

  .login {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: scroll;
    background: #fff
  }

  .login .van_pop {
    background: rgba(0, 0, 0, .4)
  }

  .login .van_pop .loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 3rem;
    height: 3rem
  }

  .login .van_pop .loading .van-loading__spinner {
    width: 2rem;
    height: 2rem
  }

  .login .van_pop .loadings {
    width: 7rem;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto
  }

  .login .img_Cc {
    position: absolute;
    z-index: 10;
    opacity: 0
  }

  .login .effects1 {
    opacity: 1;
    animation: mymove-data-v-f2cdea6e 5s forwards
  }

  .login .effects2 {
    opacity: 1;
    animation: mymove1-data-v-f2cdea6e 5s forwards
  }

  .login .anm {
    /*animation: mymove2-data-v-f2cdea6e 8s forwards*/
  }

  .login .oper {
    /*opacity: 0;*/
    width: 100%;
    height: 100%;
    background: #fff
  }

  .login .center_div {
    width: 100%;
    height: auto;
    padding-top: .94rem;
    margin: 0 auto;
    text-align: left;
    position: relative;
    background: url('/login_bg.png');
    background-size: 100%
  }

  .login .center_div .operation {
    font-size: .3rem;
    color: #09bb07;
    position: absolute;
    right: 0;
    top: .8rem
  }

  .login .center_div .title {
    font-size: .35rem;
    color: #fff;
    padding-bottom: .81rem;
    font-weight: 700;
    position: relative;
    margin-left: .6rem
  }

  .login .center_div .title i {
    position: relative;
    z-index: 2
  }

  .login .center_div .title span {
    color: #fff;
    font-size: .3rem;
    display: block;
    font-weight: 400;
    padding-top: .1rem
  }

  .login .center_div .Graphical {
    width: 100%;
    height: 1.27rem;
    line-height: 1.27rem;
    margin: 0 0 1rem;
    border-bottom: 1px solid #f3f2f2;
    position: relative
  }

  .login .center_div .Graphical div {
    height: 60%;
    position: absolute;
    bottom: .01rem;
    font-size: .28rem;
    color: #d2d2d2
  }

  .login .center_div .Graphical .left_input {
    float: left;
    width: 70%
  }

  .login .center_div .Graphical .left_input input {
    width: 100%;
    height: 98%;
    border: none;
    display: block;
    color: #000
  }

  .login .center_div .Graphical .right_img {
    float: right;
    width: 25%;
    bottom: 0;
    right: 0;
    cursor: pointer
  }

  .login .center_div .Graphical .right_img img {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .login .center_div .input_box {
    width: 100%;
    height: 1.27rem;
    border-bottom: 1px solid #f3f2f2;
    position: relative;
    margin-bottom: .8rem
  }

  .login .center_div .input_box input {
    width: 100%;
    height: 60%;
    border: none;
    font-size: .28rem;
    background: none;
    display: block;
    position: absolute;
    bottom: 0
  }

  .login .center_div .input_box img {
    width: .38rem;
    height: .39rem;
    position: absolute;
    left: .12rem;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .login .center_div .input_box > div {
    color: #1b1b1b;
    font-size: .32rem;
    padding-bottom: .1rem
  }

  .login .center_div .input_box span {
    color: #3e80fc;
    font-size: .24rem;
    width: 100%;
    text-align: right;
    display: inline-block
  }

  .login .center_div .wjmm {
    font-size: .2rem;
    height: .6rem;
    text-align: center;
    line-height: .6rem
  }

  .login .center_div .wjmm span {
    color: #3e80fc;
    font-size: .24rem;
    text-align: right;
    padding: 0 .2rem
  }

  .login .center_div .Land {
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    border-radius: .1rem;
    margin-top: 1rem;
    font-size: .28rem;
    color: #fff;
    cursor: pointer;
    background: #3d80fc
  }

  .login .center_div .forget {
    text-align: center;
    font-size: .28rem;
    color: #3d80fc;
    width: 90%;
    margin: .8rem auto 1rem;
    cursor: pointer;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between
  }

  .login .center_div .register {
    font-size: .3rem;
    color: #0c64eb;
    text-align: center;
    margin-bottom: .5rem;
    cursor: pointer;
    padding-bottom: .5rem
  }

  .login .about1 {
    position: absolute;
    right: .2rem;
    bottom: .2rem;
    font-size: .25rem;
    color: #b4b4b4
  }

  .login .about1 img {
    width: .34rem;
    height: .34rem;
    position: relative;
    top: .05rem
  }

  .login .back_ {
    background: #fff;
    border-radius: .4rem .4rem 0 0;
    width: 100%;
    padding-bottom: .5rem
  }

  .login .back_ > div {
    width: 80% !important;
    margin: 0 auto
  }

  .login .home_table {
    width: 100%;
    height: .9rem;
    line-height: .9rem;
    font-size: .34rem;
    border-radius: .4rem .4rem 0 0;
    overflow: hidden;
    padding-bottom: 1rem
  }

  .login .home_table li {
    width: 50%;
    float: left;
    color: #999;
    background: #f2f2f2;
    text-align: center
  }

  .login .home_table .homepath {
    color: #1b1b1b;
    background: #fff
  }

</style>
