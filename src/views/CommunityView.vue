<template>
  <div class="content-container">
    <div class="board-view-wrap shadow">
      <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-if="isResponseComplete">
        <div class="title">
          {{ title }}
        </div>
        <hr>
        <div class="add-info-section">
          <span class="nickname">{{ nickname }}</span> • 
          <span class="created-date">{{ createdDate }}</span> • 
          <span class="view">조회수 {{ view }}</span>
        </div>
        <div class="content ck-content" v-html="content">
          
        </div>
        <div class="hand-thumbs-wrap">
          <div class="hand-thumbs-up-wrap">
            <img v-if="isHandUp" class="hand-thumbs" src="@/assets/img/hand-thumbs-up-fill.svg" @click="evaluateBoard(true)">
            <img v-else class="hand-thumbs" src="@/assets/img/hand-thumbs-up.svg" @click="evaluateBoard(true)">
            <span class="like">{{ like }}</span>
          </div>
          <div class="hand-thumbs-down-wrap">
            <img v-if="isHandDown" class="hand-thumbs" src="@/assets/img/hand-thumbs-down-fill.svg" @click="evaluateBoard(false)">
            <img v-else class="hand-thumbs" src="@/assets/img/hand-thumbs-down.svg" @click="evaluateBoard(false)">
            <span class="dislike">{{ dislike }}</span>
          </div>
        </div>
      </div>
    </div>

    

    <div v-if="isResponseComplete" class="comment-input-section shadow">
      <textarea class="form-control comment-textarea" row="3" v-model="registCommentInput" @keyup="autoHeightTextarea"></textarea>
      <button class="btn btn-primary comment-regist-button" @click="registComment" :disabled="!isCommentRegistButtonActivity">등록</button>
    </div>

    <div v-if="isResponseComplete" class="comment-section shadow">
      <div v-if="isCommentRegistLoading" class="d-flex justify-content-center m-3">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-if="commentInfoList.length === 0 && !isCommentRegistLoading" class="text-center">등록된 댓글이 없습니다.</div>

      
      <!-- <div v-else v-for="(commentInfo, index) in commentInfoList" :key="index" class="comment-upper-wrap"> -->
      <div v-else v-for="(commentInfo, index) in commentInfoList" :key="index" class="comment-wrap">
        <div class="comment-nickname">
          {{ commentInfo.nickname }}
        </div>
        <div class="comment-created-date">
          {{ getCommentDate(commentInfo.createdDate) }}
        </div>
        <button v-if="commentInfo.isMine" :id="'deleteCommentButton' + index" type="button" class="close" aria-label="Close" @click="deleteComment(commentInfo, index, $event)" data-toggle="modal" data-target="#exampleModal">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="comment-content">
          {{ commentInfo.content }}
        </div>
      </div>
      <!-- </div> -->

      <CommentDeleteModal :commentInfo="deleteCommentInfo" :boardId="$route.params.boardId" @commentDeleteComplete="commentDeleteComplete" />
    </div>
  </div>
</template>

<script>
import CommentDeleteModal from '@/components/CommentDeleteModal.vue'
import $ from 'jquery'

export default {
  name: "CommunityView",
  components: { CommentDeleteModal },
  data: () => {
    return {
      title: '',
      content: '',
      nickname: '',
      createdDate: '',
      view: '',
      commentInfoList: [],
      registCommentInput: '',
      isResponseComplete: false,
      isHandUp: false,
      isHandDown: false,
      isCommentRegistLoading: false,
      isCommentRegistButtonActivity: true,
      deleteCommentInfo: {},
      like: Number,
      dislike: Number,
    }
  },
  methods: {
    commentDeleteComplete: function (commmentId) {
      const delectCommentIndex = this.commentInfoList.findIndex(
        (commentInfo) =>{
          return commentInfo.objectId === commmentId
        }
      )

      this.commentInfoList.splice(delectCommentIndex, 1)
    },
    deleteComment: function (commentInfo, index, e) {
      e.stopPropagation()
      this.deleteCommentInfo = commentInfo

      $('#deleteCommentButton' + index).click()
    },
    autoHeightTextarea: function () {
      let commentTextarea = $('.comment-textarea');
      let scrollHeight = commentTextarea.prop('scrollHeight');
      let innerHeight = commentTextarea.innerHeight()

      if (scrollHeight > innerHeight) {
        commentTextarea.css('height', scrollHeight + 10)
      }
    },
    getCommentDate: function (timestamp) {
      let dateInfo = this.convertDateToTimestamp(timestamp)
      if (dateInfo.isToday) {
        return dateInfo.hours + ':' + dateInfo.minutes
      } else {
        return dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day + ' ' + dateInfo.hours + ':' + dateInfo.minutes
      }
    },
    refreshData: function () {

    },
    registComment: function () {
      if (this.registCommentInput === '') {
        alert('내용을 입력해주세요.')
        return
      }

      let postBody = {
        content: this.registCommentInput
      }

      this.isCommentRegistLoading = true
      this.isCommentRegistButtonActivity = false

      this.$http.post('/community/board/' + this.$route.params.boardId + '/comment', postBody)
      .then((response) => {
        let data = response.data

        if (data.result !== 'success') {
          alert('댓글 등록 중 오류가 발생하였습니다.\n문제가 지속될 경우 문의부탁드립니다.')
          location.reload()
          return
        }

        this.isCommentRegistLoading = false
        this.isCommentRegistButtonActivity = true
        this.registCommentInput = ''
        this.commentInfoList.unshift(data.commentInfo)

        let commentTextarea = $('.comment-textarea');
        commentTextarea.css('height', 60)
      })
      .catch((err) => {
        alert('댓글 등록 중 오류가 발생하였습니다.\n문제가 지속될 경우 문의부탁드립니다.')
        location.reload()
      })
    },
    evaluateBoard: function (isLike) {
      let postBody = {
        isLike: isLike
      }

      this.$http.put('/community/board/' + this.$route.params.boardId + '/like-dislike', postBody)
      .then((response) => {
        if (isLike) {
          if (this.isHandUp) {
            this.isHandUp = false
            this.like -= 1
          } else if (this.isHandDown) {
            this.isHandUp = true
            this.isHandDown = false
            this.dislike -= 1
            this.like += 1
          } else {
            this.isHandUp = true
            this.like += 1
          }

        } else {
          if (this.isHandUp) {
            this.isHandUp = false
            this.isHandDown = true
            this.like -= 1
            this.dislike += 1
          } else if (this.isHandDown) {
            this.isHandDown = false
            this.dislike -= 1
          } else {
            this.isHandDown = true
            this.dislike += 1
          }
        }
        
      })
      .catch((err) => {
        console.log(err)
      })
    },
    fillZero: function (num) {
      if (num < 10) {
        return '0' + String(num)
      } else {
        return String(num)
      }
    },
    loadData: function () {
      this.$http.get('/community/board/' + this.$route.params.boardId)
      .then((response) => {
        let responseData = response.data.result
        this.title =  responseData.title
        this.content = responseData.content
        this.nickname = responseData.nickname
        this.view = responseData.view.toLocaleString('ko-KR')
        this.like = responseData.like
        this.dislike = responseData.dislike

        let dateInfo = this.convertDateToTimestamp(responseData.createdAt)
        this.createdDate = dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day + ' ' + dateInfo.hours + ':' + dateInfo.minutes

        if (responseData.evaluation === 'like') {
          this.isHandUp = true
        } else if (responseData.evaluation === 'dislike') {
          this.isHandDown = true
        }

        this.commentInfoList = responseData.boardCommentInfoList

        this.isResponseComplete = true
      })
      .catch((e) => {
        console.log(e)
        alert("페이지 로드 중 에러가 발생하였습니다.")
        history.back()
      })
    },
  },
  created () {
    this.loadData()
  },
}
</script>

<style lang="scss" scoped>
.comment-wrap {
  padding: 10px 5px;
  .comment-nickname {
    cursor: pointer;
    display: inline-block;
    margin-right: 15px;
    font-weight: bold;
  }
  .comment-created-date {
    display: inline-block;
    color: #b4b4b4;
  }
  .comment-content {
    white-space: pre-line;
    word-break: break-word;
    margin-top: 10px;
  }
}
.comment-section {
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  margin-top: 30px;
  padding: 10px;
}
.comment-input-section {
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  margin-top: 30px;
  padding: 10px;
}
.comment-textarea {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  width: calc(100% - 80px);
  height: 62px;
}
.comment-textarea::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
.comment-regist-button {
  width: 70px;
  margin-left: 10px;
  height: 62px;
}
hr {
  margin: 20px 0;
}
.title {
  width: 100%;
  // font-weight: bold;
  font-size: 1.8rem;
  // margin-bottom: 20px;
}
.board-view-wrap {
  width: 100%;
  background-color: #fff;
  min-height: 100px;
  border-radius: 5px;
  padding: 20px;
}

.add-info-section {
  position: relative;
  top: -14px;
  float: right;
  color: #b4b4b4;
  font-size: 0.95rem;
}

.nickname {
  cursor: pointer;
}

.content {
  margin-top: 70px;
}

.hand-thumbs-wrap {
  margin-top: 40px;
  padding: 40px 0 20px 0;
  text-align: center;
  font-size: 16px;
}

.hand-thumbs {
  cursor: pointer;
  width: 17px;
  margin-right: 15px;
  vertical-align: middle;
}

.hand-thumbs-up-wrap, .hand-thumbs-down-wrap {
  display: inline-block;
}

.hand-thumbs-up-wrap {
  margin-right: 20px;
}

.close {
  position: relative;
  top: -2px;
  right: 5px
}

@media (max-width: 768px) {
  .title {
    font-size: 1.4rem;
  }
}
</style>