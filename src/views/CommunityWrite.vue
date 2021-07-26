<template>
  <div class="content-container">
    <form @submit.prevent="submit">
      <div class="title-input-wrap shadow-sm">
        <input type="text" class="title-input" v-model="title">
      </div>
      <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" tag-name="textarea"></ckeditor>

      <div class="button-wrap">
        <button type="submit" class="btn btn-primary btn-lg">등록</button>
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
            uploadUrl: 'community/image-upload',

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
      let sendData = {
        title: this.title,
        content: this.editorData,
      }

      this.$http.post('/community/board', sendData)
      .then((response) => {
        alert('등록 완료되었습니다.')
        this.$router.push('/community');
      })
      .catch((err) => {
        console.log(err)
      })
    },
  },
  components: {
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
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