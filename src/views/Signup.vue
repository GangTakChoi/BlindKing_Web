<template>
  <div class="content-container">
    <form @submit.prevent="signUp">
      <div class="form-input-wrap">
        <div class="form-group">
          <label for="inputID">아이디</label>
          <div>
              <input type="text" class="form-control" id="inputId" v-model="id"> 
              <button type="button" class="btn btn-primary id-confirm-btn">중복확인</button>
          </div>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" class="form-control" id="inputPassword" v-model="pw">
        </div>
        <div class="form-group">
          <label for="passwordRepeat">비밀번호 확인</label>
          <input type="password" class="form-control" id="inputPasswordRepeat" v-model="pwRepeat">
        </div>
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <div>
              <input type="text" class="form-control" id="inputNickname" v-model="nickname"> 
              <button type="button" class="btn btn-primary id-confirm-btn">중복확인</button>
          </div>
        </div>
        <div class="btn-group btn-group-toggle gender-options-box" data-toggle="buttons">
          <label class="btn btn-secondary male-option active">
            <input type="radio" name="genderOptions" id="male" value="male" checked v-model="gender"> 남성
          </label>
          <label class="btn btn-secondary female-option">
            <input type="radio" name="genderOptions" id="female" value="female" v-model="gender"> 여성
          </label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block complete-btn">가입완료</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data: () => {
    return {
      id: '',
      pw: '',
      pwRepeat: '',
      nickname: '',
      gender: 'male'
    }
  },
  methods: {
    signUp : function () {
      let reqBody = {
        id: this.id,
        pw: this.pw,
        nickname: this.nickname,
        gender: this.gender === 'male' ? true : false // true: 남성, false: 여성
      }

      // 회원가입 요청
      this.$http.post('/user', reqBody).then((response) => {
        if (response.status === 201) {
          alert('회원가입이 완료되었습니다!')
        }
      }).catch((error) => {
        alert('회원가입이 실패하였습니다.')
        console.log(error);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#inputId, #inputNickname {
  display: inline-block;
  width: calc(100% - 100px);
  margin-right: 10px;
}
.id-confirm-btn {
  vertical-align: baseline;
}
.complete-btn {
  margin: 30px auto 0 auto;
}
@media (min-width: 768px) {
  .form-input-wrap {
    border-left: 6px solid #000;
    padding-left: 28px;
  }
}
.male-option.active {
  border-color: rgb(95, 95, 255) !important;
  background-color: rgb(95, 95, 255)  !important;
  outline: none;
}

.female-option.active {
  border-color: rgb(255, 105, 105) !important;
  background-color: rgb(255, 105, 105) !important;
  outline: none;
}
.gender-options-box {
  margin-top:12px;
}
</style>
