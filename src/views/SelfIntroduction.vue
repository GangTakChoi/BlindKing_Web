<template>
  <div class="content-container">
    <div class="d-flex justify-content-center" v-if="!isResponseComplete" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <form @submit.prevent="saveSelfIntroduce" v-if="isResponseComplete">
      <div class="form-group">
        <label for="exampleFormControlSelect1">출생년도 <span class="text-danger">(필수)</span></label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="birthYear">
          <option v-for="year, key in getYears()" :key="key">{{ year }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="exampleFormControlSelect1">MBTI <span class="text-danger">(필수)</span> <a href="https://www.16personalities.com/ko/%EB%AC%B4%EB%A3%8C-%EC%84%B1%EA%B2%A9-%EC%9C%A0%ED%98%95-%EA%B2%80%EC%82%AC" target="_blank">성격유형검사↗️</a></label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="userMBTI">
          <option v-for="(mbtiInfo, index) in mbtiList" :key="index" :value="mbtiInfo">{{mbtiInfo === 'unkown' ? '모르겠어요' : mbtiInfo}}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="exampleFormControlSelect1">지역 <span class="text-danger">(필수)</span></label>
        <select class="form-control" id="areaSelect1" v-model="selectUpperAreaCode">
          <option v-for="(areaInfo, index) in upperArea" :key="index" :value="areaInfo.code">{{ areaInfo.name }}</option>
        </select>
        <select class="form-control" id="areaSelect2" v-model="selectSubAreaCode" :disabled="!selectUpperAreaCode">
          <option v-for="(areaInfo, index) in subArea[selectUpperAreaCode]" :key="index" :value="areaInfo.code">{{ areaInfo.name }}</option>
        </select>
      </div>

      <div class="form-group" v-for="(questionInfo, index) in questionList" :key="index">
        <label for="exampleFormControlInput1">{{questionInfo.questionId.content}}</label>
        <input v-if="questionInfo.questionId.inputType === 'input'" type="text" class="form-control" v-model="questionInfo.answer">
        <textarea v-else-if="questionInfo.questionId.inputType === 'textarea'" class="form-control" rows="5" v-model="questionInfo.answer"></textarea>
        <textarea v-else class="form-control" rows="5" v-model="questionInfo.answer"></textarea>
      </div>
      
      <button type="submit" class="btn btn-primary btn-lg btn-block complete-btn" :disabled="isSaving">작성완료</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SelfIntroduction',
  data: () => {
    return {
      isSaving: false,
      mbtiList: [],
      selectUpperAreaCode: '',
      selectSubAreaCode: '',
      upperArea: [],
      subArea: {},
      isResponseComplete: false,
      birthYear: 0,
      questionList: [],
      getYears: () => {
        var now = new Date();	// 현재 날짜 및 시간
        var year = now.getFullYear() - 19;	// 올해 성년 출생년도
        let list = [];
        for (let i = 1910; i <= year; i += 1) list.push(i);
        return list
      },
    }
  },
  methods: {
    saveSelfIntroduce: function () {
      let reqBody = {
        birthYear: this.birthYear,
        mbti: this.userMBTI,
      }

      if (this.selectUpperAreaCode !== '' && this.selectSubAreaCode === '') {
        alert('지역 선택을 완료해주세요.')
        return
      }
      
      if (this.selectUpperAreaCode !== '' && this.selectSubAreaCode !== '') {
        reqBody.rootAreaCode = this.selectUpperAreaCode
        reqBody.subAreaCode = this.selectSubAreaCode
      }

      let questionListUpdateInfo = []

      this.questionList.forEach((element, index) => {
        questionListUpdateInfo[index] = {
          answer: element.answer,
          questionId: element.questionId._id
        }
      })

      reqBody.questionList = questionListUpdateInfo

      this.isSaving = true

      // 자기소개 정보 등록
      this.$http.post('/user/self-introduction', reqBody).then((response) => {
        if (response.status === 200) {
          alert('자기소개서가 저장되었습니다!')
          this.$router.push('/');
        }
      }).catch((error) => {
        alert('자기소개 작성이 실패하였습니다.')
        console.log(error);
      })
    }
  },
  created () {
    this.$http.get('/user/me').then(async (response) => {
      if (response.status === 200) {
        // 유저 정보
        let userInfo = response.data.userInfo
        this.birthYear = userInfo.birthYear
        this.userMBTI = userInfo.mbti
        this.questionList = userInfo.questionList

        // 지역 정보
        let regionInfo = response.data.regionInfo

        if (userInfo.region !== undefined) {
          this.selectUpperAreaCode = userInfo.region.rootAreaCode
          this.selectSubAreaCode = userInfo.region.subAreaCode
        }

        // 도,시 지역 할당
        this.upperArea = regionInfo.upperArea

        // 구 지역 할당
        await regionInfo.subArea.forEach((areaInfo) => {
          let isSubArea = Object.keys(this.subArea).includes(areaInfo.parentCode)

          if (!isSubArea) this.subArea[areaInfo.parentCode] = []

          this.subArea[areaInfo.parentCode].push({
            name: areaInfo.name,
            code: areaInfo.code,
          })
        })

        // mbti 정보
        this.mbtiList = response.data.mbtiList

        this.isResponseComplete = true
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  
}
</script>

<style lang="scss" scoped>
#areaSelect1 {
  margin-bottom: 10px;
}
.complete-btn {
  margin-top: 30px;
}
</style>