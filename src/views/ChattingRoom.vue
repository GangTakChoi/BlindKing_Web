<template>
  <div class="content-container">
    <div class="chatting-room-frame shadow">
      <div class="chatting-headline">
        {{ $route.query.nickname }}
      </div>
      <div id="chatting-message-display">
        <div v-for="(msgInfo, key) in messageList" :key="key" 
          class="sppech-bubble-frame shadow" 
          :class="{ 'your-sppech-bubble' : !msgInfo.isMe, 'my-sppech-bubble': msgInfo.isMe}">
          {{msgInfo.message}}
        </div>
      </div>
      <div class="input-section">
        <small id="emailHelp" class="form-text text-muted">줄바꿈 shift + enter</small>
        <textarea v-if="!isMobile" v-model="message" class="form-control" rows="3" v-on:keydown.enter="sendMessage" v-on:keyup.enter.prevent></textarea>
        <textarea v-else v-model="message" class="form-control" rows="3"></textarea>
        <button class="btn btn-primary" @click="sendMessage">전송</button>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import io from '@/assets/js/socket.io.js'
import VueCookies from 'vue-cookies'

const TOKEN = VueCookies.get('token');

export default {
  name: "ChattingRoom",
  data: () => {
    return {
      messageList: [],
      message: "",
      socket: {},
    }
  },
  methods: {
    sendMessage: async function (e) {
      if (e.shiftKey) {
        return
      }
      if (this.message.trim() === "") {
        this.message = ""
        return
      }

      let msgInfo = {
        token: TOKEN,
        msg: this.message
      }

      this.socket.emit("sendMessage", msgInfo)

      this.message = "";
      // 메세지 전송 후 개행 방지
      e.preventDefault();
    }
  },
  created () {
    this.socket = io();
    
    let goInChattingRoomRequestInfo = {
      token: TOKEN,
      friendObjectId: this.$route.params.friendObjectId,
    }

    this.socket.emit("goInChattingRoom", goInChattingRoomRequestInfo)

    this.socket.on("loadMessage", async (data) => {

      await data.messageRecords.forEach((messaeInfo) => {
        
        let isMe = messaeInfo.userObjectId === data.myObjectId  ? true : false
        let msgInfo = {
          isMe: isMe,
          message: messaeInfo.content
        }
        this.messageList.push(msgInfo)
      })

      var displayDiv = document.getElementById("chatting-message-display")
      displayDiv.scrollTop = displayDiv.scrollHeight
    })

    this.socket.on("brodcastMessage", async (data) => {
      let isMe = data.token === TOKEN ? true : false
      let msgInfo = {
        isMe: isMe,
        message: data.msg
      }

      await this.messageList.push(msgInfo);

      var displayDiv = document.getElementById("chatting-message-display")
      displayDiv.scrollTop = displayDiv.scrollHeight
    })
  },
  beforeRouteLeave (to, from, next) {
    this.socket.disconnect()
    next()
  },
}
</script>

<style lang="scss" scoped>
#chatting-message-display {
  width: 100%;
  overflow-x:hidden; 
  overflow-y:auto;
  height: 650px;
  font-size: 18px;
  padding: 20px 30px;
  border: 0px solid #cfcfcf;
  border-radius: 5px;
  -webkit-overflow-scrolling: touch;
}
.chatting-room-frame {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
  background-color: #fff;
  padding: 0 0 125px 0;
  border-radius: 6px;
  border:1px solid #cfcfcf;
}

.sppech-bubble-frame {
  padding: 10px 16px;
  width: fit-content;
  border-radius: 5px;
  word-break: break-all;
  white-space: pre-line;
  max-width: 75%;
  transition-duration: 1s;
}
.sppech-bubble-frame:not(:first-child) {
  margin-top: 40px;
}
.my-sppech-bubble {
  background-color: #f3f3fd;
  color: black;
  margin-left: auto;
}
.your-sppech-bubble {
  background-color: #fff7f7;
  color: black;
  // border: 1px solid black;
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
  background-color: #ffffff;
  width: 100%;
  height: 50px;
  font-size: 18px;
  text-align: center;
  padding: 12px;
}
.text-muted {
  position:absolute;
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
  #chatting-message-display {
    font-size: 14px;
    height: 100%;
    padding: 50px 10px 140px 10px;
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
</style>