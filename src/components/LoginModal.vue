<template>
  <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">로그인</h5>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form name="loginForm">
              <div class="form-group">
                <label for="inputId">아이디</label>
                <input type="text" class="form-control" id="inputId" @keyup.enter="login" v-model="inputId">
              </div>
              <div class="form-group">
                <label for="inputPw">비밀번호</label>
                <input type="password" class="form-control" id="inputPw" @keyup.enter="login" v-model="inputPw">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="login">로그인</button>
            <router-link to="/signup">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">회원가입</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "LoginModal",
  data: () => {
    return {
      inputId: '',
      inputPw: ''
    }
  },
  methods: {
    login: function () {
      let reqBody = {
        id : this.inputId,
        pw : this.inputPw
      }
      this.$http.post('/user/login', reqBody).then((response) => {
        if (response.status === 201) {
          alert('로그인 성공')
          this.$global.isLogin = true
          this.$emit('loginSuccess')
          $('#close').trigger('click')
          this.$router.push('/');
        }
      }).catch((error) => {
        alert(error.response.data.errorMessage)
        console.log(error);
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  .modal-footer {
    justify-content: center !important;
  }
  .modal-body {
    padding: 26px 20px !important;
  }
  .modal-body .form-group:last-child {
    margin-bottom: 0;
  }
  .form-group input {
    display: inline-block;
    width: calc(100% - 90px);
  }
  .form-group label {
    min-width: 90px;
  }
</style>
