<template>
  <div class="content-container">
    <div class="card">
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
            <td scope="row">{{ this.nickname }}</td>
            <td>{{ this.age }}</td>
            <td>{{ this.mbti === "" ? "?" : this.mbti }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="q1 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q1) 자신과 성격이 닮은 동물은?</h5>
        <hr>
        <pre class="card-text">{{ q1 }}</pre>
      </div>
    </div>
    <div v-if="q2 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q2) 위와 같이 생각하는 이유는 무엇인가요?</h5>
        <hr>
        <pre class="card-text">{{ q2 }}</pre>
      </div>
    </div>
    <div v-if="q3 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q3) 선호하는 스트레스 해소법은?</h5>
        <hr>
        <pre class="card-text">{{ q3 }}</pre>
      </div>
    </div>
    <div v-if="q4 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q4) 본인은 좋아하는 이성에게 어떻게 행동하나요?</h5>
        <hr>
        <pre class="card-text">{{ q4 }}</pre>
      </div>
    </div>
    <div v-if="q5 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q5) 만약 연인이 생긴다면 가고 싶은 곳이나 하고 싶은 것은 무엇이 있나요?</h5>
        <hr>
        <pre class="card-text">{{ q5 }}</pre>
      </div>
    </div>
    <div v-if="q6 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q6) 왜 연애를 하려고 하나요?</h5>
        <hr>
        <pre class="card-text">{{ q6 }}</pre>
      </div>
    </div>
    <div v-if="q7 !== ''" class="card">
      <div class="card-body">
        <h5 class="card-title">Q7) 그 외 본인의 상태나 상황, 자신에 대한 솔직한 얘기를 마음 것 적어보세요.</h5>
        <hr>
        <pre class="card-text">{{ q7 }}</pre>
      </div>
    </div>
    <button type="button" class="btn btn-primary btn-lg add-friend-btn" @click="requestFriend">친구 신청</button>
  </div>
</template>

<script>
export default {
  name: "MatchingDetail",
  data: () => {
    return {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      age: "",
      mbti: "",
      nickname: "",
    }
  },
  methods: {
    getAge: (birthYear) => {
      var now = new Date();	// 현재 날짜 및 시간
      return now.getFullYear() - birthYear + 1;
    },
    requestFriend: async function () {
      let userId = this.$route.params.id
      try {
        let userId = this.$route.params.id
        let response = await this.$http.post("/user/friend/" + userId)
        console.log(response)
      } catch (err) {
        console.log(err)
        alert("오류가 발생하였습니다.\n문의 부탁드립니다.")
      }
    }
  },
  created () {
    let userId = this.$route.params.id
    this.$http.get("/user/maching-partners/" + userId)
    .then((response) => {
      try {
        let userDetailInfo = response.data.userDetailInfo
        this.q1 = userDetailInfo.question1
        this.q2 = userDetailInfo.question2
        this.q3 = userDetailInfo.question3
        this.q4 = userDetailInfo.question4
        this.q5 = userDetailInfo.question5
        this.q6 = userDetailInfo.question6
        this.q7 = userDetailInfo.question7
        this.age = userDetailInfo.birthYear === 0 ? "?" : this.getAge(userDetailInfo.birthYear)
        this.nickname = userDetailInfo.nickname
        this.mbti = userDetailInfo.mbti
      } catch (e) {
        console.log(e)
        alert("오류가 발생하였습니다.\n문의 부탁드립니다.")
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 7px;
}
.card-title {
  font-weight: bold;
}
.card-text {
  font-size: 20px;
  white-space: pre-wrap;
}
.table {
  margin-bottom: 0;
  text-align: center;
}
.add-friend-btn {
  display: block;
  margin: 50px auto 0 auto;
}

@media (min-width: 769px) {
.table {
  font-size: 20px;
}
}

@media (max-width: 768px) {
.card-title {
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
}
.card-text {
  font-size: 15px;
}
}
</style>