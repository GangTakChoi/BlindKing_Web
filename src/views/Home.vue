<template>
  <div class="content-container">
    <div  v-if="this.$G.isLogin">
      <router-link to="/self-introduction">
        <button class="self-introduce-button basic-button-design shadow rounded">
          자기소개 작성
        </button>
      </router-link>
      <router-link to="/matching">
        <button class="matching-button basic-button-design shadow rounded">
          인연 찾기
        </button>
      </router-link>
      <router-link to="/friends">
        <button class="friends-button basic-button-design shadow rounded">
          친구목록
        </button>
      </router-link>
      <router-link to="/friends">
        <button class="friends-button basic-button-design shadow rounded">
          커뮤니티
        </button>
      </router-link>
      <router-link to="/suggest">
        <button class="suggest-button basic-button-design shadow rounded">
          내정보관리
        </button>
      </router-link>
      <router-link to="/suggest">
        <button class="suggest-button basic-button-design shadow rounded">
          문의하기
        </button>
      </router-link>
      <router-link to="/donation">
        <button class="donation-button basic-button-design shadow rounded">
          후원하기
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
export default {
  name: 'Home',
}
</script>

<style lang="scss" scoped>

.lead {
  margin-top: 50px;
}

.jumbotron-fluid {
  padding-left: 20px;
  padding-right: 20px;
  background-color: #dae0e5;
}

// .basic-button-design {
//   display: block;
//   margin: 20px auto 0 auto;
//   border: 0;
//   width: 100%;
//   height: 66px;
//   border-radius: 40px;
//   font-size: 25px;
//   color: #fff;
//   transition-duration: 0.4s;
//   box-shadow: 2px 2px 8px -2px black;
// }
.basic-button-design {
  display: block;
  margin: 50px auto 0 auto;
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
// .self-introduce-button {
//   background: #3c3c3c;
// }
// .matching-button {
//   background: #ff7e7e;
// }
// .donation-button {
//   background: #6183ff;
// }
// .friends-button {
//   background: #66ce5e;
// }
// .suggest-button {
//   background: #aeaeae;
// }
.basic-button-design:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .basic-button-design {
    width: 100%;
  }
}
</style>