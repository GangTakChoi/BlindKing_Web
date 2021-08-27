<template>
  <div class="content-container">
    <div  v-if="this.$G.isLogin">
      <router-link to="/">
        <button v-if="isActiveMatching" :class="{ 'disabled' : isBlockUseTopMatchingDisplay }" class="top-show-button basic-button-design shadow-sm rounded" @click="useTopDisplay">
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
        <button class="friends-button basic-button-design shadow-sm rounded">
          친구목록
        </button>
      </router-link>
      <router-link to="/community">
        <button class="friends-button basic-button-design shadow-sm rounded">
          커뮤니티
        </button>
      </router-link>
      <router-link to="/suggest">
        <button class="suggest-button basic-button-design shadow-sm rounded">
          내정보관리
        </button>
      </router-link>
      <router-link to="/suggest">
        <button class="suggest-button basic-button-design shadow-sm rounded">
          문의하기
        </button>
      </router-link>
      <router-link to="/donation">
        <button class="donation-button basic-button-design shadow-sm rounded">
          후원하기
        </button>
      </router-link>
      <router-link to="/test">
        <button class="donation-button basic-button-design shadow-sm rounded">
          test
        </button>
      </router-link>
    </div>
    <div v-else>
      <div class="jumbotron jumbotron-fluid rounded">
        <div class="container">
          <h1 class="display-4">안녕하세요, 순수함과 설레임입니다.</h1>
          <p class="lead">
            현재 저희 서비스는 일반 소개팅 서비스에서 사진을 제외하고 오직 마음을 보는 것에 중점을 두어 제작하였습니다. <br>
            서비스 이용은 전부 무료이며 로그인을 통해 이용하실 수 있습니다. <br><br>
            저는 이 싸이트를 통해 남녀간의 건전한 소통과 만남이 많아 졌으면 하는 마음으로 만들었습니다. <br>
            편하게 이용해보시고 부족한 부분과 좋은 아이디어가 있다면 건의하기를 통해 건의해주시면 고려 후 개발진행하도록 하겠습니다. <br><br>
            또한 궁금한 것이 있으시다면 문의하기를 통해 질문해주세요.
          </p>
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