<template>
  <div class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0;">
    <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
      <div class="toast-header">
        <!-- <img src="..." class="rounded mr-2" alt="..."> -->
        <strong class="mr-auto">{{ nickname }}</strong>
        <!-- <small>11 mins ago</small> -->
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToastPopup",
  props: {
    nickname: '',
    message: '',
  }
}
</script>

<style lang="scss" scoped>
.toast {
  min-width: 300px;
}

@media (max-width: 768px) {
  .toast {
    min-width: 200px;
  }
}
</style>