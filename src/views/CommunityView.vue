<template>
  <div class="content-container">
    <div class="board-view-wrap shadow">
      <div class="title">
        {{ title }}
      </div>
      <hr>
      <div class="content ck-content" v-html="content">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommunityView",
  data: () => {
    return {
      title: '',
      content: '',
    }
  },
  created () {
    this.$http.get('/community/detail/' + this.$route.params.boardId)
    .then((response) => {
      console.log(response)
      this.title =  response.data.result.title
      this.content = response.data.result.content
    })
    .catch((err) => {
      console.log(err)
    }) 
    
  },
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  font-weight: bold;
  font-size: 18px;
}
.board-view-wrap {
  width: 100%;
  background-color: #fff;
  min-height: 100px;
  border-radius: 5px;
  padding: 20px;
}
</style>