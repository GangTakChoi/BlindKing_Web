<template>
  <div class="content-container">
    <div class="d-flex justify-content-center" v-if="!isResponseComplete" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="search-wrap shadow-sm" v-if="isResponseComplete">
      <div class="line-wrap">
        <label class="custom-label" for="inlineFormCustomSelectPref">지역</label>
        <select class="custom-select" id="inlineFormCustomSelectPref">
          <option selected>무관</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      
      <div class="line-wrap">
        <label class="custom-label" for="inlineFormCustomSelectPref">MBTI</label>
        <select class="custom-select" id="inlineFormCustomSelectPref">
          <option selected>무관</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="line-wrap">
        <label class="custom-label" for="inlineFormCustomSelectPref">나이</label>
        <select class="custom-select age-select" id="inlineFormCustomSelectPref">
          <option selected>무관</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
        ~
        <select class="custom-select age-select" id="inlineFormCustomSelectPref">
          <option selected>무관</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <button type="submit" class="btn btn-info btn-block search-button">검색</button>
    </div>
    <div class="card-container">
      <div class="partner-card" v-for="(partnerInfo, key) in matchingPartnerList" :key="key">
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">닉네임</th>
              <th scope="col">나이</th>
              <th scope="col">MBTI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">{{ partnerInfo.nickname }}</td>
              <td>{{ partnerInfo.birthYear === 0 ? "?" : getAge(partnerInfo.birthYear) }}</td>
              <td>{{ partnerInfo.mbti === "unkown" ? "?" : partnerInfo.mbti }}</td>
            </tr>
          </tbody>
        </table>
        <template v-for="(questionInfo, index) in partnerInfo.questionList">
          <div v-if="questionInfo.answer.trim()" class="partner-card-body" :key="index">
            <div class="question-section">{{ questionInfo.questionId.content }}</div>
            <pre class="answer-section">{{ questionInfo.answer }}</pre>
          </div>
        </template>
        <div class="detail-btn-blank"></div>
        <router-link :to="getDetailLink(partnerInfo._id)">
          <button type="submit" class="btn btn-primary btn-lg btn-block detail-btn">자세히 보기</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Matching',
  data: () => {
    return {
      isShowRegionSelectBox: false,
      isResponseComplete: false,
      matchingPartnerList: [],
      getAge: (birthYear) => {
        var now = new Date();	// 현재 날짜 및 시간
        return now.getFullYear() - birthYear + 1;
      },
      getDetailLink: (userId) => {
        return "/matching/detail/" + userId
      }
    }
  },
  async created () {
    let today = new Date()
    let nowTimestamp = today.getTime()
    let backTimestamp = Number(localStorage.getItem("뒤로가기발생시간"))
    let savedData = localStorage.getItem(this.$route.name)

    // 현재 타임스탬프와 뒤로가기 시점의 타임스탬프 차이가 100ms 이하라면 뒤로가기 페이지로 판단
    if ( ( nowTimestamp - backTimestamp ) <= 100 && savedData !== null) {
      Object.assign(this.$data, JSON.parse(savedData))
      this.isResponseComplete = true
    } else {
      let response = await this.$http.get('/user/maching-partners')
      this.matchingPartnerList = response.data
    }
    
    this.isResponseComplete = true
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem(this.$route.name, JSON.stringify(this.$data));
    next()
  }
}
</script>

<style lang="scss" scoped>
.search-button {
  margin-top: 15px;
  font-size: 18px;
}
.line-wrap:not(:first-child) {
  margin-top: 15px;
}
.custom-label {
  display: inline-block;
  width: 50px;
  margin-right: 15px;
}
.custom-select {
  vertical-align: baseline;
  display: inline-block;
  width: 200px;
}
.region-select-box {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 10px;
}
.region-select-button {
  cursor: pointer;
  background-color: #000;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: white;
}
.search-wrap {
  background-color: #fff;
  border-radius: 6px;
  padding: 18px 12px 14px 12px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #bdbdbd;
}
.detail-btn {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: calc(100% - 20px);
  margin-top: 15px;
}
.detail-btn-blank {
  height: 60px;
}
.card-container {
  display: flex;
  flex-wrap : wrap;
  justify-content: space-between;
  flex-direction: row;
}
.partner-card {
  position: relative;
  display: inline-block;
  margin-bottom: 7px;
  width: 33%;
  padding: 10px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0px 1px 5px -2px;
}
.table {
  text-align: center;
  margin-bottom: 21px;
}
.question-section {
  font-weight: bold;
  margin-bottom: 10px;
}
.answer-section {
  white-space: pre-wrap;
  word-break: break-all;
  background-color:#f9f9f9;
  border: 1px solid #d8d6d6;
  padding: 10px;
}

@media (max-width: 1200px) {
  .partner-card {
    margin-bottom: 10px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .age-select {
    width: 30%;
  }
}
</style>