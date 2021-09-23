<template>
  <div class="content-container">
    <div class="wrap-title">내정보</div>
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
    <div class="wrap-title">나의 게시글</div>
    <div class="myinfo-wrap shadow">
      <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else v-for="(boardInfo, index) in boardList" :key="index" class="list-row">
        <span class="row-title">
          <router-link :to="'/community/detail/' + boardInfo._id">
            {{ boardInfo.title }}
          </router-link>
          <span style="opacity:0.6">[{{ boardInfo.commentCount }}]</span>
        </span>
        <span class="row-detail">
          {{ getDate(boardInfo.createdAt) }} • 
          조회수 {{ boardInfo.view }} • 
          좋아요 {{ boardInfo.like }} • 
          싫어요 {{ boardInfo.dislike }}
        </span>
      </div>
      <div v-if="isResponseComplete && isMoreBoardButton" class="list-row">
        <div v-if="isLoadingBoardInfo" class="d-flex justify-content-center" style="margin: 40px 0">
          <div class="spinner-border" role="status" style="width: 2rem; height: 2rem;">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <button v-else class="more-button" @click="moreLoadboard">
          더 보기
        </button>
      </div>
    </div>
    <div class="wrap-title">나의 댓글</div>
    <div class="myinfo-wrap shadow">
      <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else v-for="(commentInfo, index) in commentList" :key="index" class="list-row">
        <span class="row-title row-comment-content">
          {{ commentInfo.content }}
        </span>
        <span class="row-detail">
          {{ getDate(commentInfo.createdAt) }} • 
          좋아요 {{ commentInfo.like }}
        </span>
        <span class="row-detail">
          <router-link :to="'/community/detail/' + commentInfo.boardId._id">
            {{ commentInfo.boardId.title }}
          </router-link>
          {{ ' 게시글에 남긴 댓글'}} 
        </span>
        <hr v-if="commentList.length !== index + 1">
      </div>
      <div v-if="isResponseComplete && isMoreCommentButton" class="list-row">
        <div v-if="isLoadingCommentInfo" class="d-flex justify-content-center" style="margin: 40px 0">
          <div class="spinner-border" role="status" style="width: 2rem; height: 2rem;">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <button v-else class="more-button" @click="moreLoadComment">
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
      isLoadingCommentInfo: false,
      isLoadingBoardInfo: false,
    }
  },
  methods: {
    getDate: function (createdAt) {
      let dateInfo = this.convertDateToTimestamp(createdAt)

      return dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day
    },
    moreLoadComment: function () {
      this.isLoadingCommentInfo = true
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
      .finally(() => {
        this.isLoadingCommentInfo = false
      })
    },
    moreLoadboard: function () {
      this.isLoadingBoardInfo = true
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
      .finally(() => {
        this.isLoadingBoardInfo = false
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
.row-title {
  word-break: break-all;
  display: block;
  width: 100%;
}
.row-detail {
  word-break: break-all;
  display: block;
  font-size: 14px;
  opacity: 0.6;
}
.row-detail:not(:last-child) {
  margin-bottom: 5px;
}
.row-comment-content {
  background-color: #eeeeee;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
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
.wrap-title {
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