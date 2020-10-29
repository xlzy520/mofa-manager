<template>
  <div class="reg router_box_ noCache">
    <div class="center_div">
      <div class="title">
        <span @click="$router.back(-1)">
          <img src="http://47.114.57.144:90/cdn_wf/static/img/fh.png" class="Return">
        </span>
        <i>注册</i></div>
      <div class="back_">
        <div class="input_box">
          <div>账号</div>
          <input type="text" placeholder="请输入登录账号(6-18位字母或数字)" maxlength="18"
                 v-model="userName"
                 @keyup="userName=userName.replace(/[^\w\/]/ig,'')"></div>
        <div class="input_box">
          <div>密码</div>
          <input type="password" placeholder="请输入登录密码(6-18位字母或数字)" maxlength="18"
                 v-model="password"
                 @keyup="password=password.replace(/[^\w\/]/ig,'')"></div>
        <div class="input_box">
          <div>确认密码</div>
          <input type="password" placeholder="请确认登录密码(6-18位字母或数字)" maxlength="18"
                 v-model="password2"
                 @keyup="password2=password2.replace(/[^\w\/]/ig,'')"></div>
        <div class="Graphical"><p>验证码</p>
          <div class="left_input">
            <input type="text" placeholder="请输入图形验证码" maxlength="8" v-model="vcode">
          </div>
          <div class="right_img" @click="getVcode">
            <img :src="img" alt="">
          </div>
        </div>
        <div class="Land" @click="register">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
  import commonApi from "@/api/common";
  import userApi from "@/api/user";
  import { Dialog } from 'vant'
  export default {
    name: 'register',
    data() {
      return {
        userName: '',
        password: '',
        password2: '',
        vcode: '',
        vckey: '',
        img: ''
      }
    },
    mounted() {
      this.getVcode()
    },
    methods: {
      checkLength(field){
        return field.length >5 && field.length < 19
      },
      checkField(){
        if (!this.userName) {
          this.$toast('请输入账号')
          return
        } else {
          if (!this.checkLength(this.userName)) {
            this.$toast('账号长度不正确')
            return
          }
        }
        if (!this.password) {
          this.$toast('请输入密码')
          return
        } else {
          if (!this.checkLength(this.password)) {
            this.$toast('密码长度不正确')
            return
          }
        }
        if (!this.password2) {
          this.$toast('请输入确认密码')
          return
        }
        if (this.password !== this.password2 ) {
          this.$toast('密码不一致')
          return
        }

        if (!this.vcode ) {
          this.$toast('请输入验证码')
          return
        }
        return true;
      },
      register() {
        const checkSuccess = this.checkField()
        if (checkSuccess) {
          userApi.register({
            userName: this.userName,
            password: this.password,
            password2: this.password2,
            vcode: this.vcode,
            vckey: this.vckey,
          }).then(res => {
            Dialog.alert({
              title: "注册成功",
              message: '您已成功注册本系统，接下来使用该账号自动登陆系统，请确保您牢记该账号密码！',
              confirmButtonColor: '#3d80fc'
              }).then(()=> {
              this.$router.push('/login')

            })
          })
        }
      },
      getVcode (){
        commonApi.getVcode().then(res => {
          this.img = res.Base64
          this.vckey = res.vckey
          console.log(res);
        }).catch((err) => {
          console.table(err);
        })
      },
    },
  }
</script>

<style lang="less">
  .reg {
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff
  }

  .reg .Return1 {
    font-size: .3rem;
    color: #555;
    position: absolute;
    left: .26rem;
    top: .32rem
  }

  .reg .title {
    color: #3c3635;
    padding-bottom: 1.13rem;
    font-weight: 400;
    position: relative;
    text-indent: .6rem;
    color: #fff;
    font-size: .35rem
  }

  .reg .title i {
    position: relative;
    z-index: 2
  }

  .reg .title span {
    width: 2rem
  }

  .reg .title .Return {
    width: .26rem;
    height: .2rem;
    position: relative;
    margin-right: .13rem
  }

  .reg .set {
    width: 80%;
    height: auto;
    padding-top: 3rem;
    margin: 0 auto;
    text-align: left
  }

  .reg .set .center_input {
    position: relative;
    width: 100%;
    height: .6rem;
    color: #7fafff;
    border: 1px solid #a0a0a0;
    background-color: #fff
  }

  .reg .set .center_input input {
    width: 100%;
    height: .5rem;
    text-indent: .2rem;
    font-size: .28rem;
    border: none;
    display: block
  }

  .reg .set .center_input .xia {
    position: absolute;
    right: .16rem;
    top: 0;
    bottom: 0;
    margin: auto;
    width: .2rem;
    height: .12rem
  }

  .reg .set .center_input .van-overlay {
    background: none
  }

  .reg .set .center_input .van-dropdown-menu__item {
    -ms-flex-pack: left;
    justify-content: left
  }

  .reg .set .center_input .van-dropdown-menu__title:after {
    display: none
  }

  .reg .set .center_input .van-dropdown-menu {
    height: 100%
  }

  .reg .set .center_input .van-dropdown-item {
    width: 80%;
    margin: auto
  }

  .reg .set .center_input .van-popup {
    height: auto !important;
    margin-top: .1rem
  }

  .reg .set .center_input #xz {
    transform: rotate(180deg)
  }

  .reg .center_div {
    width: 100%;
    height: auto;
    padding-top: 1.16rem;
    margin: 0 auto;
    text-align: left;
    background-image: url('/login_bg.png');
    background-size: 100%
  }

  .reg .center_div .Graphical {
    width: 100%;
    height: 1.27rem;
    margin: 0 auto 1.4rem;
    border-bottom: 1px solid #f3f2f2;
    position: relative
  }

  .reg .center_div .Graphical div {
    height: 60%;
    position: absolute;
    bottom: .01rem;
    font-size: .28rem;
    color: #d2d2d2
  }

  .reg .center_div .Graphical p {
    color: #1b1b1b;
    font-size: .32rem;
    padding-bottom: .1rem;
    font-weight: 400
  }

  .reg .center_div .Graphical .left_input {
    float: left;
    width: 70%
  }

  .reg .center_div .Graphical .left_input input {
    width: 100%;
    height: 90%;
    border: none;
    display: block;
    color: #000
  }

  .reg .center_div .Graphical .right_img {
    float: right;
    width: 25%;
    bottom: 0;
    right: 0
  }

  .reg .center_div .Graphical .right_img img {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    border: 1px solid
  }

  .reg .center_div .input_box {
    width: 100%;
    height: 1.27rem;
    border-bottom: 1px solid #f3f2f2;
    position: relative;
    margin-bottom: .8rem
  }

  .reg .center_div .input_box input {
    width: 100%;
    height: 60%;
    border: none;
    font-size: .28rem;
    background: none;
    display: block;
    position: absolute;
    bottom: 0
  }

  .reg .center_div .input_box img {
    width: .38rem;
    height: .39rem;
    position: absolute;
    left: .12rem;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .reg .center_div .input_box > div {
    color: #1b1b1b;
    font-size: .32rem;
    padding-bottom: .1rem;
    font-weight: 400
  }

  .reg .Land {
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    border-radius: .1rem;
    margin-top: .18rem;
    font-size: .28rem;
    color: #fff;
    background: #3e80fc
  }

  .reg .back_ {
    background: #fff;
    border-radius: .4rem .4rem 0 0;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: .5rem
  }

  .reg .back_ > div {
    width: 80% !important;
    margin: 0 auto
  }
</style>
