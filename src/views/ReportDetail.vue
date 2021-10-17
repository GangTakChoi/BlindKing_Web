<template>
  <div class="content-container">
    <table class="table text-left">
      <thead class="thead-dark">
        <tr>
          <th scope="col">신고자</th>
          <th scope="col">신고대상</th>
          <th scope="col">유형</th>
          <th scope="col" width="80">대상</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row">{{ reportInfo.reporterNickname}}</td>
          <td>{{ reportInfo.reportedUserNickname}}</td>
          <td>{{ reportInfo.type }}</td>
          <td>{{ reportInfo.target }}</td>
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

    <button v-if="reportInfo.target === '채팅'" type="button" class="btn btn-outline-secondary btn-lg btn-block"
    @click="loadChattingContent">채팅 내용 보기</button>
    <div v-if="chattingList.length > 0" class="chatting-display-panel">
      <div v-for="(chattingInfo, index) in chattingList" :key="index">
        {{ `(${getDate(chattingInfo.created)})` }} {{ chattingInfo.userNickname }} : {{chattingInfo.content}}
      </div>
    </div>

    <button v-if="reportInfo.target === '게시글'" type="button" class="btn btn-outline-secondary btn-lg btn-block"
    @click="moveBoard">게시글 이동</button>
    <button v-if="reportInfo.target === '게시글'" type="button" class="btn btn-outline-secondary btn-lg btn-block"
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
  </div>
</template>

<script>
export default {
  name: 'ReportDetail',
  data () {
    return {
      isShowCaptureBoard: false,
      reportInfo: Object,
      chattingList: [],
    }
  },
  methods: {
    getDate: function (timestamp) {
      let dateInfo = this.convertDateToTimestamp(timestamp)

      return `${dateInfo.year}/${dateInfo.month}/${dateInfo.day} ${dateInfo.hours}:${dateInfo.minutes}`
    },
    moveBoard: function () {
      let boardId = this.reportInfo.captureTargetContent._id
      this.$router.push(`/community/detail/${boardId}`)
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
  margin-top: 30px;
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
  margin-top: 30px;
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
</style>