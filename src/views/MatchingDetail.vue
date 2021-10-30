<template>
  <div class="content-container">
    <div class="d-flex justify-content-center" v-if="!isResponseComplete" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <button v-if="isResponseComplete" class="btn btn-warning report-button" data-toggle="modal" data-target="#reportUserModal">
      신고
    </button>
    <table class="table table-bordered shadow-sm" v-if="isResponseComplete">
      <thead class="thead-dark">
        <tr>
          <th scope="col">닉네임</th>
          <th scope="col">나이</th>
          <th scope="col">MBTI</th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr>
          <td scope="row">{{ this.nickname }}</td>
          <td>{{ this.age }}</td>
          <td>{{ this.mbti === "unkown" ? "?" : this.mbti }}</td>
        </tr>
      </tbody>
    </table>
    <template v-for="(questionInfo, root_index) in questionList">

      <template v-for="(questionAnswerInfo, sub_index) in questionUserAnswerInfoList">
        <div v-if="questionInfo._id === questionAnswerInfo.questionId && questionAnswerInfo.answer.trim() !== ''"
        class="card" :key="root_index + sub_index">
          <div class="card-body">
            <h5 class="card-title">{{ questionInfo.content }}</h5>
            <hr>
            <pre class="card-text">{{ questionAnswerInfo.answer }}</pre>
          </div>
        </div>
      </template>

    </template>

    <button v-if="isResponseComplete" ref="requestFriendButton" type="button" class="btn btn-primary btn-lg add-friend-btn" 
      @click="requestFriend" :disabled="isRequestFriendLoading">
      <span v-show="isRequestFriendLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span ref="requestFriendButtonText">친구 신청</span>
    </button>
    <ReportUserModal :target="'자기소개'" :friendId="$route.params.id"/>
  </div>
</template>

<script>
import ReportUserModal from '@/components/ReportUserModal.vue'

export default {
  name: "MatchingDetail",
  components: { ReportUserModal },
  data: () => {
    return {
      isResponseComplete: false,
      isRequestFriendLoading: false,
      questionList: [],
      questionUserAnswerInfoList: [],
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
        } else if (result === "establishFriend") {
          alert("해당 친구분은 이미 회원님을 친구로 등록해 놓은 상태임으로\n친구가 되었습니다.")
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
        this.age = userDetailInfo.birthYear === 0 ? "?" : this.getAge(userDetailInfo.birthYear)
        this.nickname = userDetailInfo.nickname
        this.mbti = userDetailInfo.mbti
        this.questionList = response.data.questionList
        this.questionUserAnswerInfoList = userDetailInfo.questionAnswerInfoList 
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
.report-button {
  float: right;
  margin-bottom: 10px;
}
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
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #bdbdbd;
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