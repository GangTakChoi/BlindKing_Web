<template>
  <div class="content-container">
    <div class="drag-info-panel shadow-sm">
      드래그 하여 순서를 변경할 수 있습니다.
    </div>

    <div v-if="isChangeQuestionOrder" class="order-change-button-wrap">
      <button @click="saveQuestionOrder" type="button" class="btn btn-sm btn-primary">
        순서 저장
      </button>
      <button @click="initQuestionOrder" type="button" class="btn btn-sm btn-secondary">
        초기화
      </button>
    </div>
    
    <draggable v-model="questionList" @change="questionOrderChangeEvent()">
      <div v-for="(questionInfo, index) in questionList" class="question-info-wrap shadow-sm" :key="index">
        <template v-if="questionInfo.isDisabled">
          {{ questionInfo.content }}
        </template>
        <template v-else>
          <textarea class="form-control question-content-textarea" rows="2" v-model="questionInfo.content"></textarea>
        </template>
        <div class="input-type-wrap form-inline">
          <label class="input-type-label" :for="`inputType_${index}`">입력 유형: </label>
          <select class="custom-select custom-select-sm" :id="`inputType_${index}`" v-model="questionInfo.inputType" :disabled="questionInfo.isDisabled">
            <option v-for="inputType, key in inputTypeList" :key="key">{{ inputType }}</option>
          </select>
        </div>

        <div class="button-wrap">
          <button 
          v-if="questionInfo.isDisabled"
          @click="changeModifyMode(questionInfo)" type="button" class="btn btn-sm btn-success">
            수정
          </button>
          <button
          v-if="!questionInfo.isDisabled"
          @click="updateQuetionInfo(questionInfo)"  type="button" class="btn btn-sm btn-primary" :disabled="questionInfo.isLoading">
            <span v-if="questionInfo.isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            저장
          </button>
          <button
          v-if="!questionInfo.isDisabled"
          @click="cancelMode(questionInfo)" type="button" class="btn btn-sm btn-secondary">
            취소
          </button>
          <button type="button" 
          @click="deleteQuestion(questionInfo)" class="btn btn-danger btn-sm">삭제</button>
        </div>
      </div>
    </draggable>


    

    <div v-if="!isAddQuestionMode" @click="isAddQuestionMode = !isAddQuestionMode" class='question-info-wrap shadow-sm question-add-button-box'>
      <img class="plus-lg-img" src="@/assets/img/plus-lg.svg" alt="plus-lg">
    </div>
    <div v-else class="question-info-wrap shadow-sm">
      <textarea class="form-control question-content-textarea" rows="2" v-model="addQuestionInfo.content"></textarea>
      <div class="input-type-wrap form-inline">
        <label class="input-type-label" :for="'inputType_addQuestion'">입력 유형: </label>
        <select class="custom-select custom-select-sm" :id="'inputType_addQuestion'" v-model="addQuestionInfo.inputType">
          <option v-for="inputType, key in inputTypeList" :key="key">{{ inputType }}</option>
        </select>
      </div>
      <div class="button-wrap">
        <button @click="addQuestion" type="button" class="btn btn-sm btn-primary">
          저장
        </button>
        <button @click="isAddQuestionMode = false" type="button" class="btn btn-sm btn-secondary">
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'ManageQuestionPage',
  components: { draggable },
  data () {
    return {
      isChangeQuestionOrder: false,
      questionList: [],
      inputTypeList: ['input', 'textarea'],
      isAddQuestionMode: false,
      addQuestionInfo: {
        inputType: 'input',
        content: '',
      }
    }
  },
  methods: {
    saveQuestionOrder: function () {
      let questionOrderInfoList = []

      this.questionList.forEach((questionInfo, index) => {
        let tempQuestionInfo = {
          _id: questionInfo._id,
          order: index + 1
        }

        questionOrderInfoList.push(tempQuestionInfo)
      })

      let postBody = {
        questionOrderInfoList: questionOrderInfoList
      }

      this.$http.put('/admin/selt-introduction/question-list/order', postBody)
      .then((res) => {
        alert('순서 저장이 완료되었습니다.')
        console.log(res.data)
        this.loadData()
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    initData: function () {
      this.addQuestionInfo.inputType = 'input'
      this.addQuestionInfo.content = ''
      this.isAddQuestionMode = false
      this.isChangeQuestionOrder = false
    },
    initQuestionOrder: function () {
      this.loadData()
    },
    questionOrderChangeEvent: function () {
      this.isChangeQuestionOrder = true
    },
    deleteQuestion: function (questionInfo) {
      if (!confirm('정말 삭제하시겠습니까?')) return

      this.$http.delete(`/admin/selt-introduction/question-list/${questionInfo._id}`)
      .then((res) => {
        alert('삭제가 완료되었습니다.')
        this.loadData()
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    cancelMode: function (questionInfo) {
      questionInfo.content = questionInfo.originContent

      questionInfo.isDisabled = true
    },
    updateQuetionInfo: function (questionInfo) {
      if (!confirm('정말 수정하시겠습니까?')) return

      questionInfo.isLoading = true

      let postBody = {
        inputType: questionInfo.inputType,
        content: questionInfo.content,
      }

      this.$http.put(`/admin/selt-introduction/question-list/${questionInfo._id}`, postBody)
      .then((res) => {
        this.loadData()
        alert('저장이 완료되었습니다.')
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    addQuestion: function () {
      if (this.addQuestionInfo.content === '') {
        alert("질문 내용을 입력해주세요.")
        return
      }

      if (!confirm('정말 추가하시겠습니까?')) return

      let postBody = {
        inputType: this.addQuestionInfo.inputType,
        content: this.addQuestionInfo.content
      }

      this.$http.post(`/admin/selt-introduction/question`, postBody)
      .then((response) => {
        alert("질문 등록이 완료되었습니다.")
        this.loadData()
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    changeModifyMode: function (questionInfo) {
      questionInfo.originContent = questionInfo.content

      questionInfo.isDisabled = !questionInfo.isDisabled
    },
    loadData: function () {
      this.$http.get('/admin/selt-introduction/question-list')
      .then((res) => {
        this.initData()
        this.questionList = []

        res.data.questionList.forEach(questionInfo => {
          questionInfo.isDisabled = true
          questionInfo.isLoading= false

          this.questionList.push(questionInfo)
        });
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
  },
  created () {
    this.loadData()
  },
}
</script>

<style lang="scss" scoped>
.order-change-button-wrap {
  margin-bottom: 15px;
  button {
    margin-right: 10px;
  }
}
.drag-info-panel {
  background-color: #d7d7d7;
  text-align: center;
  margin-bottom: 15px;
  padding: 8px 14px;
  border: 1px solid #000000;
}
.question-info-wrap {
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid #ededed;
  padding: 8px 14px;
}
.question-info-wrap {
  margin-bottom: 15px;
}

.question-add-button-box {
  display: flex;
  flex-flow: column;
}
.question-add-button-box:hover {
  cursor: pointer;
  background-color: #ededed;
}

.plus-lg-img {
  height: 15px;
}

.custom-select {
  width: 120px;
  margin-left: 7px;
}
.input-type-wrap {
  margin-top: 5px; 
}
.input-type-label {
  font-size: 14px;
  margin-bottom: 0;
}
.button-wrap {
  margin-top: 8px;
  button {
    margin-right: 5px;
  }
}
.question-content-textarea {
  margin-bottom: 10px;
}
</style>