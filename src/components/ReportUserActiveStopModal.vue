<template>
  <div class="modal fade" id="reportUserActiveStopModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="exampleModalLabel">{{ reportedNickname }}님 활동 정지</h6>
          <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="exampleFormControlSelect1">정지 기간</label>
              <select class="form-control" id="exampleFormControlSelect1" v-model="stopPrieod">
                <option selected value="1주일">1주일</option>
                <option value="1개월">1개월</option>
                <option value="3개월">3개월</option>
                <option value="6개월">6개월</option>
                <option value="영구정지">영구정지</option>
              </select>
            </div>
            <div class="form-group">
              <label for="inputContent">처분 사유</label>
              <textarea id="inputContent" class="form-control" rows="5" v-model="content"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-danger" @click="complete">
            완료
          </button>
          <button type="button" class="btn btn-dark" data-dismiss="modal">
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
  name: 'ReportUserActiveStop',
  props: {
    reportedNickname: String,
    reportedUserId: String,
  },
  data () {
    return {
      stopPrieod: '1주일',
      content: '',
    }
  },
  methods: {
    complete: function () {
      if (this.content.trim() === '') {
        alert('처분 사유를 입력해주세요.')
        return
      }

      if (!confirm('정말 활동정지 처리하시겠습니까?')) return

      let postBody = {
        stopPrieod: this.stopPrieod,
        content: this.content,
      }

      this.$http.put(`/user/${this.reportedUserId}/active-status`, postBody)
      .then((response) => {
        alert('처리가 완료되었습니다.')
        $('#close').trigger('click')
      })
      .catch((error) => {
        console.log(error)
        alert(errror.response.data.errorMessage)
      })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>