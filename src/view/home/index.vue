<template>
  <div id="home" class="home router_box_">
    <div class="home_bac">
      <div class="home_Center">
        <div class="home_toptxt"><p :title="username">我的账号：{{username}}</p>
          <p>魔法管家——全功能版</p>
          <div class="signOut" @click="signOut">退出登录</div>
        </div>
        <ul class="home_table">
          <li class="homepath">产品信息</li>
<!--          <li class="">功能设置</li>-->
        </ul>
      </div>
      <div class="wxManage1 jm">
        <ul class="list_user">
          <li v-for="item in list" :key="item.id">
            <div class="center">
              <div class="operation">
                <div>到期时间：{{item.expire_time | formatDate}}</div>
                <div style="display: flex">
                  <div class="OPbuttom" v-if="renewal(item)" @click="toRenewal(item)">续费</div>
                  <div class="OPbuttom" v-if="scan(item)" @click="toScan(item)">扫码</div>
                  <div class="OPbuttom" v-if="restart1(item)" @click="toRestart1(item)">唤醒</div>
                  <div class="OPbuttom" v-if="restart2(item)" @click="toRestart2(item)">重启</div>
                </div>
              </div>
              <div class="HOmessage">
                <img v-if="item.wx_small_head" :src="item.wx_small_head" alt="">
                <van-icon size="0.5rem" @click="toScan(item)" name="add-o" v-else />
                <div class="df right-content">
                  <div class="right-content-item" v-if="item.wx_user" >
                    <div>{{item.wx_nick_name}}</div>
                    <div class="homesz">
                      <div style="margin-right: 10px">
                        微信状态：<i :class="wxStatusColor(item.wx_status)">{{wxStatus(item.wx_status)}}</i>
                      </div>
                      <!--                    <VanCheckbox :value="true" @change="changeDefault" checked-color="#07c160" class="checkbox">-->
                      <!--                      设置为默认账号-->
                      <!--                    </VanCheckbox>-->
<!--                      <img src="http://47.114.57.144:90/cdn_wf/static/img/xq.png" alt="">-->
                    </div>
                  </div>
                  <div class="right-content-item">
                    <div>{{getCardTypeText(item.card_type)}}: {{item.card_code}}</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <div class="addCAT" @click="addCAT">新增激活码</div>
        </ul>
        <wxQRCode :name="name" v-if="popupShow" :qrcode="qrcode" :expireTime="100"
                  @close="close"></wxQRCode>
      </div>
    </div>
  </div>
</template>

<script>
  import commonApi from "@/api/common";
  import { cardMap } from "@/utils/enum";
  import dayjs from 'dayjs'
  import wxQRCode from "@/components/wxQRCode";

  export default {
    name: 'home',
    components: { wxQRCode },
    data() {
      return {
        list: [],
        popupShow: false,
        name: '',
        qrcode: '',
        uuid: '',
        timer: null
      }
    },
    filters: {
      formatDate: function (value) {
        return value.substr(0, 10);
      }
    },
    computed: {
      username() {
        return localStorage.getItem('username')
      },
      userId() {
        return localStorage.getItem('userId')
      }
    },
    methods: {
      getCardTypeText(val){
        return cardMap[val]
      },
      renewal(item){
        return dayjs().isAfter(dayjs(item.expire_time))
      },
      scan(item){
        return dayjs().isBefore(dayjs(item.expire_time)) && [-1, 0, 3, null].includes(item.wx_status)
      },
      restart1(item){
        return dayjs().isBefore(dayjs(item.expire_time)) && item.wx_status === 4
      },
      restart2(item){
        return dayjs().isBefore(dayjs(item.expire_time)) && item.wx_status === 2
      },
      wxStatus(val){
        if (val === 2) {
          return '在线'
        }
        return '离线'
      },
      wxStatusColor(val){
        if (val === 2) {
          return 'green-status'
        }
        return 'red-status'
      },

      toRenewal(item){
        this.$router.push({path: '/bindCode', query: {id: item.user_id, type: 'renewal'}})
      },
      checkWxScanLogin(){
        let i = 0
        this.timer = setInterval(() => {
          i++
          if (i === 1) {
            clearInterval(this.timer)
            this.$toast.success('扫码成功')
            this.popupShow = false
            this.getList()
          }
        }, 5 * 1000)
        // let timer = setInterval(() => {
        //   commonApi.checkWxScanLogin({uuid: this.uuid}).then(res => {
        //     clearInterval(timer)
        //     this.$toast('扫码成功')
        //     this.popupShow = false
        //     this.getList()
        //   })
        // }, 5 * 1000)
      },
      getWxQrcode(item) {
        const loading = this.$toast.loading({
          message: "获取二维码中，请稍后...",
          forbidClick: true
        })

        this.popupShow = true
        this.name = item.wx_nick_name
        this.qrcode = '1.png'
        loading.close()
        this.checkWxScanLogin()


        // commonApi.getWxQrcode({
        //   workId: item.user_id
        // }).then(res => {
        //   this.popupShow = true
        //   this.qrcode = res.QrUrl
        //   this.uuid = res.Uuid
        //   this.checkWxScanLogin()
        // })
      },
      toScan(item){
        this.getWxQrcode(item)
        // this.$router.push({path: '/BindQRCode', query: {id: item.user_id}})
      },
      toRestart1(item){
        commonApi.restart1({
          wxId: item.wx_user
        }).then(res => {
          this.$toast('唤醒登录成功')
          this.getList()
        })
      },
      toRestart2(item){
        commonApi.restart2({
          wxId: item.wx_user
        }).then(res => {
          this.$toast('强制重启成功')
          this.getList()
        })
      },
      signOut() {
        localStorage.clear()
        this.$router.push('/login')
      },
      addCAT() {
        this.$router.push('/bindCode')
      },
      getList(isFirst) {
        if (isFirst) {
          this.$toast.loading({
            duration: 0,
            message: "获取数据中，请稍后...",
            forbidClick: true
          })
        }
        commonApi.getWork({
          userId: this.userId
        }).then(res => {
          this.list = res || []
        }).finally(() => {
          this.$toast.clear()
        })
      },
      changeDefault (){

      },
      close (){
        this.popupShow = false
        clearInterval(this.timer)
      },
    },
    mounted() {
      this.getList(true)
    },
  }
</script>

<style lang="less" scoped>
  .home {
    background: #fff;
    overflow-x: hidden;
    height: 100%;
    scrollbar-width: none;
    overflow-y: auto;
    scrollbar-color: transparent transparent;
    scrollbar-arrow-color: #f0f2f5;
    scrollbar-base-color: #f0f2f5;
    scrollbar-track-color: #f0f2f5;
    scrollbar-shadow-color: #f0f2f5
  }

  .home .router-view {
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
    position: absolute;
    top: 0;
    width: 100%
  }

  .slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
    will-change: transform;
    transition: all .5s;
    width: 100vw;
    height: 100vh;
    position: fixed
  }

  .slide-right-enter {
    z-index: 99;
    transform: translate(-100%);
    transition-timing-function: ease-in
  }

  .slide-left-enter {
    transform: translate(100%);
    transition-timing-function: ease-in
  }

  .home_table {
    width: 100%;
    height: .9rem;
    line-height: .9rem;
    font-size: .34rem;
    border-radius: .4rem .4rem 0 0;
    overflow: hidden
  }

  .home_table li {
    width: 100%;
    float: left;
    color: #999;
    background: #f2f2f2
  }

  .home_table .homepath {
    color: #1b1b1b;
    background: #fff
  }

  .jm {
    padding-top: 2.7rem !important
  }

  .signOut {
    border: 1px solid #fff;
    width: 1.2rem;
    height: .5rem;
    line-height: .5rem;
    text-align: center;
    font-size: .22rem;
    color: #fff;
    position: absolute;
    right: .3rem;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .wxManage1 {
    width: 100%;
    height: 100%;
    padding-top: 1.08rem;
    overflow-y: scroll;
    background-color: #fff
  }

  .wxManage1 .disa {
    pointer-events: none;
    background: #d4d4d4 !important
  }

  .wxManage1 img {
    margin: 0
  }

  .wxManage1 .compiler {
    width: 90%;
    height: 1.1rem;
    margin: 0 auto;
    position: relative;
    top: .4rem;
    border-top: 1px solid #ebebeb;
    padding-top: .3rem
  }

  .wxManage1 .compiler div {
    float: left;
    width: 20%;
    height: .5rem;
    line-height: .5rem;
    text-align: center;
    font-size: .24rem
  }

  .wxManage1 .compiler div i {
    display: block;
    width: 90%;
    height: 100%;
    border: 1px solid;
    border-radius: .05rem
  }

  .wxManage1 .qr_div {
    background: rgba(0, 0, 0, .4)
  }

  .wxManage1 .qr_div .bind {
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

  .wxManage1 .qr_div .clorsICON {
    width: .36rem;
    height: .36rem;
    position: fixed;
    top: .3rem;
    left: .2rem
  }

  .wxManage1 .qr_div .QRdiv {
    width: 90%;
    height: auto;
    margin: 0 auto;
    text-align: center;
    font-size: .28rem;
    color: #fff;
    padding-top: .5rem
  }

  .wxManage1 .qr_div .QRdiv .qrLIST {
    padding-bottom: .5rem
  }

  .wxManage1 .qr_div .QRdiv img {
    width: 3rem;
    height: 3rem;
    display: block;
    margin: 0 auto
  }

  .wxManage1 .qr_div .qrLIST:last-child {
    padding-bottom: 1rem
  }

  .wxManage1 .Account {
    width: 100%;
    height: 2.04rem;
    background: #fff;
    padding-top: 1.08rem
  }

  .wxManage1 .center_box {
    width: 90%;
    height: 1.3rem;
    margin: 0 auto;
    position: relative;
    top: .4rem
  }

  .wxManage1 .center_box .redDot1 {
    width: .2rem;
    height: .2rem;
    border-radius: 50%;
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: .12rem;
    line-height: .5rem;
    text-align: center;
    color: #fff
  }

  .wxManage1 .center_box .redDot1 i {
    transform: scale(.7);
    display: block
  }

  .wxManage1 .center_box .img_icon {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 10%;
    overflow: hidden;
    float: left;
    position: relative
  }

  .wxManage1 .center_box .img_icon img {
    width: 100%;
    height: 100%
  }

  .wxManage1 .center_box .information {
    float: left;
    width: 75%;
    text-align: left;
    margin-left: .2rem;
    position: relative
  }

  .wxManage1 .center_box .information .circular {
    position: absolute;
    right: 0;
    width: .36rem;
    height: .36rem;
    border-radius: 50%;
    text-align: center;
    line-height: .4rem;
    font-size: .24rem;
    color: #fff;
    background: #fff;
    border: 1px solid;
    top: .2rem
  }

  .wxManage1 .center_box .information .circular span {
    transform: scale(.8);
    display: block
  }

  .wxManage1 .center_box .information .Monitor {
    position: absolute;
    right: .2rem;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: .2rem;
    height: .7rem;
    color: #c7c2c2
  }

  .wxManage1 .center_box .information .subjective {
    position: absolute;
    right: -.1rem;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: .24rem;
    height: .6rem;
    color: #ababab
  }

  .wxManage1 .center_box .information .name {
    font-size: .32rem;
    color: #232323
  }

  .wxManage1 .center_box .information .name i {
    font-size: .2rem
  }

  .wxManage1 .center_box .information .Effective {
    font-size: .24rem;
    color: #888;
    padding: .1rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 88%
  }

  .wxManage1 .center_box .information .Edition {
    color: #e99620;
    padding: .1rem 0 0;
    font-size: .28rem
  }

  .wxManage1 .closeIcon {
    width: .36rem;
    height: .36rem;
    position: relative;
    top: .05rem
  }

  .wxManage1 .right_icon {
    width: .5rem;
    height: .1rem;
    position: relative;
    top: -.1rem
  }

  .wxManage1 .list_user {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding-bottom: 1rem;
    border-top: .4rem solid #fff
  }

  .wxManage1 .list_user li {
    width: 100%;
    height: auto;
    color: #555;
    font-size: .28rem;
    background: #fff;
    padding-bottom: .2rem
  }

  .wxManage1 .list_user li .center {
    width: 90%;
    height: auto;
    margin: .1rem auto .2rem;
    text-align: left;
    position: relative;
    box-shadow: 2px -1px 15px 0 hsla(0, 0%, 56%, .22);
    border-radius: 10px
  }

  .wxManage1 .list_user li .center .operation {
    display: flex;
    justify-content: space-between;
    padding: .2rem;
    color: #1b1b1b;
    font-size: .24rem
  }

  .wxManage1 .list_user li .center .operation .OPbuttom {
    width: 1rem;
    height: .4rem;
    line-height: .4rem;
    color: #fff;
    font-size: .22rem;
    text-align: center;
    background: #3d7ffb;
    border-radius: 5px;
    margin-left: 0.1rem;
  }

  .wxManage1 .list_user li .center .HOmessage {
    display: -ms-flexbox;
    display: flex;
    padding: 0 .2rem .2rem;
    -ms-flex-pack: justify;
    justify-content: space-between
  }

  .right-content{
    display: flex;
    flex-direction: column;
    width: 80%;
    align-items: center;
  }

  .right-content-item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wxManage1 .list_user li .center .HOmessage > img {
    width: .85rem;
    height: .85rem
  }

  .wxManage1 .list_user li .center .HOmessage .homesz {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -ms-flex-align: center;
    align-items: center;
    font-size: .24rem;
    color: #1b1b1b
  }

  .wxManage1 .list_user li .center .HOmessage .homesz img {
    width: .26rem;
    height: .26rem
  }

  .wxManage1 .list_user li .center .van-radio__icon {
    font-size: 16px
  }

  .wxManage1 .list_user li .center .checkbox, .wxManage1 .list_user li .center .van-radio-group {
    padding: 0 .4rem
  }

  .wxManage1 .list_user .addCAT {
    width: 80%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: #3d7ffb;
    border-radius: .1rem;
    font-size: .28rem;
    text-align: center;
    margin: 0 auto
  }

  .wxManage1 .handle {
    width: 100%;
    height: 1rem;
    background-color: #fff;
    border-top: 1px solid #ebebeb;
    position: fixed;
    bottom: 0;
    z-index: 9999999
  }

  .wxManage1 .handle li {
    width: 33.3333%;
    height: 100%;
    float: left
  }

  .wxManage1 .handle li div {
    width: 1.8rem;
    height: .6rem;
    line-height: .6rem;
    margin: .2rem auto;
    text-align: center;
    font-size: .26rem;
    border-radius: .05rem;
    color: #fff
  }

  .wxManage1 .bangd, .wxManage1 .edit {
    width: 1rem;
    height: .5rem;
    text-align: center;
    line-height: .5rem;
    border-radius: .05rem;
    font-size: .24rem;
    border: 1px solid #3eb378;
    color: #3eb378;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .wxManage1 .bangd .edit_div, .wxManage1 .edit .edit_div {
    width: 100%;
    height: 100%;
    text-indent: 0;
    text-align: center
  }

  .wxManage1 .bangd img, .wxManage1 .edit img {
    width: .16rem;
    height: .09rem;
    position: absolute;
    right: .1rem;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .wxManage1 .bangd {
    width: 1.5rem
  }

  .wxManage1 .Popup {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, .2)
  }

  .wxManage1 .Popup .menu {
    position: absolute;
    top: .6rem;
    right: 0;
    background-color: #fff;
    width: 1.25rem;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 #bbb
  }

  .wxManage1 .Popup .menu li {
    width: 100%;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    font-size: .24rem;
    color: #555;
    border-bottom: 1px solid #f8f8f8
  }

  .wxManage1 .Popup .menu li:last-child {
    border: none
  }

  .Sign .signdiv {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 10000000000000000
  }

  .Sign .signdiv .inputBox {
    width: 100%;
    height: auto;
    padding-top: 1.5rem
  }

  .Sign .signdiv .inputBox .input_ {
    width: 80%;
    height: .8rem;
    margin: .3rem auto
  }

  .Sign .signdiv .inputBox .input_ input {
    width: 100%;
    height: 100%;
    font-size: .2rem;
    display: block;
    border: none;
    outline: none;
    border: 1px solid #ccc;
    border-radius: .1rem;
    text-indent: .2rem;
    padding: 0;
    margin: 0
  }

  .Sign .signdiv .inputBox .short {
    width: 28%;
    height: 100%;
    line-height: .8rem;
    font-size: .2rem;
    text-align: center;
    float: right;
    border-radius: .1rem;
    border: 1px solid #ccc
  }

  .Sign .signdiv .inputBox .register {
    width: 80%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: #83ca4e;
    font-size: .3rem;
    margin: .5rem auto;
    border-radius: .1rem
  }

  .Sign .signdiv .inputBox .tips {
    font-size: .3rem;
    width: 80%;
    margin: 0 auto;
    text-align: left;
    color: #a9a8a8
  }

  .Sign .verification {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 10000000000000000
  }

  .Sign .verification iframe {
    margin-top: 1.5rem
  }

  .Sign .verification .confirm {
    width: 95%;
    height: auto;
    padding: .2rem 0;
    margin: 0 auto;
    position: relative;
    top: -.6rem;
    background-color: #fff;
    border-radius: .1rem
  }

  .Sign .verification .confirm div {
    width: 50%;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    color: #fff;
    border: 1px solid #fff;
    font-size: .2rem;
    border-radius: .1rem;
    background: #83ca4e;
    margin: 0 auto;
    cursor: pointer
  }

  .my {
    width: 100%;
    height: auto;
    background: #fff
  }

  .my [class*=van-hairline]:after {
    border: none !important
  }

  .my .Smectite {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999999
  }

  .my .Smectite, .my .Smectite img {
    width: 100%;
    height: 100%
  }

  .my .Smectite div {
    position: absolute;
    right: 0;
    left: .1rem;
    top: 4.5rem;
    width: 50%;
    height: 1.5rem;
    margin: auto
  }

  .my .ProgOP {
    background: none
  }

  .my .van-progress__portion {
    color: #2b993b
  }

  .my .character {
    width: .48rem;
    height: .35rem
  }

  .my .ADD {
    width: .36rem;
    height: .36rem
  }

  .my .Popup {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, .4)
  }

  .my .Popup .menu {
    position: absolute;
    top: 1.2rem;
    right: .2rem;
    background-color: #fff;
    width: 3rem;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 #bbb
  }

  .my .Popup .menu .sj {
    position: absolute;
    top: -.2rem;
    right: .2rem
  }

  .my .Popup .menu li {
    width: 90%;
    margin: 0 auto;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size: .28rem;
    color: #555;
    border-bottom: 1px solid #e3e3e3
  }

  .my .Popup .menu li img {
    width: .32rem;
    margin: 0 .2rem 0 .5rem;
    position: relative;
    top: .1rem;
    right: .2rem
  }

  .my .Popup .menu li:last-child {
    border: none
  }

  .my .TOPinformation {
    width: 100%;
    height: 3.33rem;
    background: url(data:image/png;base64,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) no-repeat;
    background-size: 100%;
    position: relative;
    padding-top: 1.08rem
  }

  .my .TOPinformation .banben {
    width: 1.5rem;
    height: .4rem;
    line-height: .4rem;
    text-align: center;
    color: #fff;
    font-size: .24rem;
    border-radius: .3rem;
    background: #ff9249;
    margin: .5rem auto 0
  }

  .my .TOPinformation .img_div {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    border: 3px solid #fff;
    background: #fff;
    margin: 0 auto;
    position: relative;
    top: .25rem;
    overflow: hidden
  }

  .my .TOPinformation .img_div img {
    width: 100%;
    height: 100%
  }

  .my .TOPinformation .name {
    font-size: .34rem;
    color: #232323;
    margin: .1rem auto;
    text-align: center
  }

  .my .TOPinformation .validity {
    color: #999;
    font-size: .25rem;
    text-align: center
  }

  .my .TOPinformation .Edition {
    position: absolute;
    right: .4rem;
    top: .7rem;
    width: 1.45rem;
    height: .5rem;
    line-height: .5rem;
    font-size: .18rem;
    color: #fff;
    text-align: center;
    background: #ff9249;
    box-shadow: 0 3px 7px 0 hsla(0, 0%, 81%, .85);
    border-radius: .05rem 0 0 .08rem
  }

  .my .content {
    width: 90%;
    height: auto;
    margin: .5rem auto;
    box-shadow: 3px -1px 15px 1px hsla(0, 0%, 56%, .22);
    border-radius: 10px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    overflow: hidden
  }

  .my .content li {
    width: 33.33%;
    height: 2rem;
    color: #666;
    font-size: .28rem;
    text-align: left
  }

  .my .content li .center {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center
  }

  .my .content li .center .icon {
    width: .5rem;
    height: .5rem;
    display: block;
    margin: 0 auto
  }

  .my .content li .center i {
    font-size: .22rem;
    color: #1b1b1b;
    text-align: center;
    padding-top: .27rem
  }

  .my .content li .center .right_icon {
    width: .13rem;
    height: .22rem;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto
  }

  .scan {
    background: rgba(0, 0, 0, .4);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 9999
  }

  .scan .clorsICON {
    width: .36rem;
    height: .36rem;
    position: fixed;
    top: .3rem;
    left: .2rem
  }

  .scan .out_id {
    width: 2.5rem;
    height: .8rem;
    line-height: .8rem;
    background: #737573;
    margin: .5rem auto 0
  }

  .scan .bind, .scan .out_id {
    color: #fff;
    text-align: center;
    border-radius: .1rem;
    cursor: pointer
  }

  .scan .bind {
    width: 1.8rem;
    height: .6rem;
    line-height: .6rem;
    background: #09bb07;
    font-size: .2rem;
    position: absolute;
    right: .2rem;
    top: .2rem
  }

  .scan .QRdiv {
    width: 90%;
    height: 7.5rem;
    text-align: center;
    font-size: .28rem;
    color: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto
  }

  .scan .QRdiv .qrLIST .Reset {
    width: 2rem;
    height: .8rem;
    line-height: .8rem;
    font-size: .3rem;
    text-align: center;
    border: 1px solid #fff;
    border-radius: .2rem;
    margin: 0 auto .5rem;
    cursor: pointer
  }

  .scan .QRdiv img {
    width: 3rem;
    height: 3rem;
    display: block;
    margin: 0 auto
  }

  .scan .qrLIST:last-child {
    padding-bottom: 1rem
  }

  .home_toptxt {
    width: 100%;
    height: 2rem;
    position: relative
  }

  .home_table .homepath {
    color: #1b1b1b;
    background: #fff
  }

  .home_Center {
    background: #fff;
    background-image: url(data:image/png;base64,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OwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJA9TeNgAAAOwSURBVCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAACQgHAHAIAEhDsAACQg3AEAIAHhDgAACQh3AABIQLgDAEACwh0AABIQ7gAAkIBwBwCABIQ7AAAkINwBACAB4Q4AAAkIdwAASEC4AwBAAsIdAAASEO4AAJCAcAcAgASEOwAAJCDcAQAgAeEOAAAJCHcAAEhAuAMAQALCHQAAEhDuAAAwdE3T/H88D0Cg/8Dn5gAAAABJRU5ErkJggg==);
    background-size: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10
  }

  .home_Center .home_toptxt > p {
    font-size: .26rem;
    color: #fff;
    text-align: left;
    padding: .15rem 0 0 .7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 60%
  }

  .home_Center .home_toptxt p:first-child {
    padding-top: .7rem
  }
</style>
