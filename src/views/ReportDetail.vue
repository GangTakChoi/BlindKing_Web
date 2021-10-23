<template>
  <div class="content-container">
    <template v-if="isResponseComplete">
      <table class="table text-center">
        <thead class="thead-dark">
          <tr>
            <th scope="col">신고자</th>
            <th scope="col">신고대상</th>
            <th scope="col">유형</th>
            <th scope="col" width="120">대상</th>
            <th scope="col" width="160">신고일시</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">
              {{ reportInfo.reporterNickname}}
            </td>
            <td>
              {{ reportInfo.reportedUserNickname}}
            </td>
            <td>{{ reportInfo.type }}</td>
            <td>{{ reportInfo.target }}</td>
            <td>{{ getDate(reportInfo.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" class="text-center">자세한 내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">{{ reportInfo.reportContent}}</td>
          </tr>
        </tbody>
      </table>

      <button type="button" class="btn btn-danger btn-lg btn-block" data-toggle="modal" data-target="#reportUserActiveStopModal">활동정지</button>
      <button @click="loadUserActivityStopHistory" type="button" class="btn btn-info btn-lg btn-block">활동정지 이력조회</button>
      <div v-if="isShowActivityStopHistory" class="activity-stop-history shadow-sm">
        <div v-if="reportedUserActivityStopHistory.length < 1" class="text-center">
          활동정지 이력이 없습니다.
        </div>
        <div v-else>
          <div v-for="(historyInfo, index) in reportedUserActivityStopHistory" :key="index" class="history-info-wrap">
            <span class="font-weight-bold">기간:</span> {{historyInfo.stopPrieod}}<br>
            <span class="font-weight-bold">시작일시:</span> {{getDate(historyInfo.startDate)}}<br>
            <span class="font-weight-bold">해제일시:</span> {{getDate(historyInfo.endDate)}}<br>
            <span class="font-weight-bold">처분사유:</span> {{historyInfo.adminComment}}
          </div>
        </div>
      </div>

      <button v-if="reportInfo.target === '댓글'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="isShowCaptureComment = !isShowCaptureComment">신고 대상 댓글 내용보기</button>
      <div v-if="isShowCaptureComment" class="comment-section shadow">
        <div class="comment-wrap">
          <div class="comment-nickname">
            {{ reportInfo.captureTargetContent.nickname }}
          </div>
          <div class="comment-created-date">
            {{ getDate(reportInfo.captureTargetContent.createdAt) }}
          </div>
          <div class="comment-content">
            {{ reportInfo.captureTargetContent.content }}
          </div>
        </div>
      </div>
      <button v-if="reportInfo.target === '댓글'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="loadingCommentList(reportInfo.captureTargetContent.writerUserId, reportInfo.captureTargetContent.boardId)">해당 게시글에 작성한 댓글 모두 보기 (삭제포함)</button>
      <div v-if="isShowCommentList" class="comment-section shadow">
        <template v-if="subResponseCompleteInfo.reportedUserCommentList">
          <div v-for="(commentInfo, index) in commentList" class="comment-wrap" :key="index">
            <div class="comment-nickname">
              {{ commentInfo.nickname }}
            </div>
            <div class="comment-created-date">
              {{ getDate(commentInfo.createdAt) }}
            </div>
            <div v-if="commentInfo.rootCommentId !== null" class="comment-rootcomment-status">
              대댓글
            </div>
            <div v-if="commentInfo.isDelete" class="comment-delete-status">
              삭제된 댓글
            </div>
            <div class="comment-content">
              {{ commentInfo.content }}
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <div class="d-flex justify-content-center" style="margin: 20px 0">
              <div class="spinner-border" role="status" style="width: 2rem; height: 2rem;">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <button v-if="reportInfo.target === '댓글'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="moveBoard(reportInfo.captureTargetContent.boardId)">해당 게시글 이동</button>

      <button v-if="reportInfo.target === '채팅'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="loadChattingContent">채팅 내용 보기</button>
      <div v-if="chattingList.length > 0" class="chatting-display-panel">
        <div v-for="(chattingInfo, index) in chattingList" :key="index">
          {{ `(${getDate(chattingInfo.created)})` }} {{ chattingInfo.userNickname }} : {{chattingInfo.content}}
        </div>
      </div>

      <button v-if="reportInfo.target === '자기소개'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="moveSelfIntroducePage">자기소개 페이지 이동</button>

      <button v-if="reportInfo.target === '게시글'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="moveBoard(reportInfo.captureTargetContent._id)">게시글 이동</button>
      <button v-if="reportInfo.target === '게시글'" type="button" class="btn btn-secondary btn-lg btn-block"
      @click="isShowCaptureBoard = !isShowCaptureBoard">게시글 캡처 내용보기</button>
      <div v-if="isShowCaptureBoard" class="capture-board-display-panel shadow">
        <div class="title">
          {{ reportInfo.captureTargetContent.title }}
        </div>
        <hr>
        <div class="add-info-section">
          <span class="nickname">{{ reportInfo.captureTargetContent.nickname }}</span> • 
          <span class="created-date">{{ getDate(reportInfo.captureTargetContent.createdAt) }}</span> • 
          <span class="view">조회수 {{ reportInfo.captureTargetContent.view }}</span>
        </div>
        
        <div class="content ck-content" v-html="reportInfo.captureTargetContent.content">
        </div>
      </div>
      <ReportUserActiveStopModal :reportedNickname="reportInfo.reportedUserNickname" :reportedUserId="reportInfo.reportedUserId"/>
    </template>
    <template v-else>
      <div v-if="!isResponseComplete">
        <div class="d-flex justify-content-center" style="margin: 40px 0">
          <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ReportUserActiveStopModal from '@/components/ReportUserActiveStopModal.vue'

export default {
  name: 'ReportDetail',
  components: { ReportUserActiveStopModal },
  data () {
    return {
      isResponseComplete: false,
      subResponseCompleteInfo: {
        reportedUserActivityStopHistory: false,
        reportedUserCommentList: false,
      },
      reportedUserActivityStopHistory: [],
      isShowActivityStopHistory: false,
      isShowCaptureComment: false,
      isShowCommentList: false,
      isShowCaptureBoard: false,
      reportInfo: Object,
      chattingList: [],
      commentList: [],
    }
  },
  methods: {
    loadUserActivityStopHistory: function () {
      if (this.subResponseCompleteInfo.reportedUserActivityStopHistory) {
        this.isShowActivityStopHistory = !this.isShowActivityStopHistory
        return
      }

      this.$http.get(`/user/${this.reportInfo.reportedUserId}/activity-stop-history`)
      .then((response) => {
        this.isShowActivityStopHistory = !this.isShowActivityStopHistory
        this.reportedUserActivityStopHistory = response.data.activeStopHistoryList
        this.subResponseCompleteInfo.reportedUserActivityStopHistory = true
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    moveBoard: function (boardId) {
      this.$router.push(`/community/detail/${boardId}`)
    },
    moveSelfIntroducePage: function () {
      this.$router.push(`/matching/detail/${this.reportInfo.reportedUserId}`)
    },
    loadingCommentList: function (userId, boardId) {
      this.isShowCommentList = !this.isShowCommentList
      if (this.subResponseCompleteInfo.reportedUserCommentList) return

      this.$http.get(`/user/${userId}/board/${boardId}/comment-list`)
      .then((response) => {
        this.commentList = response.data.commentList
        this.subResponseCompleteInfo.reportedUserCommentList = true
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    loadChattingContent: function () {
      if (this.chattingList.length > 0) return

      this.$http.get(`/user/${this.reportInfo.reporterUserId}/friend/${this.reportInfo.reportedUserId}/chatting`)
      .then((response) => {
        this.chattingList = response.data.chattingList
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    loadData: function () {
      this.$http.get(`/user/report/${this.$route.params.reportId}`)
      .then((response) => {
        this.reportInfo = response.data.reportInfo
        this.isResponseComplete = true
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.activity-stop-history {
  margin: 10px 0;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
}
.history-info-wrap {
  border:1px solid #000000;
  border-radius: 10px;
  padding: 5px 10px;
  width: 100%;
}
.history-info-wrap:not(:last-child) {
  margin-bottom: 7px;
}
table {
  background-color: #ffffff;
  margin-bottom: 30px;
  thead tr th {
    padding: 10px 15px;
  }
  tbody {
    tr {
      td {
        padding: 10px 15px;
      }
    }
  }
}
.show-chatting-button {
  border: 0;
}
.chatting-display-panel {
  margin-top: 10px;
  border: 1px solid #000000;
  padding: 10px 15px;
  background-color: #ffffff;
  color: #000000;
  max-height: 500px;
  overflow-y: scroll;
}
.capture-board-display-panel {
  width: 100%;
  background-color: #fff;
  min-height: 100px;
  border-radius: 5px;
  padding: 20px;
  margin-top: 10px;
  .title {
    width: 100%;
    word-break: break-all;
    // font-weight: bold;
    font-size: 1.5rem;
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


.comment-section {
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
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
      margin-right: 15px;
    }
    .comment-delete-status {
      display: inline-block;
      color: #ffffff;
      background-color: #fc4c4c;
      border-radius: 7px;
      padding: 3px 5px;
      font-size: 12px;
    }
    .comment-rootcomment-status {
      display: inline-block;
      color: #ffffff;
      background-color: #000000;
      border-radius: 7px;
      padding: 3px 5px;
      font-size: 12px;
    }
    .comment-content {
      white-space: pre-line;
      word-break: break-word;
      margin-top: 5px;
    }
  }
}
</style>