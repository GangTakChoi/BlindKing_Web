<template>
  <div class="content-container">
    <form @submit.prevent="submit">
      <select class="form-control category-select" id="exampleFormControlSelect1" v-model="selectCategoryId">
        <option v-for="(categoryInfo, index) in categoryList" :key="index" :value="categoryInfo._id">{{categoryInfo.name}}</option>
      </select>
      <div class="title-input-wrap shadow-sm">
        <input type="text" class="title-input" v-model="title">
      </div>
      <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" tag-name="textarea"></ckeditor>

      <div class="button-wrap">
        <button type="submit" class="btn btn-primary btn-lg" :disabled="isRegistBoardLoading">
          <span v-show="isRegistBoardLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          등록
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import ClassicEditor from '@/assets/js/ckeditor';
import CKEditor from '@ckeditor/ckeditor5-vue2';
import VueCookies from 'vue-cookies'

const TOKEN = VueCookies.get('token')

export default {
  name: "CommunityWrite",
  data: () => {
    return {
      selectCategoryId: null,
      categoryList: [],
      isRegistBoardLoading: false,
      title: '',
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        toolbar: {
					items: [
						'heading',
						'|',
						'bold',
						'italic',
						'fontColor',
						'fontSize',
						'link',
						'bulletedList',
						'numberedList',
						'alignment',
						// 'code',
						'|',
						'outdent',
						'indent',
						'|',
						'imageUpload',
						'blockQuote',
						'insertTable',
						'mediaEmbed',
						'undo',
						'redo'
					]
				},
        mediaEmbed: {
            previewsInData: true
        },
        simpleUpload: {
            // The URL that the images are uploaded to.
            uploadUrl: process.env.VUE_APP_BASE_API_HOST + '/community/image-upload',

            // Enable the XMLHttpRequest.withCredentials property.
            withCredentials: true,

            // Headers sent along with the XMLHttpRequest to the upload server.
            headers: {
                // 'X-CSRF-TOKEN': 'CSRF-Token',
                Authorization: `Bearer ${TOKEN}`
            }
        }
      }
    }
  },
  methods : {
    submit () {
      if (this.title.trim() === '') {
        alert('제목을 입력해주세요.')
        return
      }
      if (this.editorData.trim() === '') {
        alert('내용을 입력해주세요.')
        return
      }
      if (this.title.length > 100) {
        alert('제목은 100자 이내로 가능합니다.')
        return
      }
      if (!this.selectCategoryId) {
        alert('카테고리를 선택해주세요.')
        return
      }

      let sendData = {
        title: this.title,
        content: this.editorData,
        categoryId: this.selectCategoryId,
      }

      this.isRegistBoardLoading = true

      this.$http.post('/community/board', sendData)
      .then((response) => {
        alert('등록 완료되었습니다.')
        this.$router.push(`/community?categoryId=${this.selectCategoryId}`);
      })
      .catch((err) => {
        alert('게시글 등록 중 오류가 발생하였습니다.')
        console.log(err)
      })
      .finally((response) => {
        this.isRegistBoardLoading = false
      })
    },
  },
  created () {
    if (this.$route.query.categoryType === 'admin') {
      this.categoryList = JSON.parse(localStorage.getItem('adminCategoryList'))
    } else {
      this.categoryList = JSON.parse(localStorage.getItem('categoryList'))
    }
    this.selectCategoryId = this.$route.query.categoryId
  },
  components: {
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component
  },
}
</script>

<style lang="scss" scoped>
.category-select {
  margin-bottom: 20px;
}
.spinner-border-sm {
  margin-right: 5px;
  margin-bottom: 4px;
}
.title-input-wrap {
  padding: 10px;
  background-color: white;
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 10px;
}
.title-input-wrap:hover {
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.title-input {
  width: 100%;
  border: 0;
  font-size: 18px;
}
.title-input:focus {
  outline: none;
}
div.ck {
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.button-wrap {
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {
  .title-input-wrap {
    margin-bottom: 20px;
  }
  .title-input {
    font-size: 16px;
  }
}
</style>