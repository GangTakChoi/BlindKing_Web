<template>
  <div class="content-container">
    <div class="d-flex justify-content-center" v-if="!isResponseComplete" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="card" v-if="isResponseComplete">
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
    <button v-if="isResponseComplete" ref="requestFriendButton" type="button" class="btn btn-primary btn-lg add-friend-btn" 
      @click="requestFriend" :disabled="isRequestFriendLoading">
      <span v-show="isRequestFriendLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span ref="requestFriendButtonText">친구 신청</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "MatchingDetail",
  data: () => {
    return {
      isResponseComplete: false,
      isRequestFriendLoading: false,
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
      let tempButtonText = this.$refs.requestFriendButtonText.innerText
      this.$refs.requestFriendButtonText.innerText = "Loading..."
      this.isRequestFriendLoading = true

      try {
        let userId = this.$route.params.id
        let response = await this.$http.post("/user/friend/" + userId)

        let result = response.data.result

        if (result === "success") {
          alert("친구 요청이 완료되었습니다.")
        } else if (result === "alreadyFriend") {
          alert("이미 친구 관계입니다.")
        } else if (result === "blocked") {
          alert("해당 친구로 부터 차단된 상태입니다.")
        } else if (result === "alreadyRequested") {
          alert("이미 친구 요청이 완료된 상태입니다.")
        } else if (result === "myBlock") {
          alert("현재 회원님은 해당 친구를 차단해 놓은 상태입니다.\n차단 해제 후 재시도 부탁드립니다.")
        } else if (result === "acceptFriend") {
          alert("해당 친구도 회원님께 친구요청을 해놓은 상태임으로\n친구로 등록되었습니다.")
        }
      } catch (err) {
        console.log(err)
        alert("오류가 발생하였습니다.\n문의 부탁드립니다.")
      } finally {
        this.$refs.requestFriendButtonText.innerText = tempButtonText
        this.isRequestFriendLoading = false
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
        this.isResponseComplete = true
      } catch (e) {
        console.log(e)
        alert("오류가 발생하였습니다.\n문의 부탁드립니다.")
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.spinner-border-sm {
  margin-right: 10px;
  margin-bottom: 4px;
}
.card {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 7px;
  border: 1px solid #bdbdbd;
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