<template>
  <div class="modal fade" id="settomgCategory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">카테고리 관리</h5>
          <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form name="loginForm">
            <select class="form-control category-type-select" id="exampleFormControlSelect1" v-model="categoryType">
              <option value="normal">일반</option>
              <option value="admin">관리자</option>
            </select>
            <template v-if="categoryType === 'normal'">
              <div v-for="(categoryInfo, index) in categoryList" :key="index" class="form-group">
                <input :ref="categoryInfo._id" class="form-control" type="text" :value="categoryInfo.name" :readonly="categoryInfo._id !== activeInputCategoryId">
                <div class="button-wrap">
                  <button v-if="categoryInfo._id !== activeInputCategoryId" type="button" class="btn btn-info" @click="modifyCategoryName(categoryInfo)">수정</button>
                  <button v-else type="button" class="btn btn-success" @click="updateCategoryName(categoryInfo)">저장</button>
                  <button type="button" class="btn btn-danger" @click="deleteCategory(categoryInfo)">삭제</button>
                </div>
              </div>
            </template>
            <template v-if="categoryType === 'admin'">
              <div v-for="(categoryInfo, index) in adminCategoryList" :key="index" class="form-group">
                <input :ref="categoryInfo._id" class="form-control" type="text" :value="categoryInfo.name" :readonly="categoryInfo._id !== activeInputCategoryId">
                <div class="button-wrap">
                  <button v-if="categoryInfo._id !== activeInputCategoryId" type="button" class="btn btn-info" @click="modifyCategoryName(categoryInfo)">수정</button>
                  <button v-else type="button" class="btn btn-success" @click="updateCategoryName(categoryInfo)">저장</button>
                  <button type="button" class="btn btn-danger" @click="deleteCategory(categoryInfo)">삭제</button>
                </div>
              </div>
            </template>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingCategory",
  props: {
    categoryList: Array,
    adminCategoryList: Array
  },
  data: () => {
    return {
      categoryType: 'normal',
      activeInputCategoryId: null
    }
  },
  methods : {
    initData: function () {
      this.activeInputCategoryId = null
    },
    deleteCategory: function (categoryInfo) {
      if (!confirm(`정말 [${categoryInfo.name}] 카테고리를 삭제하시겠습니까?`)) {
        return
      }

      this.$http.delete(`/community/category/${categoryInfo._id}`)
      .then((response) => {
        alert('삭제가 완료되었습니다.')
        this.$emit('updateCategory')
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
    },
    updateCategoryName: function (categoryInfo) {
      let categoryName = this.$refs[categoryInfo._id][0].value

      if(categoryName.trim() === '') {
        alert('카테고리 명을 입력해주세요.')
        return
      }

      if(!confirm('정말 카테고리 명을 수정하시겠습까?')) {
        return
      }

      let categoryId = categoryInfo._id

      let postBody = {
        categoryName: categoryName
      }

      this.$http.put('/community/category/' + categoryId, postBody)
      .then((response) =>  {
        alert('수정이 완료되었습니다.')
        this.$emit('updateCategory')
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
    },
    modifyCategoryName: function (categoryInfo) {
      this.activeInputCategoryId = categoryInfo._id
    }
  }
}
</script>

<style lang="scss" scoped>
.category-type-select {
  margin-bottom: 10px;
}
input.form-control {
  display: inline-block;
  width: calc(100% - 110px);
}
.category-name {
  font-size: 16px;
}
.button-wrap {
  float: right;
  button {
    font-size: 14px;
    padding: 4px 8px;
    height: 38px;
  }
  button:not(:last-child) {
    margin-right: 5px;
  }
}
.form-group {
  margin-bottom: 10px;
}
.form-group:last-child {
  margin-bottom: 0;
}
</style>