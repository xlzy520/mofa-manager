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
  import {Dialog} from "vant";

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
        return dayjs().isBefore(dayjs(item.expire_time)) && (item.wx_status === 4 || item.wx_status === 2)
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
        this.$router.push({path: '/bindCode', query: {id: item.id, type: 'renewal'}})
      },
      checkWxScanLogin(item){
        this.timer = setInterval(() => {
          commonApi.checkWxScanLogin({uuid: this.uuid}, { 'device-uuid': item.device_uuid}).then(res => {
            if (res) {
              this.clearTimer()
              this.$toast('扫码成功')
              this.popupShow = false
              this.getList()
            }
          })
        }, 5 * 1000)
      },
      getWxQrcode(item) {
        const loading = this.$toast.loading({
          message: "获取二维码中，请稍后...",
          forbidClick: true
        })

        commonApi.getWxQrcode({
          workId: item.id
        }, {
          'device-uuid': item.device_uuid
        }).then(res => {
          this.popupShow = true
          this.qrcode = res.QrUrl2
          this.uuid = res.Uuid
          // this.name = item.wx_nick_name
          this.checkWxScanLogin(item)
        }).finally(() => {
          loading.close()
        })
      },
      toScan(item){
        this.getWxQrcode(item)
        // this.$router.push({path: '/BindQRCode', query: {id: item.user_id}})
      },
      toRestart1(item){
        this.$toast.loading({
          duration: 2000,
          message: "已成功执行唤醒",
          forbidClick: true
        })
        commonApi.restart1({
          wxId: item.wx_user
        }, {
          'device-uuid': item.device_uuid
        }).then(res => {
          this.$toast('唤醒登录成功')
          this.getList()
        })
      },
      toRestart2(item){
        Dialog.alert({
          title: "提示",
          message: '强制重启，准备跳转重新扫码。',
          confirmButtonColor: '#3d80fc',
        }).then(()=> {
          commonApi.restart2({
            wxId: item.wx_user
          }, {
            'device-uuid': item.device_uuid
          }).then(res => {
            this.$toast('强制重启成功')
            this.popupShow = true
            this.qrcode = res.QrUrl2
            this.uuid = res.Uuid
            // this.name = item.wx_nick_name
            this.checkWxScanLogin()
          })
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
      clearTimer(){
        clearInterval(this.timer)
        this.timer = null
      },
      close (){
        this.popupShow = false
        this.clearTimer()
      },
    },
    mounted() {
      this.getList(true)
    },
    beforeDestroy() {
      this.clearTimer()
    }
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
    background-image: url('/login_bg.png');
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
    background-image: url(/login_bg.png);
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
