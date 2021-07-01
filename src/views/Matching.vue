<template>
  <div class="content-container">
    <div class="d-flex justify-content-center" v-if="!isResponseComplete" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="partner-card" v-for="(partnerInfo, key) in matchingPartnerList" :key="key">
      <!-- {{
        ' 닉네임: ' + partnerInfo.nickname
      }}
      <br>
      <template v-if="partnerInfo.birthYear !== 0">
        {{
          '나이: ' + getAge(partnerInfo.birthYear)
        }}
      </template>
      <br v-else> -->
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
            <td>{{ partnerInfo.mbti === "" ? "?" : partnerInfo.mbti }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="partnerInfo.question1.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 자신과 성격이 닮은 동물은?'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question1 }}</pre>
      </div>

      <div v-if="partnerInfo.question2.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 위와 같이 생각하는 이유는 무엇인가요?'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question2 }}</pre>
      </div>

      <div v-if="partnerInfo.question3.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 선호하는 스트레스 해소법은?'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question3 }}</pre>
      </div>
      <div v-if="partnerInfo.question4.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 본인은 좋아하는 이성에게 어떻게 행동하나요?'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question4 }}</pre>
      </div>
      <div v-if="partnerInfo.question5.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 만약 연인이 생긴다면 가고 싶은 곳이나 하고 싶은 것은 무엇이 있나요?'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question5 }}</pre>
      </div>
      <div v-if="partnerInfo.question6.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 왜 연애를 하려고 하나요?'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question6 }}</pre>
      </div>
      <div v-if="partnerInfo.question7.trim()" class="partner-card-body">
        <div class="question-section">
        {{
          'Q) 그 외 본인의 상태나 상황, 자신에 대한 솔직한 얘기를 마음 것 적어보세요.'
        }}
        </div>
        <pre class="answer-section">{{ partnerInfo.question7 }}</pre>
      </div>
      <div class="detail-btn-blank"></div>
      <router-link :to="getDetailLink(partnerInfo._id)">
        <button type="submit" class="btn btn-primary btn-lg btn-block detail-btn">자세히 보기</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Matching',
  data: () => {
    return {
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
    let response = await this.$http.get('/user/maching-partners')
    this.matchingPartnerList = response.data
    this.isResponseComplete = true
  }
}
</script>

<style lang="scss" scoped>
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
.content-container {
  display: flex;
  flex-wrap : wrap;
  justify-content: center;
}
.partner-card {
  position: relative;
  display: inline-block;
  margin: 5px;
  width: 30%;
  padding: 10px;
  //border: 1px solid #000;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0px 1px 5px -2px;
}
.table {
  text-align: center;
  margin-bottom: 21px;
}
.partner-card-body {
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

@media (max-width: 768px) {
  .partner-card {
    margin: 10px 0;
    width: 100%;
  }
}
</style>