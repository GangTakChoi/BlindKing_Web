<template>
  <div class="modal fade" id="reportUserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <button v-show="false" @click="resetData" id="resetButton">reset</button>
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">유저 신고</h5>
          <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form name="loginForm">
            <div class="form-group">
              <label for="exampleFormControlSelect1">신고 유형</label>
              <select class="form-control" id="exampleFormControlSelect1" v-model="reportType">
                <option selected value="모욕/비방">모욕/비방</option>
                <option value="성희롱">성희롱</option>
                <option value="광고">광고</option>
                <option value="도배">도배</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div class="form-group">
              <label for="inputId">자세한 내용</label>
              <textarea class="form-control" rows="5" v-model="reportContent"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-danger" @click="reportRoute">신고</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "ReportUserModal",
  props: {
    friendId: String,
    boardId: String,
    commentId: String,
    target: String,
  },
  data: () => {
    return {
      reportType: '모욕/비방',
      reportContent: '',
    }
  },
  methods : {
    resetData: function () {
      this.reportType = '모욕/비방'
      this.reportContent = ''
    },
    reportBoard: function () {
      let postBody= {
        target: this.target,
        reportType: this.reportType,
        reportContent: this.reportContent,
      }

      this.$http.post(`/community/board/${this.boardId}/report`, postBody)
      .then((response) => {
        alert('신고 접수가 완료되었습니다.\n감사합니다.')
        $('#close').trigger('click')
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    reportChatting: function () {
      let postBody = {
        target: this.target,
        reportType: this.reportType,
        reportContent: this.reportContent,
      }

      this.$http.post(`/user/${this.friendId}/report`, postBody)
      .then((response) => {
        alert('신고 접수가 완료되었습니다.\n감사합니다.')
        $('#close').trigger('click')
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    reportComment: function () {
      let postBody = {
        target: this.target,
        reportType: this.reportType,
        reportContent: this.reportContent,
      }

      this.$http.post(`/community/board/${this.boardId}/comment/${this.commentId}/report`, postBody)
      .then((response) => {
        alert('신고 접수가 완료되었습니다.\n감사합니다.')
        $('#close').trigger('click')
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    reportRoute: function () {
      if (this.reportContent.trim() === '') {
        alert('내용을 입력해주세요.')
        return
      }

      if (this.reportContent.length > 5000) {
        alert('내용은 5000자 이내로 작성 부탁드립니다.')
        return
      }

      if (this.target === '채팅') {
        this.reportChatting()
      } else if (this.target === '게시글') {
        this.reportBoard()
      } else if (this.target === '댓글') {
        this.reportComment()
      }
    }
  },
  mounted () {
    $('#reportUserModal').on('hide.bs.modal', function (event) {
      // vue method 직접 호출이 불가능하여 resetButton 클릭 이벤트를 발생시켜 우회하여 resetData 메소드 실행
      $('#resetButton').trigger('click')
    })
  },
}
</script>

<style lang="scss" scoped>
// .modal-footer {
//   justify-content: center;
// }
</style>