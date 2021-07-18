<template>
  <div class="content-container">
    <div class="d-flex justify-content-center" v-if="!isResponseComplete" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <form @submit.prevent="saveSelfIntroduce" v-if="isResponseComplete">
      <div class="form-group">
        <label for="exampleFormControlSelect1">출생년도</label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="birthYear">
          <option v-for="year, key in getYears()" :key="key">{{ year }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect1">MBTI <a href="https://www.16personalities.com/ko/%EB%AC%B4%EB%A3%8C-%EC%84%B1%EA%B2%A9-%EC%9C%A0%ED%98%95-%EA%B2%80%EC%82%AC" target="_blank">성격유형검사↗️</a></label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="mbti">
          <option value="">모르겠어요</option>
          <option value="ISTJ">ISTJ</option>
          <option value="ISFJ">ISFJ</option>
          <option value="INFJ">INFJ</option>
          <option value="INTJ">INTJ</option>
          <option value="ISTP">ISTP</option>
          <option value="ISFP">ISFP</option>
          <option value="INFP">INFP</option>
          <option value="INTP">INTP</option>
          <option value="ESTP">ESTP</option>
          <option value="ESFP">ESFP</option>
          <option value="ENFP">ENFP</option>
          <option value="ENTP">ENTP</option>
          <option value="ESTJ">ESTJ</option>
          <option value="ESFJ">ESFJ</option>
          <option value="ENFJ">ENFJ</option>
          <option value="ENTJ">ENTJ</option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlInput1">자신과 성격이 닮은 동물은?</label>
        <input type="text" class="form-control" id="question1" v-model="question1">
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">위와 같이 생각하는 이유는 무엇인가요?</label>
        <textarea class="form-control" id="question2" rows="3" v-model="question2"></textarea>
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">선호하는 스트레스 해소법은?</label>
        <textarea class="form-control" id="question3" rows="3" v-model="question3"></textarea>
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">본인은 좋아하는 이성에게 어떻게 행동하나요?</label>
        <textarea class="form-control" id="question4" rows="3" v-model="question4"></textarea>
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">만약 연인이 생긴다면 가고 싶은 곳이나 하고 싶은 것은 무엇이 있나요?</label>
        <textarea class="form-control" id="question5" rows="3" v-model="question5"></textarea>
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">왜 연애를 하려고 하나요?</label>
        <textarea class="form-control" id="question6" rows="3" v-model="question6"></textarea>
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">그 외 본인의 상태나 상황, 자신에 대한 솔직한 얘기를 마음 것 적어보세요.</label>
        <textarea class="form-control" id="question7" rows="3" v-model="question7"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block complete-btn">작성완료</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SelfIntroduction',
  data: () => {
    return {
      isResponseComplete: false,
      birthYear: 0,
      mbti: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      question5: '',
      question6: '',
      question7: '',
      getYears: () => {
        var now = new Date();	// 현재 날짜 및 시간
        var year = now.getFullYear() - 18;	// 올해 성년 출생년도
        let list = [];
        for (let i = 1910; i < year; i += 1) list.push(i);
        return list
      },
    }
  },
  methods: {
    saveSelfIntroduce: function () {
      let reqBody = {
        birthYear: this.birthYear,
        mbti: this.mbti,
        question1: this.question1,
        question2: this.question2,
        question3: this.question3,
        question4: this.question4,
        question5: this.question5,
        question6: this.question6,
        question7: this.question7,
      }
      // 회원가입 요청
      this.$http.post('/user/self-introduction', reqBody).then((response) => {
        if (response.status === 200) {
          alert('자기소개서가 저장되었습니다!')
        }
      }).catch((error) => {
        alert('죄송합니다. 자기소개 작성이 실패하였습니다.')
        console.log(error);
      })
    }
  },
  created () {
    this.$http.get('/user/me').then((response) => {
        if (response.status === 200) {
          let userInfo = response.data
          this.birthYear = userInfo.birthYear
          this.mbti = userInfo.mbti
          this.question1 = userInfo.question1
          this.question2 = userInfo.question2
          this.question3 = userInfo.question3
          this.question4 = userInfo.question4
          this.question5 = userInfo.question5
          this.question6 = userInfo.question6
          this.question7 = userInfo.question7
          this.isResponseComplete = true
        }
      }).catch((error) => {
        console.log(error);
      })
  }
}
</script>

<style lang="scss" scoped>
.complete-btn {
  margin-top: 30px;
}
</style>