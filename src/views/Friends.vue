<template>
  <div class="content-container">
    <div class="top-button-wrap">
      <div class="friend-list-button basic-design shadow-sm" :class="{checked : this.pageCode === FRIEND_PAGE}" @click="changePage(FRIEND_PAGE)">
        친구목록
      </div>
      <div class="request-list-button basic-design shadow-sm" :class="{checked : this.pageCode === FRIEND_REQUEST_PAGE}" @click="changePage(FRIEND_REQUEST_PAGE)">
        요청목록
      </div>
      <div class="block-list-button basic-design shadow-sm" :class="{checked : this.pageCode === BLOCK_PAGE}" @click="changePage(BLOCK_PAGE)">
        차단목록
      </div>
    </div>
    
    <div class="friend-list-wrap" v-if="this.pageCode === FRIEND_PAGE">
      <div class="friend-info-row" v-for="(friendInfo, key) in friendAcceptList" :key="key" @click="moveFriendDetailPage(friendInfo.objectId)">
      <!-- <div class="friend-info-row" v-for="(friendInfo, key) in friendAcceptList" :key="key"> -->
        <span class="nickname-section">
          {{friendInfo.nickname}}
        </span>
        
        <div class="friend-row-button-wrap chatting">
          <span v-if="friendInfo.isUnReadMessage" class="unread-count-info">{{ '*' }}</span>
          <button type="button" class="btn btn-primary" @click="moveChattingRoom(friendInfo.objectId, friendInfo.nickname, key, $event)">
            대화방
          </button>
        </div>
        <button type="button" :id="'friendDeleteButton' + key" class="close" aria-label="Close" @click="deleteFriend(friendInfo, key, $event)" data-toggle="modal" data-target="#exampleModal">
          <span aria-hidden="true">&times;</span>
        </button>
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
      <div class="friend-info-row" v-for="(friendInfo, key) in friendRequestedList" :key="key" @click="moveFriendDetailPage(friendInfo.objectId)">
        <span>
          {{friendInfo.nickname}}
        </span>
        
        <div class="friend-row-button-wrap request-button-list">
          <button type="button" class="btn btn-primary" @click="acceptFriend(friendInfo.objectId, $event)">수락</button>
          <button type="button" class="btn btn-danger" @click="rejectFriend(friendInfo.objectId, $event)">거절</button>
          <button type="button" class="btn btn-dark" @click="blockFriend(friendInfo.objectId, $event)">차단</button>
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
      <div class="friend-info-row" v-for="(friendInfo, key) in friendBlockList" :key="key" @click="moveFriendDetailPage(friendInfo.objectId)">
        <span>
          {{friendInfo.nickname}}
        </span>
        
        <div class="friend-row-button-wrap">
          <button type="button" class="btn btn-primary" @click="releaseBlock(friendInfo.objectId, $event)">차단해제</button>
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

    <FriendDeleteModal :friendInfo="deleteFriendInfo" @requestComplete="refreshData" />
  </div>
</template>

<script>
import FriendDeleteModal from '@/components/FriendDeleteModal.vue'
import $ from 'jquery'
// 친구목록
const FRIEND_PAGE = 0;
// 요청목록
const FRIEND_REQUEST_PAGE = 1;
// 차단목록
const BLOCK_PAGE = 2;

export default {
  name: "Friends",
  components: { FriendDeleteModal },
  data: () => {
    return {
      pageCode: FRIEND_PAGE,
      friendRequestedList: [],
      friendAcceptList: [],
      friendBlockList: [],
      isResponseComplete: false,
      deleteFriendInfo: {
        nickname: ''
      },
    }
  },
  methods: {
    deleteFriend: function (friendInfo, key, e) {
      e.stopPropagation()

      this.deleteFriendInfo = friendInfo
      $('#friendDeleteButton' + key).click()
    },
    moveFriendDetailPage: function (friendObjectId) {
      this.$router.push('/matching/detail/' + friendObjectId);
    },
    moveChattingRoom: function (friendObjectId, friendNickName, key, e) {
      // Event Bubbling 방지
      e.stopPropagation()
      this.friendAcceptList[key].isUnReadMessage = false
      this.$router.push('/chatting-room/' + friendObjectId + '?nickname=' + friendNickName);
    },
    releaseBlock: function (friendObjectId, e) {
      // Event Bubbling 방지
      e.stopPropagation()
      if(!confirm("차단해제 하시겠습니까?")) {
        return
      }

      this.$http.post("/user/friend/" + friendObjectId + "/release-block")
      .then((response) => {
        if (response.status ===200) {
          alert("차단해제 되었습니다.")
        } else {
          alert("유효하지 않은 요청입니다.")
        }
        
        this.refreshData()
      })
      .catch((err) => {
        alert("차단해제 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    acceptFriend: function (friendObjectId, e) {
      e.stopPropagation()
      if(!confirm("수락 하시겠습니까?")) {
        return
      }
      this.$http.post("/user/friend/" + friendObjectId + "/accept")
      .then((response) => {
        if (response.status ===200) {
          alert("수락 되었습니다.")
        } else {
          alert("유효하지 않은 요청입니다.")
        }
        this.refreshData()
      })
      .catch((err) => {
        alert("친구 수락 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    rejectFriend: function (friendObjectId, e) {
      e.stopPropagation()
      if(!confirm("거절 하시겠습니까?")) {
        return
      }
      this.$http.post("/user/friend/" + friendObjectId + "/reject")
      .then((response) => {
        if (response.status ===200) {
          alert("거절 되었습니다.")
        } else {
          alert("유효하지 않은 요청입니다.")
        }
        this.refreshData()
      })
      .catch((err) => {
        alert("서버 요청중 오류가 발생하였습니다.\n다시 한번 시도해 주세요.\n문제가 지속되는 경우 문의부탁드립니다.")
        console.log(err)
      })
    },
    blockFriend: function (friendObjectId, e) {
      e.stopPropagation()
      if(!confirm("차단 하시겠습니까?")) {
        return
      }
      this.$http.post("/user/friend/" + friendObjectId + "/block")
      .then((response) => {
        if (response.status ===200) {
          alert("차단 되었습니다.")
        } else {
          alert("유효하지 않은 요청입니다.")
        }
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

    if ( this.getIsHistoryBack() ) {
      Object.assign(this.$data, JSON.parse(this.getCache()))
      this.isResponseComplete = true
    } else {
      this.refreshData()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.saveCache(this.$data)
    next()
  }
}
</script>

<style lang="scss" scoped>
.unread-count-info {
  display: inline-block;
  vertical-align: middle;
  padding: 2px 13px;
  border-radius: 10px;
  margin-right: 14px;
  background-color: #fd5f5f;
  color: #ffffff;
}
.nickname-section {
  display: block;
}
.top-button-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.basic-design {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  padding: 15px;
  font-size: 18px;
  width: 32%;
  text-align: center;
  background-color:#fff;
  // box-shadow: 2px 2px 4px -2px black;
}

.basic-design:hover:not(.checked) {
  background-color: #ebebeb;
  cursor: pointer;
}

.checked {
  background-color: #000;
  color: white;
}

.friend-list-wrap {
  margin-top: 28px;
  // padding: 1px;
  border: 1px solid #c8c8c8;
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


@media (min-width:768px) {
  .friend-row-button-wrap {
    display: inline-block;
    text-align: right;
    position: absolute;
    right: 15px;
    top: 19px;
  }
  .request-button-list .btn:not(:last-child) {
    margin-right: 5px;
  }
  .friend-info-row {
    font-size: 18px;
  }
  .chatting {
    right: 63px;
  }
  .close {
    position: relative;
    top: -42px;
    right: -12px
  }
}


@media (max-width: 768px) {
  .unread-count-info {
    padding: 3px 14px 4px 14px;
    font-size: 14px;
  }
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
  .request-button-list .btn:not(:last-child) {
    margin-right: 5px;
  }
  .chatting .btn {
    margin-right: 20px;
  }
  .friend-list-wrap {
    margin-top: 16px;
  }
  .close {
    position: relative;
    top: -76px;
    right: -6px
  }
}
</style>