<template>
  <div class="content-container">
    <div class="title">내정보</div>
    <div class="myinfo-wrap shadow" id="myInfoWrap">
      <div class="mb-3 row">
        <label for="nickname" class="col-sm-2 col-form-label">닉네임</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="nickname" :value="nickname" disabled>
        </div>
      </div>
      <div class="row">
        <label for="genderText" class="col-sm-2 col-form-label">성별</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext gender-box" :class="{ 'male-color': gender === '남성', 'female-color': gender === '여성' }" id="genderText" :value="gender">
        </div>
      </div>
    </div>
    <div class="title">나의 게시글</div>
    <div class="myinfo-wrap shadow">
      <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else v-for="(boardInfo, index) in boardList" :key="index" class="list-row">
        <router-link :to="'/community/detail/' + boardInfo._id">
          {{ boardInfo.title }}
        </router-link>
      </div>
      <div v-if="isResponseComplete && isMoreBoardButton" class="list-row">
        <button class="more-button" @click="moreLoadboard">
          더 보기
        </button>
      </div>
    </div>
    <div class="title">나의 댓글</div>
    <div class="myinfo-wrap shadow">
      <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else v-for="(commentInfo, index) in commentList" :key="index" class="list-row">
        <router-link :to="'/community/detail/' + commentInfo.boardId._id">
          {{ commentInfo.content }}
        </router-link>
        <!-- <hr v-if="commentList.length !== index + 1"> -->
      </div>
      <div v-if="isResponseComplete && isMoreCommentButton" class="list-row">
        <button class="more-button" @click="moreLoadComment">
          더 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'

const LOAD_LIMIT = 10

export default {
  name: "MyPage",
  data () {
    return {
      isResponseComplete: false,
      nickname: '',
      gender: '',
      boardList: [],
      commentList: [],
      isMoreBoardButton: true,
      isMoreCommentButton: true,
    }
  },
  methods: {
    moreLoadComment: function () {
      this.$http.get('/user/mypage?commentSkip=' + this.commentList.length)
      .then((response) => {
        this.commentList = this.commentList.concat(response.data.commentList)
        if (response.data.commentList.length < LOAD_LIMIT) {
          this.isMoreCommentButton = false
        }
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
    },
    moreLoadboard: function () {
      this.$http.get('/user/mypage?boardSkip=' + this.boardList.length)
      .then((response) => {
        this.boardList = this.boardList.concat(response.data.boardList)
        if (response.data.boardList.length < LOAD_LIMIT) {
          this.isMoreBoardButton = false
        }
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
    }
  },
  created () {
    this.nickname = VueCookies.get('nickname')
    this.gender = VueCookies.get('gender') === 'male' ? '남성' : '여성'

    this.$http.get('/user/mypage')
    .then((response) => {
      console.log(response.data)
      this.boardList = response.data.boardList
      this.commentList = response.data.commentList
      this.isResponseComplete = true

      if (response.data.boardList.length < LOAD_LIMIT) {
        this.isMoreBoardButton = false
      }

      if (response.data.commentList < LOAD_LIMIT) {
        this.isMoreCommentButton = false
      }
    })
    .catch((error) => {
      alert(error.response.data.errorMessage)
      console.log(error)
    })
  },
}
</script>

<style lang="scss" scoped>
.more-button {
  border-radius: 5px;;
  border: 0;
  padding: 5px 0;
  background-color: #ffffff;
  text-align: center;
  width: 100%;
}
.more-button:hover {
  background-color: #eeeeee;
}
.pagination {
  justify-content: center;
  margin: 0;
}
.list-row:not(:last-child) {
  margin-bottom: 10px;
}
.title {
  font-size: 16px;
  margin-bottom: 10px;

}
.myinfo-wrap {
  width: 100%;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 30px;
}
.gender-box {
  cursor: default;
  width: 50px;
  color: white;
  text-align: center;
  border-radius: 8px;
  outline: none;
}
.male-color {
  color: #ffffff;
  background-color: #5f5fff;
}
.female-color {
  color: #ffffff;
  background-color: #ff6969;
}
</style>