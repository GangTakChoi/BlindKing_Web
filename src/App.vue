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
  methods: {
    logout: function () {
      VueCookies.remove('token')
      alert('로그아웃 완료')
      window.location.href = "/"
    }
  },
  created () {
    // 로그인 확인 요청
    this.$http.get('/verify-token').then((response) => {
        if (response.status === 200) {
          this.$G.isLogin = true
        }
      }).catch((error) => {
        console.log(error);
      })
  }
}
</script>

<style lang="scss">
@import "./assets/css/common.css";
@import "./assets/bootstrap-4.6.0/css/bootstrap.min.css";
body {
  // background: #efefef;
  background: #e2e2e2;
  // background: #f0f0f0;
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
  .logo_img {
    width: 188px;
    margin-top: 16px;
  }
}
</style>
