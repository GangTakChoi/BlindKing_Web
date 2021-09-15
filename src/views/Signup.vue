<template>
  <div class="content-container">
    <form @submit.prevent="signUp">
      <div class="form-input-wrap">
        <div class="form-group">
          <label for="inputID">아이디</label>
          <div>
            <input type="text" :class="{ 'is-valid': validInfo.id.isValid, 'is-invalid': validInfo.id.isInvalid }" class="form-control" id="inputId" v-model="id"> 
            <button type="button" class="btn btn-primary id-confirm-btn" @click="checkId">중복확인</button>
            <div class="valid-feedback">
              사용가능한 아이디입니다.
            </div>
            <div class="invalid-feedback">
              사용할 수 없는 아이디입니다.
            </div>
            <small id="inpuIdHelp" class="form-text text-muted">영문자, 숫자로만 구성할 수 있습니다. (4~26자 제한)</small>
          </div>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" 
          :class="{ 'is-valid': validInfo.pw.isValid, 'is-invalid': validInfo.pw.isInvalid }" 
          class="form-control" 
          id="inputPassword" 
          v-model="pw"
          @focusout="checkPw">
          <div class="invalid-feedback">
            길이 제한 범위에 맞춰주세요.
          </div>
          <small id="inputPasswordHelp" class="form-text text-muted">길이 6~36자 제한</small>
        </div>
        
        <div class="form-group">
          <label for="passwordRepeat">비밀번호 확인</label>
          <input type="password" 
          :class="{ 'is-valid': validInfo.pwRepeat.isValid, 'is-invalid': validInfo.pwRepeat.isInvalid }" 
          class="form-control" id="inputPasswordRepeat" v-model="pwRepeat">
          <div class="valid-feedback">
            일치합니다!
          </div>
          <div class="invalid-feedback">
            일치하지 않습니다.
          </div>
        </div>
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <div>
              <input type="text" 
              :class="{ 'is-valid': validInfo.nickname.isValid, 'is-invalid': validInfo.nickname.isInvalid }" 
              class="form-control" id="inputNickname" v-model="nickname"> 
              <button type="button" class="btn btn-primary id-confirm-btn" @click="checkNickname">중복확인</button>
              <div class="valid-feedback">
                사용가능한 닉네임입니다.
              </div>
              <div class="invalid-feedback">
                중복된 닉네임입니다.
              </div>
              <small id="inputNicknameHelp" class="form-text text-muted">
                닉네임은 추후 수정이 <span style="color:red;">불가능</span>합니다.
                (16자 이내)
              </small>
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
      gender: 'male',
      validInfo: {
        id: {
          isValid: false,
          isInvalid: false,
        },
        pw: {
          isValid: false,
          isInvalid: false,
        },
        pwRepeat: {
          isValid: false,
          isInvalid: false,
        },
        nickname: {
          isValid: false,
          isInvalid: false,
        },
      },
    }
  },
  watch: {
    pwRepeat: function (val) {
      if (val === this.pw) {
        this.validInfo.pwRepeat.isValid = true
        this.validInfo.pwRepeat.isInvalid = false
      } else {
        this.validInfo.pwRepeat.isValid = false
        this.validInfo.pwRepeat.isInvalid = true
      }
    },
    pw: function (val) {
      if (this.pwRepeat.length === 0) return

      if (val === this.pwRepeat) {
        this.validInfo.pwRepeat.isValid = true
        this.validInfo.pwRepeat.isInvalid = false
      } else {
        this.validInfo.pwRepeat.isValid = false
        this.validInfo.pwRepeat.isInvalid = true
      }
    }
  },
  methods: {
    signUp : function () {
      let reqBody = {
        id: this.id,
        pw: this.pw,
        pwRepeat: this.pwRepeat,
        nickname: this.nickname,
        gender: this.gender,
      }

      // 회원가입 요청
      this.$http.post('/user', reqBody).then((response) => {
        if (response.status === 201) {
          alert('회원가입이 완료되었습니다!')
          this.$router.push('/');
        }
      }).catch((error) => {
        alert(error.response.data.errorMessage)
        console.log(error);
      })
    },
    checkPw: function () {
      if (this.pw.length === 0) {
        return
      }

      if (this.pw.length < 6 || this.pw.length > 36) {
        this.validInfo.pw.isInvalid = true
        this.validInfo.pw.isValid = false
      } else {
        this.validInfo.pw.isInvalid = false
        this.validInfo.pw.isValid = true
      }
    },
    checkNickname: function () {
      if (this.nickname.trim().length <= 0) {
        alert('닉네임을 입력해주세요.')
        return
      }
      if(this.nickname.length > 16) {
        alert('닉네임 길이 제한은 16자 이하입니다.')
        return
      }
      
      this.$http.get('/user/nickname/duplicate-check/' + this.nickname)
      .then((response) => {
        if (response.data.isCanUse) {
          alert('사용 가능한 닉네임입니다.')
          this.validInfo.nickname.isValid = true
          this.validInfo.nickname.isInvalid = false
        } else {
          alert('중복된 닉네임입니다.')
          this.validInfo.nickname.isValid = false
          this.validInfo.nickname.isInvalid = true
        }
      })
    },
    checkId: function () {
      if (this.id === '') {
        alert('아이디를 입력해주세요.')
        return
      }

      let idValiddation = /^[a-zA-Z0-9]*$/;

      if (!idValiddation.test(this.id)) {
        alert('아이디는 영문자+숫자로만 구성 할 수 있습니다.')
        this.validInfo.id.isValid = false
        this.validInfo.id.isInvalid = true
        return
      }

      if (this.id.length < 4 || this.id.length > 26) {
        alert('아이디는 4~26자로 제한됩니다.')
        this.validInfo.id.isValid = false
        this.validInfo.id.isInvalid = true
        return
      }

      this.$http.get('/user/id/duplicate-check/' + this.id)
      .then((response) => {
        if (response.data.isCanUse) {
          alert('사용 가능한 아이디입니다.')
          this.validInfo.id.isValid = true
          this.validInfo.id.isInvalid = false
        } else {
          alert('중복된 아이디입니다.')
          this.validInfo.id.isValid = false
          this.validInfo.id.isInvalid = true
        }
      })
    },
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
