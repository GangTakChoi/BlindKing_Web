<template>
  <div class="content-container">
    <div  v-if="this.$G.isLogin">
      <router-link to="/self-introduction">
        <button class="self-introduce-button basic-button-design">
          자기소개 작성
        </button>
      </router-link>
      <router-link to="/matching">
        <button class="matching-button basic-button-design">
          인연 찾기
        </button>
      </router-link>
      <router-link to="/friends">
        <button class="friends-button basic-button-design">
          친구 목록
        </button>
      </router-link>
      <router-link to="/suggest">
        <button class="suggest-button basic-button-design">
          건의 하기
        </button>
      </router-link>
      <router-link to="/donation">
        <button class="donation-button basic-button-design">
          후원 하기
        </button>
      </router-link>
    </div>
    <span v-else>로그인을 해주세요~</span>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style lang="scss" scoped>
.basic-button-design {
  display: block;
  margin: 20px auto 0 auto;
  border: 0;
  width: 100%;
  height: 66px;
  border-radius: 40px;
  font-size: 25px;
  color: #fff;
  transition-duration: 0.4s;
  box-shadow: 2px 2px 8px -2px black;
}
.self-introduce-button {
  background: #3c3c3c;
}
.matching-button {
  background: #ff7e7e;
}
.donation-button {
  background: #6183ff;
}
.friends-button {
  background: #66ce5e;
}
.suggest-button {
  background: #aeaeae;
}
.basic-button-design:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .basic-button-design {
    width: 100%;
  }
}
</style>