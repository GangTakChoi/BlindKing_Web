<template>
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="exampleModalLabel"></h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <div class="modal-body">
          <h6>해당 댓글을 삭제하시겠습니까?</h6>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-dark" data-dismiss="modal">삭제</button> -->
          <button type="button" class="btn btn-danger" @click="deleteComment" :disabled="isDeleteLoading">
            <span v-show="isDeleteLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            삭제
          </button>
          <button type="button" class="btn btn-dark" @click="cancel">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "commentDeleteModal",
  data: () => {
    return {
      isDeleteLoading: false,
    }
  },
  props: {
    boardId: String,
    commentInfo: Object
  },
  methods: {
    deleteComment: function () {
      let commmentId = this.commentInfo.objectId

      this.isDeleteLoading = true

      this.$http.delete("/community/board/" + this.boardId + "/comment/" + commmentId)
      .then((response) => {
        if (response.status === 200) {
          this.isDeleteLoading = false
          alert("댓글이 삭제되었습니다.")
          this.$emit("commentDeleteComplete", commmentId)
          $(".close").click()
        } else {
          alert("댓글 삭제 중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        }
      })
      .catch((err) => {
        alert("댓글 삭제 중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    cancel: function () {
      $(".close").click()
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner-border-sm {
  margin-right: 10px;
  margin-bottom: 2px;
}
.modal-header {
  border:0;
  padding-top: 10px;
}
.modal-footer {
  border:0;
  justify-content: center;
}
.modal-body {
  text-align: center;
  padding: 0;
}
@media (max-width: 768px) {
  .modal-content {
    width: 80%;
    margin: 0 auto;
  }
}
</style>