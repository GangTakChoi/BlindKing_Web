<template>
  <div class="content-container">
    친구목록
  </div>
</template>

<script>
export default {
  name: "Friends",
  data: () => {
    return {
      friendList: []
    }
  },
  created () {
    this.$http.get("/user/send-request-friends")
    .then((response) => {
      console.log(response.data)
    })
    .catch((err) => {

    })
  }
}
</script>

<style>

</style>