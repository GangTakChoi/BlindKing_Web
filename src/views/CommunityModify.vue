<template>
  <div class="content-container">
    <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <form v-else @submit.prevent="submit">
      <div class="title-input-wrap shadow-sm">
        <input type="text" class="title-input" v-model="title">
      </div>
      <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" tag-name="textarea"></ckeditor>

      <div class="button-wrap">
        <button type="submit" class="btn btn-primary btn-lg" :disabled="isRegistBoardLoading">
          <span v-show="isRegistBoardLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          수정완료
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import ClassicEditor from '@/assets/js/ckeditor';
import CKEditor from '@ckeditor/ckeditor5-vue2';

export default {
  name: "CommunityWrite",
  data: () => {
    return {
      isResponseComplete: false,
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
                // Authorization: 'Bearer <JSON Web Token>'
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

      let sendData = {
        title: this.title,
        content: this.editorData,
      }

      this.isRegistBoardLoading = true

      this.$http.put('/community/board/' + this.$route.params.boardId, sendData)
      .then((response) => {
        alert('수정 완료되었습니다.')
        this.$router.push('/community/detail/' + this.$route.params.boardId);
      })
      .catch((err) => {
        alert('게시글 수정 중 오류가 발생하였습니다.')
        console.log(err)
      })
      .finally((response) => {
        this.isRegistBoardLoading = false
      })
    },
  },
  created () {
    this.$http.get('/community/board/' + this.$route.params.boardId)
    .then((response) => {
      this.title = response.data.result.title
      this.editorData = response.data.result.content
      this.isResponseComplete = true
    })
    .catch((error) => {
      alert("페이지 로드 중 오류가 발생했습니다.")
    })
  },
  components: {
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component
  },
}
</script>

<style lang="scss" scoped>
.spinner-border-sm {
  margin-right: 5px;
  margin-bottom: 4px;
}
.title-input-wrap {
  padding: 10px;
  background-color: white;
  width: 100%;
  height: 50px;
  margin-bottom: 40px;
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