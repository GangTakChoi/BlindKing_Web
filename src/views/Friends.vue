<template>
  <div class="content-container">
    <div class="top-button-wrap">
      <div class="friend-list-button basic-design" :class="{checked : this.pageCode === FRIEND_PAGE}" @click="changePage(FRIEND_PAGE)">
        친구목록
      </div>
      <div class="request-list-button basic-design" :class="{checked : this.pageCode === FRIEND_REQUEST_PAGE}" @click="changePage(FRIEND_REQUEST_PAGE)">
        요청목록
      </div>
      <div class="block-list-button basic-design" :class="{checked : this.pageCode === BLOCK_PAGE}" @click="changePage(BLOCK_PAGE)">
        차단목록
      </div>
    </div>
    
    <div class="friend-list-wrap" v-if="this.pageCode === FRIEND_PAGE">
      <div class="friend-info-row" v-for="(friendInfo, key) in friendAcceptList" :key="key">
        <span class="friend-nickname">
          {{friendInfo.nickname}}
        </span>
        
        <div class="friend-row-button-wrap">
          <button type="button" class="btn btn-primary">대화</button>
        </div>
      </div>
      <div v-if="friendAcceptList.length === 0 && isResponseComplete" class="friend-info-row not-hover">
        친구 목록이 없습니다.
      </div>
      <div class="d-flex justify-content-center m-5" v-if="!isResponseComplete">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div class="friend-list-wrap" v-if="this.pageCode === FRIEND_REQUEST_PAGE">
      <div class="friend-info-row" v-for="(friendInfo, key) in friendRequestedList" :key="key">
        <span class="friend-nickname">
          {{friendInfo.nickname}}
        </span>
        
        <div class="friend-row-button-wrap">
          <button type="button" class="btn btn-primary" @click="acceptFriend(friendInfo.objectId)">수락</button>
          <button type="button" class="btn btn-danger" @click="rejectFriend(friendInfo.objectId)">거절</button>
          <button type="button" class="btn btn-dark" @click="blockFriend(friendInfo.objectId)">차단</button>
        </div>
      </div>
      <div v-if="friendRequestedList.length === 0 && isResponseComplete" class="friend-info-row not-hover">
        요청 목록이 없습니다.
      </div>
      <div class="d-flex justify-content-center m-5" v-if="!isResponseComplete">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div class="friend-list-wrap" v-if="this.pageCode === BLOCK_PAGE">
      <div class="friend-info-row" v-for="(friendInfo, key) in friendBlockList" :key="key">
        <span class="friend-nickname">
          {{friendInfo.nickname}}
        </span>
        
        <div class="friend-row-button-wrap">
          <button type="button" class="btn btn-primary">차단해제</button>
        </div>
      </div>
      <div v-if="friendBlockList.length === 0 && isResponseComplete" class="friend-info-row not-hover">
        차단 목록이 없습니다.
      </div>
      <div class="d-flex justify-content-center m-5" v-if="!isResponseComplete">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
// 친구목록
const FRIEND_PAGE = 0;
// 요청목록
const FRIEND_REQUEST_PAGE = 1;
// 차단목록
const BLOCK_PAGE = 2;

export default {
  name: "Friends",
  data: () => {
    return {
      pageCode: FRIEND_PAGE,
      friendRequestedList: [],
      friendAcceptList: [],
      friendBlockList: [],
      isResponseComplete: false
    }
  },
  methods: {
    acceptFriend: function (friendObjectId) {
      if(!confirm("수락 하시겠습니까?")) {
        return
      }
      this.$http.post("/user/friend/" + friendObjectId + "/accept")
      .then((response) => {
        alert("수락되었습니다.")
        this.refreshData()
      })
      .catch((err) => {
        alert("친구 수락 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    rejectFriend: function (friendObjectId) {
      if(!confirm("거절 하시겠습니까?")) {
        return
      }
      this.$http.post("/user/friend/" + friendObjectId + "/reject")
      .then((response) => {
        alert("거절되었습니다.")
        this.refreshData()
      })
      .catch((err) => {
        alert("서버 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    blockFriend: function (friendObjectId) {
      if(!confirm("차단 하시겠습니까?")) {
        return
      }
      this.$http.post("/user/friend/" + friendObjectId + "/block")
      .then((response) => {
        alert("차단되었습니다.")
        this.refreshData()
      })
      .catch((err) => {
        alert("서버 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    refreshData: function () {
      this.$http.get("/user/friends")
      .then((response) => {
        if (response.status !== 200) {
          throw("응답 에러")
        }

        this.friendRequestedList = response.data.friendRequestedList
        this.friendAcceptList = response.data.friendAcceptList
        this.friendBlockList = response.data.friendBlockList

        this.isResponseComplete = true
      })
      .catch((err) => {
        alert("페이지 로드중 에러가 발생했습니다.\n문의부탁드립니다.")
        console.log(err)
      })
    },
    changePage: function (changePageCode) {
      this.pageCode = changePageCode
    }
  },
  created () {
    this.FRIEND_PAGE = FRIEND_PAGE
    this.FRIEND_REQUEST_PAGE = FRIEND_REQUEST_PAGE
    this.BLOCK_PAGE = BLOCK_PAGE

    this.refreshData()
  }
}
</script>

<style lang="scss" scoped>
.top-button-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.basic-design {
  // border: 1px solid #000;
  border-radius: 5px;
  padding: 15px;
  font-size: 18px;
  width: 32%;
  text-align: center;
  background-color:#fff;
  box-shadow: 2px 2px 4px -2px black;
}

.basic-design:hover:not(.checked) {
  background-color: rgb(230, 230, 230);
  cursor: pointer;
}

.checked {
  background-color: #000;
  color: white;
}

.friend-list-wrap {
  margin-top: 28px;
}

.friend-info-row {
  padding: 25px;
  background: white;
  margin-bottom: 1px;
}
.friend-info-row:hover:not(.not-hover) {
  background-color: #f9f9f9;
  cursor: pointer;
}

.friend-info-row {
  position: relative;
}

.btn {
  margin-right: 4px;
}


@media (min-width:768px) {
  .friend-row-button-wrap {
    display: inline-block;
    text-align: right;
    position: absolute;
    right: 15px;
    top: 19px;
  }
  .friend-nickname {
    font-size: 18px;
  }
}


@media (max-width: 768px) {
  .basic-design {
    font-size: 16px;
    width: 30%;
  }
  .friend-info-row {
    font-size: 16px;
    padding: 16px;
  }
  .friend-row-button-wrap {
    text-align: right;
    font-size: 10px;
    margin-top: 7px;
  }
  .btn {
    font-size: 14px;
  }
}
</style>