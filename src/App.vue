<template>
  <div id="app">
    <div id="nav" class="shadow-sm">
      <div class="logo-wrap">
        <router-link to="/">
          <img alt="logo" src="./assets/img/new-logo2.png" class="logo_img">
        </router-link>
      </div>
      <div class="login-wrap">
        <div v-if="!$G.isLogin">
          <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal">
            로그인
          </button>
          <LoginModal @loginSuccess="chattingAlimSocketConnect"/>
        </div>
        <div v-else>
          <button type="button" class="btn btn-dark" @click="logout">
            로그아웃
          </button>
        </div>
      </div>
    </div>
    <div class="main-container">
      <div v-if="!isMobile && !isHome" class="go-back" @click="goBack">
      </div>
      <router-view/>
    </div>
    <ToastPopup :nickname="alimInfo.nickname" :message="alimInfo.message"/>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import './assets/bootstrap-4.6.0/js/bootstrap.bundle.min.js'
import LoginModal from '@/components/LoginModal.vue'
import ToastPopup from '@/components/ToastPopup.vue'
import io from '@/assets/js/socket.io.js'
import $ from 'jquery'

export default {
  name: 'App',
  components: { LoginModal, ToastPopup },
  data: () => {
    return {
      isHome: Boolean,
      socket: Object,
      alimInfo: {
        nickname: 'test',
        message: 'test',
      }
    }
  },
  methods: {
    chattingAlimSocketConnect: function () {
      this.socket = io('/chatting-alim')

      const TOKEN = VueCookies.get('token');

      this.socket.emit('alimRoomOpen', TOKEN)

      let that = this

      this.socket.on('messageAlim', function (alimInfo) {
        if (that.$route.name === 'ChattingRoom' 
          && that.$route.params.friendObjectId === alimInfo.friendObjectId) {
            return
          }
        that.alimInfo.nickname = alimInfo.nickname
        that.alimInfo.message = alimInfo.message

        let option = {
          // 알림메세지 떠 있는 시간
          delay: 5000
        }
        $('.toast').toast(option)
        $('.toast').toast('show')
      })
    },
    logout: function () {
      VueCookies.remove('token')
      alert('로그아웃 완료')
      window.location.href = "/"
    },
    goBack: function () {
      history.back()
    },
    refreshIsHome: function () {
      this.isHome = window.location.pathname === "/" ? true : false
    },
  },
  updated () {
    this.refreshIsHome()
  },
  async created () {
    this.refreshIsHome()

    // 로그인 확인 요청
    this.$http.get('/verify-token').then((response) => {
        if (response.status !== 200) return
        this.$G.isLogin = true
        this.chattingAlimSocketConnect()
      }).catch((error) => {
        console.log(error)
      })

    // 뒤로가기 이벤트 발생시
    window.onpopstate = function(event) {
      let today = new Date();   

      localStorage.setItem("뒤로가기발생시간", today.getTime())
    };
  },
  mounted () {
    window.addEventListener('resize', this.windowWidthResize);
  }
}
</script>

<style lang="scss">
@import "./assets/css/common.css";
@import "./assets/bootstrap-4.6.0/css/bootstrap.min.css";
@import "./assets/css/ckeditor5.css";

body {
  // background: #efefef;
  // background: #e2e2e2;
  background: #eeeef1;
  // background: #f0f0f0;
  font-size: 16px;
}

@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}

#nav {
  background-color: #fff;
  // box-shadow: 0px -3px 12px;
  // box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}

.logo-wrap {
  height: 66px;
  display:inline-block;
}

.logo_img {
  width: 180px;
  margin-top: 17px;
  margin-left: 15px;
}

.menu-list {
  display: inline-block;
}

.login-wrap {
  float: right;
  margin: 14px 19px;
}

.login-button {
  font-size: 14px;
}

@media (max-width: 768px) {
  // .go-back {
  //   border: 0px solid #000;
  //   background-color: #fff;
  //   width: 100%;
  //   height: 50px;
  // }
}

@media (min-width: 768px) {
  .go-back {
    position: fixed;
    border: 1px solid #000;
    bottom: 30px;
    left: 15px;
    margin: 10px;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    transition-duration: 0.3s;
    background: #fff;
  }

  .go-back:hover {
    cursor: pointer;
    background-color: black;
  }

  .go-back:hover::after {
    cursor: pointer;
    border-top: 1px solid #fff; /* 선 두께 */
    border-right: 1px solid #fff; /* 선 두께 */
  }

  .go-back::after {
    cursor: pointer;
    content: '';
    width: 20px; /* 사이즈 */
    height: 20px; /* 사이즈 */
    border-top: 1px solid #121212; /* 선 두께 */
    border-right: 1px solid #121212; /* 선 두께 */
    display: inline-block;
    transform: rotate(225deg); /* 각도 */
    position: absolute;
    top: 30px; /* 기본 0px 값으로 해주세요 */
    left: 35px; /* 기본 0px 값으로 해주세요 */
    transition-duration: 0.3s;
  }
}


@media (max-width: 768px) {
  .logo_img {
    width: 188px;
    margin-top: 16px;
  }
}
</style>
