<template>
  <div class="content-container">
    <div class="chatting-room-frame shadow">
      <div class="chatting-headline">
        {{ $route.query.nickname }}
        <button class="btn btn-warning report-button" data-toggle="modal" data-target="#reportUserModal">신고</button>
      </div>
      <div id="chatting-message-display">
        <div v-for="(msgInfo, key) in messageList" :key="key" 
          class="sppech-bubble-frame shadow-sm" 
          :class="{ 
            'female-sppech-bubble' : msgInfo.gender === 'female',
            'male-sppech-bubble': msgInfo.gender === 'male',
            'my-sppech-bubble': msgInfo.isMe,
          }"
        >
          {{msgInfo.message}}
        </div>
      </div>
      <div class="input-section">
        <small v-if="!$global.isMobile" id="emailHelp" class="form-text text-muted">줄바꿈 shift + enter</small>
        <textarea :disabled="isClose" v-if="!$global.isMobile" v-model="message" class="form-control" rows="3" v-on:keypress.enter="sendMessage" v-on:keyup.enter.prevent maxlength="5000">
        </textarea>
        <textarea :disabled="isClose" v-else v-model="message" class="form-control" rows="3" maxlength="5000">
        </textarea>
        <div class="text-length-info">{{message.length}} / 5000</div>
        <button :disabled="isClose" class="btn btn-primary" @click="sendMessage">전송</button>
      </div>
    </div>

    <!-- 모바일에서만 표시되는 뒤로가기 버튼 -->
    <div v-if="$global.isMobile" class="back-button" @click="goBack">
      <img src="@/assets/img/arrow-left-circle.svg" width="25"/>
    </div>

    <ReportUserModal :friendId="$route.params.friendObjectId" :target="'채팅'"/>
  </div>
</template>

<script>
import io from '@/assets/js/socket.io.js'
import ReportUserModal from '@/components/ReportUserModal.vue'

export default {
  name: "ChattingRoom",
  components: { ReportUserModal },
  data: () => {
    return {
      token: '',
      nickname: '',
      messageList: [],
      message: "",
      socket: {},
      isClose: false,
      isAlramSocketDisconnect: true,
    }
  },
  methods: {
    goBack: function () {
      history.back()
    },
    sendMessage: async function (e) {
      if (e.shiftKey) {
        return
      }
      if (this.message.trim() === "") {
        this.message = ""
        return
      }

      let msgInfo = {
        nickname: this.nickname,
        msg: this.message
      }

      this.socket.emit("sendMessage", msgInfo)

      this.message = "";
      // 메세지 전송 후 개행 방지
      e.preventDefault();
    }
  },
  created () {
    this.token = this.$cookies.get('token')
    this.nickname = this.$cookies.get('nickname')

    this.socket = io(process.env.VUE_APP_BASE_API_HOST + '/chatting')

    this.socket.on("connectSuccess", () => {
      let data = {
        myToken: this.token,
        friendObjectId: this.$route.params.friendObjectId
      }

      this.socket.emit("setData", data)

      this.socket.on("completeSetData", () => {
        this.socket.emit("goInChattingRoom")
      })
    })

    this.socket.on("loadMessage", async (data) => {
      this.isClose = data.isChattingRoomClose

      if (this.isClose) {
        this.message = "상대방이 채팅방을 나갔습니다."
      }

      await data.messageRecords.forEach((messaeInfo) => {
        let myGender = this.$cookies.get('gender')
        let yourGender = myGender === 'male' ? 'female' : 'male'
        
        let isMe = messaeInfo.userObjectId === data.myObjectId  ? true : false
        let msgInfo = {
          isMe: isMe,
          gender: isMe ? myGender : yourGender,
          message: messaeInfo.content
        }
        this.messageList.push(msgInfo)
      })

      var displayDiv = document.getElementById("chatting-message-display")
      displayDiv.scrollTop = displayDiv.scrollHeight
    })

    this.socket.on("brodcastMessage", async (data) => {
      let myGender = this.$cookies.get('gender')
      let yourGender = myGender === 'male' ? 'female' : 'male'
      let isMe = data.nickname === this.nickname ? true : false

      let msgInfo = {
        isMe: isMe,
        gender: isMe ? myGender : yourGender,
        message: data.msg
      }

      await this.messageList.push(msgInfo);

      var displayDiv = document.getElementById("chatting-message-display")
      displayDiv.scrollTop = displayDiv.scrollHeight

      if (!isMe) this.socket.emit("completeRead")
    })

    this.socket.on("disconnect", () => {
      if (!this.isAlramSocketDisconnect) return
      
      alert('상대와의 연결이 끊겼습니다.\n새로고침 또는 대화방을 재입장 해주세요.')
    });
  },
  beforeRouteLeave (to, from, next) {
    this.isAlramSocketDisconnect = false
    this.socket.disconnect()
    next()
  },
}
</script>

<style lang="scss" scoped>
.report-button {
  position: absolute;
  top: 11px;
  right: 9px;
  padding: 3px 6px;
  font-size: 14px;
}
#chatting-message-display {
  width: 100%;
  overflow-x:hidden; 
  overflow-y:auto;
  height: 520px;
  font-size: 16px;
  padding: 20px 30px;
  border: 0px solid #cfcfcf;
  border-radius: 5px;
  -webkit-overflow-scrolling: touch;
}
.chatting-room-frame {
  position: relative;
  width: 100%;
  max-width: 490px;
  margin: auto;
  background-color: #fff;
  padding: 0 0 125px 0;
  border-radius: 6px;
  border:1px solid #cfcfcf;
}

.sppech-bubble-frame {
  padding: 8px 16px;
  width: fit-content;
  border-radius: 5px;
  word-break: break-all;
  white-space: pre-line;
  max-width: 75%;
  transition-duration: 1s;
}
.sppech-bubble-frame:not(:first-child) {
  margin-top: 30px;
}
.male-sppech-bubble {
  background-color: #f3f3fd;
  color: black;
}
.female-sppech-bubble {
  background-color: #fff7f7;
  color: black;
}
.my-sppech-bubble {
  margin-left: auto;
}

.input-section {
  position: absolute;
  display: flex;
  padding: 22px 20px;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 125px;
}
.form-control {
  display: inline-block;
  width: 80%;
  margin-right: 15px;
}
.btn-primary {
  font-size: 18px;
  vertical-align: top;
  width: calc(20% - 15px);
  height: 100%;
}
.chatting-headline {
  position: relative;
  background-color: #ffffff;
  width: 100%;
  height: 50px;
  font-size: 18px;
  text-align: center;
  padding: 11px;
}
.text-muted {
  position:absolute;
  font-size: 14px;
  top: -9px;
}
.text-muted::before {
  content: url("../assets/img/exclamation-octagon.svg");
  background-size: 10px;
  margin-right: 6px;
  opacity: 0.4;
  vertical-align: sub;
}

@media (max-width: 768px) {
  .back-button {
    position: fixed;
    left: 18px;
    top: 12px;
    opacity: 0.7;
  }
  .back-button svg {
    height: 25px;
    width: 25px;
  }
  #chatting-message-display {
    font-size: 14px;
    height: 100%;
    padding: 50px 10px 140px 10px;
    z-index: 9;
  }
  .chatting-room-frame {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    padding: 10px;
  }
  .chatting-headline {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 0.7;
  }
  .form-control {
    position: absolute;
    bottom: 10px;
    width: calc(100% - 20px)
  }
  .input-section {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    opacity: 0.8;
  }
  .form-control {
    position: unset;
  }
}
.text-length-info {
  -ms-user-select: none; 
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  position: absolute;
  right: 120px;
  bottom: 25px;
  font-size: 12px;
  opacity: 0.6;
}
@media (max-width: 768px) {
  .text-length-info {
    right: 88px;
  }
}
</style>