<template>
  <div class="modal fade" id="addCategory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">카테고리 추가</h5>
          <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form name="loginForm">
            <div class="form-group">
              <label for="inputId">유형</label>
              <select class="form-control" id="exampleFormControlSelect1" v-model="categoryType">
                <option selected value="normal">일반</option>
                <option value="admin">관리자</option>
              </select>
            </div>
            <div class="form-group">
              <label for="inputPw">카테고리 명</label>
              <input type="text" class="form-control" id="inputCategoryName" v-model="inputCategoryName">
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-primary" @click="addCategory">추가</button>
          <button type="button" class="btn btn-danger" @click="initData" data-dismiss="modal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "AddCategoryModel",
  data: () => {
    return {
      categoryType: 'normal',
      inputCategoryName: ''
    }
  },
  methods : {
    initData: function () {
      this.categoryType = 'normal'
      this.inputCategoryName = ''
    },
    addCategory: function () {
      if (this.inputCategoryName.trim() === '') {
        alert('카테고리 명을 입력해주세요.')
        return
      }

      let postBody = {
        type: this.categoryType,
        categoryName: this.inputCategoryName,
      }

      this.$http.post('/community/category', postBody)
      .then((response) => {
        alert('카테고리가 추가되었습니다.')
        this.initData()
        this.$emit('updateCategory')
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
      .finally(() => {
        $('#close').trigger('click')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .modal-footer {
//   justify-content: center;
// }
</style>