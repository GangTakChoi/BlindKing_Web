<template>
  <div class="content-container">
    <div v-if="!$global.isLogin && !$global.isLoadingUserInfo" class="greeting-panel shadow">
      <h3 class="greeting-title">안녕하세요, BlindKing 입니다.</h3>
      <!-- <hr> -->
      <pre class="greeting-content">
        이 사이트는 완전 무료 소개팅을 목적으로 만들어졌습니다.
        
        제작자인 저는 기존 유료로 사용되는 소개팅을 이용해 본 적이 있었고
        "과연 돈이 개입된 시스템에서 남녀간의 순수한 만남이 가능할까?" 라는 생각을 하였고
        "완전 무료 소개팅 서비스가 있었으면 좋겠다" 라는 마음으로 제작하게 된 사이트입니다.

        또한 제작자인 저의 취향으로 오직 그 사람이 어떤 가치, 감정을 추구하는 사람인지
        아는 것에 초점을 맞추서 제작되어 본인 사진은 등록할 수 없다는 점 참고해주세요.

        커뮤니티의 건의사항 게시판을 통해 많은 피드백과 아이디어 부탁드립니다.
      </pre>
    </div>

    <div>

      <button @click="activeMatching" :disabled="isLoadActiveMatching || !$global.isLogin" class="matching-active-button basic-button-design shadow-sm rounded">
        매칭 활성화 
        <span class="on-off-button" :class="{ 'matching-on-status-style': isMatchingOnStyle, 'matching-off-status-style': isMatchingOffStyle }">
          <div v-if="isLoadActiveMatching" class="spinner-border" role="status" style="width: 1.1rem; height: 1.1rem;">
            <span class="sr-only">Loading...</span>
          </div>
          <span v-else>{{ $global.isActiveMatching ? 'ON' : 'OFF' }}</span>
        </span>
      </button>

      <button v-if="$global.isActiveMatching" @click="useTopDisplay" class="top-show-button basic-button-design shadow-sm rounded">
        매칭 상위 노출
        <br>
        <span v-if="isBlockUseTopMatchingDisplay" style="font-size:16px; font-weight:normal; color: red;">
          재사용 대기시간 {{reUseWaitingTime}}
        </span>
        <span v-else class="matching-add-info-text blinking">
          사용 가능 (재사용 대기시간: 4시간)
        </span>
      </button>

      <button @click="movePage('자기소개')" class="self-introduce-button basic-button-design shadow-sm rounded" :disabled="!$global.isLogin">
        자기소개 작성
      </button>
      
      <button @click="movePage('인연찾기')" class="matching-button basic-button-design shadow-sm rounded" :disabled="!$global.isLogin">
        인연 찾기
      </button>

      <button @click="movePage('친구목록')" class="basic-button-design shadow-sm rounded" :disabled="!$global.isLogin">
        친구 목록
      </button>

      <button @click="movePage('커뮤니티')" class="basic-button-design shadow-sm rounded">
        커뮤니티
      </button>

      <button @click="movePage('내정보')" class="basic-button-design shadow-sm rounded" :disabled="!$global.isLogin">
        내정보
      </button>

      <button v-if="$global.isAdmin && $global.isLogin" @click="movePage('신고관리')" class="basic-button-design shadow-sm rounded">
        신고관리
      </button>

      <button v-if="$global.isAdmin && $global.isLogin" @click="movePage('질문관리')" class="basic-button-design shadow-sm rounded">
        질문관리
      </button>

      <!-- <button @click="moveDonatePage" class="basic-button-design shadow-sm rounded">
        후원하기
      </button> -->

      <!-- <router-link to="/test">
        <button class="basic-button-design shadow-sm rounded">
          test
        </button>
      </router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => {
    return {
      isLoadActiveMatching: false,
      topDisplayReuseLatencyTime: Number,
      matchingTopDisplayUseingTime: Number,
      isBlockUseTopMatchingDisplay: false,
      reUseWaitingTime: '',
    }
  },
  computed: {
    isMatchingOnStyle: function () {
      return this.$global.isActiveMatching && !this.isLoadActiveMatching
    },
    isMatchingOffStyle: function () {
      return !this.$global.isActiveMatching && !this.isLoadActiveMatching
    }
  },
  methods: {
    moveDonatePage: function () {
      window.open('https://toon.at/donate/637662824189086998')
    },
    movePage: function (type) {
      if (type === '자기소개') this.$router.push('/self-introduction')
      else if (type === '인연찾기') this.$router.push('/matching')
      else if (type === '친구목록') this.$router.push('/friends')
      else if (type === '커뮤니티') this.$router.push('/community')
      else if (type === '내정보') this.$router.push('/mypage')
      else if (type === '신고관리') this.$router.push('/report')
      else if (type === '질문관리') this.$router.push('/manage-question')
    },
    useTopDisplay: function () {
      this.$http.put('/user/matching-top-display')
      .then((response) => {
        alert('매칭 상위 노출이 완료되었습니다!')
        this.isBlockUseTopMatchingDisplay = true
        this.$cookies.set('matchingTopDisplayUseingTime', response.data.matchingTopDisplayUseingTime)
        this.displayReUseWaitingTime()
      })
      .catch((error) => {
        if (error.response.data.matchingTopDisplayUseingTime !== undefined) {
          this.$cookies.set('matchingTopDisplayUseingTime', error.response.data.matchingTopDisplayUseingTime)
        }
        alert(error.response.data.errorMessage)
      })
    },
    activeMatching: function () {
      this.isLoadActiveMatching = true

      this.$http.put('/user/active-matching')
      .then((response) => {
        this.$global.isActiveMatching = response.data.isActiveMatching
        this.$cookies.set('matchingTopDisplayUseingTime', response.data.matchingTopDisplayUseingTime)

        if (this.$global.isActiveMatching) {
          alert("매칭이 활성화 되었습니다.")
        } else {
          alert("매칭이 비활성화 되었습니다.")
        }

        if (response.data.isUseMatchingTopDisplay) {
          this.isBlockUseTopMatchingDisplay = true
          this.displayReUseWaitingTime()
        }
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
      .finally(() => {
        this.isLoadActiveMatching = false
      })
    },
    displayReUseWaitingTime: function () {
      let matchingTopDisplayUseingTime = Number(this.$cookies.get('matchingTopDisplayUseingTime'))
      // 상위노출 재사용 대기 시간 설정 (시간단위 값 설정)
      let reuseLatencyHours = 4

      const nowDateTime = Date.now()

      const timeDiffTime = nowDateTime - matchingTopDisplayUseingTime
      const fourHoursTime = 1000 * 60 * 60 * reuseLatencyHours

      if (timeDiffTime >= fourHoursTime) {
        this.isBlockUseTopMatchingDisplay = false
        return
      }

      this.isBlockUseTopMatchingDisplay = true

      const displayTime = fourHoursTime - timeDiffTime

      const timeDiffMin = displayTime / 1000 / 60

      let displayDiffHour = Math.floor(displayTime / 1000 / 60 / 60)
      let displayDiffMin = Math.floor(timeDiffMin - (displayDiffHour * 60))
      let displayDiffSec = Math.floor(displayTime / 1000 - (Math.floor(timeDiffMin) * 60))

      displayDiffHour = '0' + displayDiffHour
      if (displayDiffMin < 10) displayDiffMin = '0' + displayDiffMin
      if (displayDiffSec < 10) displayDiffSec = '0' + displayDiffSec

      this.reUseWaitingTime = `${displayDiffHour}:${displayDiffMin}:${displayDiffSec}`

      setTimeout(() => {
        this.displayReUseWaitingTime()
      }, 1000)
    }
  },
  created () {
    this.displayReUseWaitingTime()
  },
}
</script>

<style lang="scss" scoped>
.greeting-content {
  white-space: pre-line;
  font-size: 18px;
  margin: 0;
  margin-top: 26px;
  color: #696969;
}
.greeting-panel { 
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 50px auto;
  background-color: #ffffff;
  padding: 30px 25px;
  border-radius: 20px;
  text-align: center;
}
@media (max-width: 768px) {
  .greeting-content {
    font-size: 16px;
    margin-top: 20px;
  }
  .greeting-panel {
    padding: 17px;
    margin-bottom: 36px;
    text-align: left;
  }
  .greeting-title {
    font-size: 22px;
  }
}
.basic-button-design:disabled {
  opacity: 0.4;
  cursor: default;
}
.disabled {
  opacity: 0.4;
  cursor: default;
}
.basic-button-design {
  display: block;
  margin: 0 auto;
  border: solid 0px #000;
  width: 100%;
  max-width: 1000px;
  height: 66px;
  font-size: 21px;
  color: #212529;
  transition-duration: 0.4s;
  box-shadow: 1px 1px 6px -2px black;
  background-color: #fff;
}
.basic-button-design:not(:first-child) {
  margin-top: 20px;
}
.on-off-button {
  position: relative;
  top: -2px;
  display: inline-block;
  height: 25px;
  line-height: 23px;
  margin-left: 10px;
  font-size: 16px;
  padding: 0 10px;
  border-radius: 3px;
  background-color: #ffffff;
  color: #000000;
}
.matching-on-status-style {
  background-color: #32ff5f;
  color: #000000;
}
.matching-off-status-style {
  background-color: #ff3232;
  color: #ffffff;
}
.matching-active-button {
  color: #ffffff;
  background-color: #000000;
}
.matching-button-wrap {
  margin: 0 auto 0 auto;
}
.basic-button-design:hover {
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.top-show-button {
  font-weight: bold;
  line-height: 25px;
  // color: #ff5656;
}

.matching-add-info-text {
  font-size:16px;
  font-weight:normal;
  color: red;
}

@media (max-width: 768px) {
  .basic-button-design {
    width: 100%;
  }
}
</style>