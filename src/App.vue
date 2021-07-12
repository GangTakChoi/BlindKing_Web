<template>
  <div id="app">
    <div id="nav">
      <div class="logo-wrap">
        <router-link to="/">
          <img alt="logo" src="./assets/img/new-logo4.png" class="logo_img">
        </router-link>
      </div>
      <div class="login-wrap">
        <div v-if="!$G.isLogin">
          <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal">
            로그인
          </button>
          <LoginModal/>
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
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import './assets/bootstrap-4.6.0/js/bootstrap.bundle.min.js'
import LoginModal from '@/components/LoginModal.vue'

export default {
  name: 'App',
  components: { LoginModal },
  data: () => {
    return {
      isMobile: Boolean,
      isHome: Boolean,
    }
  },
  methods: {
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
    windowWidthResize: function (event) {
      this.isMobile = window.innerWidth <= 768
    }
  },
  updated () {
    this.refreshIsHome()
  },
  created () {
    this.refreshIsHome()
    this.windowWidthResize()

    // 로그인 확인 요청
    this.$http.get('/verify-token').then((response) => {
        if (response.status === 200) {
          this.$G.isLogin = true
        }
      }).catch((error) => {
        console.log(error);
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
body {
  // background: #efefef;
  // background: #e2e2e2;
  background: #f0f0f0;
}

#nav {
  background-color: #fff;
  box-shadow: 0px -3px 12px;
}

.logo-wrap {
  height: 66px;
  padding-left: 20px;
  display:inline-block;
}

.logo_img {
  width: 210px;
  margin-top: 11px;
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
    bottom: 10px;
    left: 10px;
    margin: 10px;
    width: 120px;
    height: 120px;
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
    width: 35px; /* 사이즈 */
    height: 35px; /* 사이즈 */
    border-top: 1px solid #121212; /* 선 두께 */
    border-right: 1px solid #121212; /* 선 두께 */
    display: inline-block;
    transform: rotate(225deg); /* 각도 */
    position: absolute;
    top: 40px; /* 기본 0px 값으로 해주세요 */
    left: 49px; /* 기본 0px 값으로 해주세요 */
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
