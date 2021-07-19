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
          <h4>{{ friendInfo.nickname }}</h4>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-dark" data-dismiss="modal">삭제</button> -->
          <button type="button" class="btn btn-dark" @click="deleteFriend">삭제</button>
          <button type="button" class="btn btn-danger" @click="blockFriend">차단</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "FriendDeleteModal",
  props: {
    friendInfo: Object
  },
  methods: {
    deleteFriend: function () {
      this.$http.post("/user/friend/" + this.friendInfo.objectId + "/reject")
      .then((response) => {
        if (response.status === 200) {
          console.log(response)
          alert("친구삭제 되었습니다.")
          this.$emit("requestComplete")
          $("close").click()
        } else {
          alert("유효하지 않은 요청입니다.")
        }
      })
      .catch((err) => {
        alert("친구삭제 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    blockFriend: function () {
      this.$http.post("/user/friend/" + this.friendInfo.objectId + "/block")
      .then((response) => {
        if (response.status === 200) {
          console.log(response)
          alert("친구차단 되었습니다.")
          this.$emit("requestComplete")
          $("close").click()
        } else {
          alert("유효하지 않은 요청입니다.")
        }
      })
      .catch((err) => {
        alert("차단 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-header {
  border:0;
  padding-bottom: 0;
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