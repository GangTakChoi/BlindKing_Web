<template>
  <div id="app">
    <div v-show="isShowNav" id="nav" class="shadow-sm">

      <div class="logo-wrap" v-if="!($global.isMobile && !isHome)" >
        <img  @click="$router.push('/');" alt="logo" src="./assets/img/BlindKing2.png" class="logo_img">
      </div>

      <div class="page-move-button-wrap" v-else>
        <img @click="goBack" src="./assets/img/arrow-left-circle.svg">
        <img @click="$router.push('/');" src="./assets/img/house.svg">
      </div>

      <div class="login-wrap">
        <div v-if="!$global.isLogin">
          <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#loginModal">
            로그인
          </button>
        </div>
        <div v-else>
          <button type="button" class="btn btn-dark" @click="logout">
            로그아웃
          </button>
        </div>
      </div>
    </div>

    <div v-if="$global.isMobile" class="nav-blank"></div>

    <div class="main-container">
      <div v-if="!$global.isMobile && !isHome" class="go-back" @click="goBack">
      </div>
      <router-view/>
    </div>
    <ToastPopup :nickname="alimInfo.nickname" :message="alimInfo.message"/>
    <LoginModal @loginSuccess="chattingAlimSocketConnect"/>
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
      socket: Object,
      alimInfo: {
        nickname: '',
        message: '',
      }
    }
  },
  computed: {
    isShowNav: function () {
      if (!this.$global.isMobile) return true

      if (this.$route.name === 'ChattingRoom') return false

      return true
    },
    isHome: function () {
      return this.$route.name === 'Home' ? true : false
    },
  },
  methods: {
    chattingAlimSocketConnect: function () {
      this.socket = io(process.env.VUE_APP_BASE_API_HOST + '/chatting-alim')

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
      if (!confirm('로그아웃 하시겠습니까?')) return
      VueCookies.remove('token')

      if (this.$route.name === 'Community'
      || this.$route.name === 'CommunityView'
      || this.$route.name === 'Home') {
        location.reload()
        return
      }

      window.location.href = "/"
    },
    goBack: function () {
      history.back()
    },
  },
  async created () {
    if (process.env.VUE_APP_MODE === 'dev') console.log(`[mode:${process.env.VUE_APP_MODE}]`)
    

    this.$global.isMobile = window.innerWidth <= 768

    const TOKEN = VueCookies.get('token');

    if (TOKEN) {
      try {
        let response = await this.$http.get('/verify-token')
        
        if (response.status === 200) {
          this.$global.isLogin = true
          this.$global.isAdmin = response.data.userInfo.isAdmin
          this.$global.isActiveMatching = response.data.userInfo.isActiveMatching
          
          this.chattingAlimSocketConnect()
        }
      } catch (error) {
        alert(error.response.data.errorMessage)
        console.log(error)
      } finally {
        this.$global.isLoading = false
      }
    } else {
      this.$global.isLoading = false
    }
  },
}
</script>

<style lang="scss">
@import "./assets/bootstrap-4.6.0/css/bootstrap.min.css";
@import "./assets/css/common.css";
@import "./assets/css/ckeditor5.css";

#nav {
  background-color: #fff;
}

@media (max-width: 768px) {
  #nav {
    height: 65px;
    position: fixed;
    width: 100%;
    z-index: 9;
  }
  .nav-blank {
    height: 65px;
  }
}

.logo-wrap {
  height: 66px;
  display:inline-block;
  img {
    cursor: pointer;
  }
}

.logo_img {
  width: 180px;
  margin-top: -11px;
  margin-left: 2px;
}

.menu-list {
  display: inline-block;
}

.page-move-button-wrap {
  margin-left: 5px;
  display:inline-block;
  padding: 15px;
  img {
    width: 35px;
  }
  img:not(:last-child) {
    margin-right: 30px;
  }
}

.login-wrap {
  float: right;
  margin: 14px 19px;
}

@media (max-width: 768px) {
  .login-wrap {
    margin: 14px;
  }
}

.login-button {
  font-size: 14px;
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
    margin-top: -13px;
  }
}
</style>
