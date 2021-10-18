<template>
  <div class="content-container">
    
    <div v-if="isResponseComplete" class="board-controller-wrap">
      <button v-if="isMyBoard" class="shadow-sm" @click="moveModifyPage">글수정</button>
      <button v-if="isMyBoard || isAdmin" class="shadow-sm" @click="deleteBoard">글삭제</button>
      <button v-if="!isMyBoard && !isAdminBoard" class="shadow-sm" @click="setReportInfo('게시글')" data-toggle="modal" data-target="#reportUserModal">신고</button>
    </div>
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
          <div class="hand-thumbs-up-wrap" @click="evaluateBoard(true)">
            <img v-if="isBoardHandUp" class="hand-thumbs" src="@/assets/img/hand-thumbs-up-fill.svg">
            <img v-else class="hand-thumbs" src="@/assets/img/hand-thumbs-up.svg">
            <span class="like">{{ like.toLocaleString('ko-KR') }}</span>
          </div>
          <div class="hand-thumbs-down-wrap" @click="evaluateBoard(false)">
            <img v-if="isBoardHandDown" class="hand-thumbs" src="@/assets/img/hand-thumbs-down-fill.svg">
            <img v-else class="hand-thumbs" src="@/assets/img/hand-thumbs-down.svg">
            <span class="dislike">{{ dislike.toLocaleString('ko-KR') }}</span>
          </div>
        </div>
        <div v-if="isResponseComplete" class="comment-input-section">
          <textarea class="form-control comment-textarea" v-model="registCommentInput" @keyup="autoHeightTextarea"></textarea>
          <button class="btn btn-primary comment-regist-button" @click="registComment" :disabled="!isCommentRegistButtonActivity">등록</button>
        </div>
      </div>
    </div>


    <div v-if="isResponseComplete" class="comment-section shadow">
      <div v-if="commentInfoList.length === 0 && !isCommentRegistLoading" class="text-center">등록된 댓글이 없습니다.</div>
      <template v-else>
        <!-- 정렬 순서 -->
        <select class="custom-select" id="inlineFormCustomSelectPref" @change="selectCommentOrder">
          <option selected value="latest">최신순</option>
          <option value="popular">인기순</option>
        </select>
        <!-- 댓글 등록 로딩 바 -->
        <div v-if="isCommentRegistLoading" class="d-flex justify-content-center m-3">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <!-- 댓글 리스트 조회 로딩 바 -->
        <div v-if="isCommentDataLoading" class="d-flex justify-content-center m-3">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <!-- 댓글 정보 -->
        <div v-else class="comment-wrap" v-for="(commentInfo, index) in commentInfoList" :key="index">
          <div class="comment-nickname">
            {{ commentInfo.nickname }}
          </div>
          <div class="comment-created-date">
            {{ getCommentDate(commentInfo.createdDate) }}
          </div>
          
          <!-- 댓글 삭제 -->
          <button v-if="commentInfo.isMine" :id="'deleteCommentButton' + commentInfo.objectId" type="button" class="close" aria-label="Close" 
          @click="deleteComment(commentInfo)" data-toggle="modal" data-target="#exampleModal">
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- 댓글 신고 -->
          <button v-else class="close" data-toggle="modal" data-target="#reportUserModal" @click="setReportInfo('댓글', commentInfo.objectId)">
            <img class="comment-report-img" src="@/assets/img/exclamation.svg" alt="">
          </button>

          <div class="comment-content">
            {{ commentInfo.content }}
          </div>
          <div class="add-action">
            <div class="comment-hand-thumbs-up-wrap" @click="evaluateComment(commentInfo.objectId, 'like')">
              <img v-if="commentInfo.evaluation === 'like'" class="comment-hand-thumbs" src="@/assets/img/hand-thumbs-up-fill.svg">
              <img v-else class="comment-hand-thumbs" src="@/assets/img/hand-thumbs-up.svg">
              <span v-if="commentInfo.like > 0" class="like">{{ convertNumberUnit(commentInfo.like) }}</span>
            </div>

            <span class="reply-comment" @click="showInputBoxSubCommentIndex = index">답글</span>
            <span v-if="commentInfo.subCommentCount > 0" class="subcomment-info-text" @click="loadSubComment(commentInfo.objectId)">
              {{ showSubCommentIdBundleList.includes(commentInfo.objectId) ? 
              `${commentInfo.subCommentCount}개의 답글 숨기기` :
              `${commentInfo.subCommentCount}개의 답글 보기`
              }}
            </span>
            <div v-if="showInputBoxSubCommentIndex === index">
              <textarea :ref="`subCommentTextarea-${commentInfo.objectId}`" @keyup="autoHeightTextarea" class="form-control comment-reply-textarea" id="" rows="1" ></textarea>
              <div class="comment-reply-button-wrap">
                <button type="button" class="btn btn-dark comment-reply-regist" @click="registSubComment(commentInfo.objectId)">등록</button>
                <button type="button" class="btn btn-light comment-reply-cancel" @click="showInputBoxSubCommentIndex = null">취소</button>
              </div>
            </div>

            <div v-if="showSubCommentIdBundleList.includes(commentInfo.objectId)" class="subcomment-wrap">
              <div class="subcomment-detail-wrap" v-for="(subCommentInfo, index) in subCommentInfoWrap[commentInfo.objectId]" :key="index">
                <div class="comment-nickname">
                  {{ subCommentInfo.nickname }}
                </div>
                <div class="comment-created-date">
                  {{ getCommentDate(subCommentInfo.createdDate) }}
                </div>
                
                <button v-if="subCommentInfo.isMine" 
                :id="'deleteCommentButton' + subCommentInfo.objectId" type="button" class="close" aria-label="Close" 
                @click="deleteComment(subCommentInfo)" data-toggle="modal" data-target="#exampleModal">
                  <span aria-hidden="true">&times;</span>
                </button>
                <button v-else class="close" data-toggle="modal" data-target="#reportUserModal" @click="setReportInfo('댓글', subCommentInfo.objectId)">
                  <img class="comment-report-img" src="@/assets/img/exclamation.svg" alt="">
                </button>
                <div class="comment-content">
                  {{ subCommentInfo.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <ReportUserModal :boardId="$route.params.boardId" :commentId="reportInfo.commentId" :target="reportInfo.target"/>
      <CommentDeleteModal :commentInfo="deleteCommentInfo" :boardId="$route.params.boardId" @commentDeleteComplete="commentDeleteComplete" />
    </div>
  </div>
</template>

<script>
import CommentDeleteModal from '@/components/CommentDeleteModal.vue'
import ReportUserModal from '@/components/ReportUserModal.vue'
import $ from 'jquery'

export default {
  name: "CommunityView",
  components: { CommentDeleteModal, ReportUserModal },
  data: () => {
    return {
      reportInfo: {
        target: '',
        commentId: '',
      },
      isMyBoard: false,
      isAdminBoard: false,
      title: '',
      content: '',
      nickname: '',
      createdDate: '',
      view: '',
      commentInfoList: [],
      registCommentInput: '',
      isResponseComplete: false,
      isBoardHandUp: false,
      isBoardHandDown: false,
      isCommentRegistLoading: false,
      isCommentDataLoading: false,
      isCommentRegistButtonActivity: true,
      deleteCommentInfo: {},
      showInputBoxSubCommentIndex: null,
      showSubCommentIdBundleList: [],
      subCommentInfoWrap: {
        // 'commentId': [{subCommentInfo},{subCommentInfo},{subCommentInfo}],
        // 'commentId': [{subCommentInfo},{subCommentInfo},{subCommentInfo}]
      },
      like: Number,
      dislike: Number,
    }
  },
  methods: {
    setReportInfo: function (target, reportTargetId) {
      this.reportInfo.target = target

      if (target === '댓글') {
        this.reportInfo.commentId = reportTargetId
      }
    },
    selectCommentOrder: function (e) {
      let order = e.target.value
      this.isCommentDataLoading = true

      this.$http.get('community/board/' + this.$route.params.boardId + '/comment?order=' + order)
      .then((response) => {
        this.commentInfoList = response.data.commentList
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
      .finally(() => {
        this.isCommentDataLoading = false
      })
    },
    deleteBoard: function () {
      if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) {
        return
      }

      this.$http.delete("/community/board/" + this.$route.params.boardId)
      .then((response) => {
        alert("삭제를 완료했습니다.")
        history.back()
      })
      .catch((error) => {
        console.log(error)
        alert("게시글 삭제 중 오류가 발생하였습니다.")
      })
    },
    loadSubComment: function (rootCommentId) {
      if (this.subCommentInfoWrap[rootCommentId] !== undefined) {
        if (this.showSubCommentIdBundleList.includes(rootCommentId)) {
          this.showSubCommentIdBundleList = this.showSubCommentIdBundleList.filter((commentId) => {
            return commentId !== rootCommentId
          })
        } else {
          this.showSubCommentIdBundleList.push(rootCommentId)
        }

        return
      }

      this.$http.get(`/community/board/${this.$route.params.boardId}/comment/${rootCommentId}/sub-comment`)
      .then((response) => {
        this.$set( this.subCommentInfoWrap, rootCommentId, response.data.subCommentList )
        this.showSubCommentIdBundleList.push(rootCommentId)
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    commentDeleteComplete: function (deletedCommentInfo) {
      if (deletedCommentInfo.isSubComment) {
        let subCommentList = this.subCommentInfoWrap[deletedCommentInfo.rootCommentId]

        const delectCommentIndex = subCommentList.findIndex((commentInfo) =>{
          return commentInfo.objectId === deletedCommentInfo.commentId
        })

        if (delectCommentIndex === -1) return

        subCommentList.splice(delectCommentIndex, 1)
        this.$set( this.subCommentInfoWrap, deletedCommentInfo.rootCommentId, subCommentList )
      } else {
        const delectCommentIndex = this.commentInfoList.findIndex((commentInfo) =>{
          return commentInfo.objectId === deletedCommentInfo.commentId
        })

        if (delectCommentIndex === -1) return

        this.commentInfoList.splice(delectCommentIndex, 1)
      }
    },
    deleteComment: function (commentInfo) {
      this.deleteCommentInfo = commentInfo
    },
    autoHeightTextarea: function (e) {
      let commentTextarea = $(e.target)
      commentTextarea[0].style.height = 'auto'
      let scrollHeight = commentTextarea.prop('scrollHeight');
      commentTextarea.css('height', scrollHeight)
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
    registSubComment: function (commentId) {
      let content = this.$refs[`subCommentTextarea-${commentId}`][0].value

      if (content.trim() === '') {
        alert('내용을 입력해주세요.')
        return
      }

      if (content.length > 5000) {
        alert('댓글은 5000자 이내로 작성해주세요')
        return
      }

      let postBody = {
        content: content
      }

      this.$http.post(`/community/board/${this.$route.params.boardId}/comment/${commentId}/sub-comment`, postBody)
      .then((response) => {
        let registedCommentInfo = response.data.commentInfo
        this.showInputBoxSubCommentIndex = null
        if (this.subCommentInfoWrap[commentId] === undefined) {

          this.$http.get(`/community/board/${this.$route.params.boardId}/comment/${commentId}/sub-comment`)
          .then((response) => {
            this.$set( this.subCommentInfoWrap, commentId, response.data.subCommentList )
          })
          .catch((error) => {
            console.log(error)
            alert(error.response.data.errorMessage)
          })
        } else {
          this.$set( this.subCommentInfoWrap, commentId, this.subCommentInfoWrap[commentId].concat([registedCommentInfo]) )
        }

        this.showSubCommentIdBundleList.push(commentId)
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    registComment: function () {
      if (this.registCommentInput.trim() === '') {
        alert('내용을 입력해주세요.')
        return
      }

      if (this.registCommentInput.length > 5000) {
        alert('댓글은 5000자 이내로 작성해주세요.')
        return
      }

      this.showInputBoxSubCommentIndex = null

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
          if (this.isBoardHandUp) {
            this.isBoardHandUp = false
            this.like -= 1
          } else if (this.isBoardHandDown) {
            this.isBoardHandUp = true
            this.isBoardHandDown = false
            this.dislike -= 1
            this.like += 1
          } else {
            this.isBoardHandUp = true
            this.like += 1
          }

        } else {
          if (this.isBoardHandUp) {
            this.isBoardHandUp = false
            this.isBoardHandDown = true
            this.like -= 1
            this.dislike += 1
          } else if (this.isBoardHandDown) {
            this.isBoardHandDown = false
            this.dislike -= 1
          } else {
            this.isBoardHandDown = true
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
    moveModifyPage: function () {
      this.$router.push('/community-modify/' +this.$route.params.boardId)
    },
    loadBoardData: function () {
      this.$http.get('/community/board/' + this.$route.params.boardId)
      .then((response) => {
        let responseData = response.data.result
        this.isMyBoard = responseData.isMyBoard
        this.title =  responseData.title
        this.content = responseData.content
        this.nickname = responseData.nickname
        this.view = responseData.view.toLocaleString('ko-KR')
        this.like = responseData.like
        this.dislike = responseData.dislike
        this.isAdminBoard = responseData.categoryType === 'admin' ? true : false

        let dateInfo = this.convertDateToTimestamp(responseData.createdAt)
        this.createdDate = dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day + ' ' + dateInfo.hours + ':' + dateInfo.minutes

        if (responseData.evaluation === 'like') {
          this.isBoardHandUp = true
        } else if (responseData.evaluation === 'dislike') {
          this.isBoardHandDown = true
        }

        this.isResponseComplete = true
      })
      .catch((e) => {
        console.log(e)
        alert(e.response.data.errorMessage)
        history.back()
      })
    },
    evaluateComment: function (commentId, status) {
      let postBody = {
        status: status
      }

      this.$http.put(`community/board/${this.$route.params.boardId}/comment/${commentId}`, postBody)
      .then((response) => {
        const updatedCommentIndex = this.commentInfoList.findIndex((commentInfo) => {
          if (commentInfo.objectId === commentId) return true
        })

        this.commentInfoList[updatedCommentIndex].like = response.data.commentInfo.like
        this.commentInfoList[updatedCommentIndex].evaluation = response.data.commentInfo.evaluation
      })
      .catch((error) => {
        console.log(error)
      })
    },
    loadCommentData: function () {
      this.isCommentDataLoading = true

      this.$http.get('community/board/' + this.$route.params.boardId + '/comment?order=latest')
      .then((response) => {
        this.commentInfoList = response.data.commentList
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
      .finally(() => {
        this.isCommentDataLoading = false
      })
    },
  },
  created () {
    this.loadBoardData()
    this.loadCommentData()
  },
}
</script>

<style lang="scss" scoped>
.comment-report-img {
  position: relative;
  right: -4px;
  width: 25px;
  vertical-align: baseline;
}

.add-action {
  margin-top: 10px;
  .comment-hand-thumbs-up-wrap {
    display: inline-block;
    cursor: pointer;
    width: 74px;
    .comment-hand-thumbs {
      margin-right: 8px;
      width: 16px;
    }
    .like {
      position: relative;
      top: 1px;
      display: inline-block;
    }
  }
  .reply-comment, .subcomment-info-text {
    position: relative;
    top: 1px;
    display: inline-block;
    cursor: pointer;
    font-size: 16px;
    vertical-align: bottom;
  }
  .comment-reply-textarea {
    overflow-y: hidden;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    margin-top: 15px;
    height: 36px;
  }
  .comment-reply-button-wrap {
    text-align: left;
    margin-top: 12px;
    .comment-reply-cancel {
      margin-left: 8px;
    }
  }
  .subcomment-info-text {
    cursor: pointer;
    color: #007bff;
    margin-left: 20px;
  }
  .subcomment-wrap {
    margin-top: 20px;
    .subcomment-detail-wrap {
      padding: 10px 20px;
      background-color: #f4f4f4;
      border-radius: 10px;
      margin-top: 10px;
    }
  }
}

.custom-select {
  width: 100px;
}
.board-controller-wrap {
  margin-bottom: 10px;
  text-align: right;
  button {
    padding: 10px;
    border-radius: 6px;
    background-color: #ffffff;
    border: 0;
  }
  button:not(:last-child) {
    margin-right: 10px;
  }
}

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
    margin-top: 5px;
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
  margin-top: 10px;
}
.comment-textarea {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  height: 60px;
  width: calc(100% - 80px);
}
.comment-textarea::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
.comment-regist-button {
  width: 70px;
  margin-left: 10px;
  height: 60px;
}
hr {
  margin: 20px 0;
}

.board-view-wrap {
  width: 100%;
  background-color: #fff;
  min-height: 100px;
  border-radius: 5px;
  padding: 20px;
  .title {
    width: 100%;
    word-break: break-all;
    // font-weight: bold;
    font-size: 1.8rem;
    text-align: center;
    // margin-bottom: 20px;
  }
  .add-info-section {
    position: relative;
    top: -14px;
    float: right;
    font-size: 1rem;
  }
  .content {
    margin-top: 70px;
  }
  .nickname {
    cursor: pointer;
  }
}

.hand-thumbs-wrap {
  margin-top: 30px;
  padding: 20px 0 20px 0;
  text-align: center;
  font-size: 21px;
}

.hand-thumbs {
  cursor: pointer;
  width: 28px;
  margin-right: 15px;
  vertical-align: middle;
}

.hand-thumbs-up-wrap, .hand-thumbs-down-wrap {
  display: inline-block;
  cursor: pointer;
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
  .content-container {
    margin-top: 10px;
  }
  .board-view-wrap {
    padding: 12px;
  }
  .comment-section {
    margin-top: 10px;
  }
}
</style>