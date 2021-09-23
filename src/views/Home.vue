<template>
  <div class="content-container">
    <div  v-if="this.$global.isLogin">
      <router-link to="/">
        <button v-if="isActiveMatching" class="top-show-button basic-button-design shadow-sm rounded" @click="useTopDisplay">
          매칭 상위 노출
          <br>
          <span v-if="isBlockUseTopMatchingDisplay" style="font-size:16px; font-weight:normal; color: red;">
            재사용 대기시간 {{reUseWaitingTime}}
          </span>
          <span v-else style="font-size:16px; font-weight:normal; color: red;" class="blinking">
            사용 가능 (재사용 대기시간: 4시간)
          </span>
        </button>
        <button class="matching-active-button basic-button-design shadow-sm rounded" @click="activeMatching" :disabled="isLoadActiveMatching">
          매칭 활성화 
          <span class="on-off-button" :class="{ 'matching-on-status-style': isMatchingOnStyle, 'matching-off-status-style': isMatchingOffStyle }">
            <div v-if="isLoadActiveMatching" class="spinner-border" role="status" style="width: 1.1rem; height: 1.1rem;">
              <span class="sr-only">Loading...</span>
            </div>
            <span v-if="!isLoadActiveMatching">{{ isActiveMatching ? 'ON' : 'OFF' }}</span>
          </span>
        </button>
      </router-link>
      <router-link to="/self-introduction">
        <button class="self-introduce-button basic-button-design shadow-sm rounded">
          자기소개 작성
        </button>
      </router-link>
      <router-link to="/matching">
        <button class="matching-button basic-button-design shadow-sm rounded">
          인연 찾기
        </button>
      </router-link>
      <router-link to="/friends">
        <button class="basic-button-design shadow-sm rounded">
          친구목록
        </button>
      </router-link>
      <router-link to="/community">
        <button class="basic-button-design shadow-sm rounded">
          커뮤니티
        </button>
      </router-link>
      <router-link to="/mypage">
        <button class="basic-button-design shadow-sm rounded">
          내정보
        </button>
      </router-link>
      <!-- <router-link to="www.naver.com" target="_blank"> -->
      <a href="https://toon.at/donate/637662824189086998" target="_blank">
        <button class="basic-button-design shadow-sm rounded">
          후원하기
        </button>
      </a>
      <!-- </router-link> -->
      <!-- <router-link to="/test">
        <button class="basic-button-design shadow-sm rounded">
          test
        </button>
      </router-link> -->
    </div>
    <div v-else>
      <div class="jumbotron jumbotron-fluid rounded">
        <div class="container">
          <h1 class="display-5">안녕하세요, 1인 개발자 비발디 입니다.</h1>
          <pre class="lead">
            개발자 취업을 위해 포트폴리오용으로 개발된 싸이트이며,
            평소에 사진이 없는 소개팅이 있으면 좋겠다는 생각을 했고
            포트폴리오를 만드는 겸 이 싸이트를 개발하게 되었습니다.
            모든 서비스는 무료로 진행하지만 후원하기 기능과 제 월급을 통해 서버유지비를 충당할 계획이고
            서버유지비가 감당하기 힘든 수준을 넘어가면 서비스를 중단할 예정입니다.
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'

export default {
  name: 'Home',
  data: () => {
    return {
      isActiveMatching: false,
      isLoadActiveMatching: false,
      topDisplayReuseLatencyTime: Number,
      matchingTopDisplayUseingTime: Number,
      isBlockUseTopMatchingDisplay: false,
      reUseWaitingTime: '',
    }
  },
  computed: {
    isMatchingOnStyle: function () {
      return this.isActiveMatching && !this.isLoadActiveMatching
    },
    isMatchingOffStyle: function () {
      return !this.isActiveMatching && !this.isLoadActiveMatching
    }
  },
  methods: {
    useTopDisplay: function () {
      this.$http.put('/user/matching-top-display')
      .then((response) => {
        alert('매칭 상위 노출이 완료되었습니다!')
        this.isBlockUseTopMatchingDisplay = true
        this.displayReUseWaitingTime()
      })
      .catch((error) => {
        alert(error.response.data.errorMessage)
      })
    },
    activeMatching: function () {
      this.isLoadActiveMatching = true

      this.$http.put('/user/active-matching')
      .then((response) => {
        this.isActiveMatching = response.data.isActiveMatching

        if (this.isActiveMatching) {
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
      let matchingTopDisplayUseingTime = Number(VueCookies.get('matchingTopDisplayUseingTime'))
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
    if (VueCookies.get('isActiveMatching') === 'true') this.isActiveMatching = true
    else this.isActiveMatching = false

    this.displayReUseWaitingTime()
  },
}
</script>

<style lang="scss" scoped>
.disabled {
  opacity: 0.6;
  cursor: default;
}
.lead {
  margin-top: 50px;
  font-size: 1.3rem;
  white-space: pre-line;
}
.jumbotron-fluid {
  padding-left: 20px;
  padding-right: 20px;
  background-color: #dae0e5;
}
.basic-button-design {
  display: block;
  margin: 30px auto 0 auto;
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
a:first-of-type .basic-button-design {
  margin-top: 0;
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

.blinking {
  -webkit-animation:blink 1.0s ease-in-out infinite alternate;
  -moz-animation:blink 1.0s ease-in-out infinite alternate;
  animation:blink 1.0s ease-in-out infinite alternate;
} 
@-webkit-keyframes blink {
  0% {opacity:0.3;}
  100% {opacity:1;}
}
@-moz-keyframes blink {
  0% {opacity:0.3;}
  100% {opacity:1;}
}
@keyframes blink {
  0% {opacity:0.3;}
  100% {opacity:1;}
}

@media (max-width: 768px) {
  .basic-button-design {
    width: 100%;
  }
}
</style>