<template>
  <div class="content-container">
    <div class="board-view-wrap shadow">
      <div v-if="!isResponseComplete" class="d-flex justify-content-center" style="margin: 40px 0">
        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-if="isResponseComplete">
        <div class="title">
          {{ title }}
        </div>
        <hr>
        <div class="add-info-section">
          <span class="nickname">{{ nickname }}</span> • 
          <span class="created-date">{{ createdDate }}</span> • 
          <span class="view">조회수 {{ view }}</span>
        </div>
        <div class="content ck-content" v-html="content">
          
        </div>
        <div class="hand-thumbs-wrap">
          <div class="hand-thumbs-up-wrap">
            <img v-if="isHandUp" class="hand-thumbs" src="@/assets/img/hand-thumbs-up-fill.svg" @click="evaluateBoard(true)">
            <img v-else class="hand-thumbs" src="@/assets/img/hand-thumbs-up.svg" @click="evaluateBoard(true)">
            <span class="like">{{ like }}</span>
          </div>
          <div class="hand-thumbs-down-wrap">
            <img v-if="isHandDown" class="hand-thumbs" src="@/assets/img/hand-thumbs-down-fill.svg" @click="evaluateBoard(false)">
            <img v-else class="hand-thumbs" src="@/assets/img/hand-thumbs-down.svg" @click="evaluateBoard(false)">
            <span class="dislike">{{ dislike }}</span>
          </div>
        </div>
      </div>
    </div>

    

    <div class="comment-input-section shadow">
      <textarea class="form-control comment-textarea" row="3"></textarea>
      <button class="btn btn-primary comment-regist-button" @click="registComment">등록</button>
    </div>

    <div class="comment-section shadow text-center">
      <span>등록된 댓글이 없습니다.</span>
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
      nickname: '',
      createdDate: '',
      view: '',
      like: Number,
      dislike: Number,
      isResponseComplete: false,
      isHandUp: false,
      isHandDown: false,
    }
  },
  methods: {
    registComment: function () {

    },
    evaluateBoard: function (isLike) {
      let postBody = {
        isLike: isLike
      }

      this.$http.put('/community/board/' + this.$route.params.boardId + '/like-dislike', postBody)
      .then((response) => {
        if (isLike) {
          if (this.isHandUp) {
            this.isHandUp = false
            this.like -= 1
          } else if (this.isHandDown) {
            this.isHandUp = true
            this.isHandDown = false
            this.dislike -= 1
            this.like += 1
          } else {
            this.isHandUp = true
            this.like += 1
          }

        } else {
          if (this.isHandUp) {
            this.isHandUp = false
            this.isHandDown = true
            this.like -= 1
            this.dislike += 1
          } else if (this.isHandDown) {
            this.isHandDown = false
            this.dislike -= 1
          } else {
            this.isHandDown = true
            this.dislike += 1
          }
        }
        
      })
      .catch((err) => {
        console.log(err)
      })
    },
    fillZero: function (num) {
      if (num < 10) {
        return '0' + String(num)
      } else {
        return String(num)
      }
    },
    loadData: function () {
      this.$http.get('/community/board/' + this.$route.params.boardId)
      .then((response) => {
        let responseData = response.data.result
        this.title =  responseData.title
        this.content = responseData.content
        this.nickname = responseData.nickname
        this.view = responseData.view.toLocaleString('ko-KR')
        this.like = responseData.like
        this.dislike = responseData.dislike

        let createdDate = new Date(responseData.createdAt)

        let year = createdDate.getFullYear()
        let month = createdDate.getMonth() + 1
        let day = createdDate.getDate()
        let hours = createdDate.getHours()
        let minute = createdDate.getMinutes()

        this.createdDate = year + '/' + month + '/' + day + ' ' + this.fillZero(hours) + ':' + this.fillZero(minute)

        if (responseData.evaluation === 'like') {
          this.isHandUp = true
        } else if (responseData.evaluation === 'dislike') {
          this.isHandDown = true
        }

        this.isResponseComplete = true
        
      })
      .catch((e) => {
        console.log(e)
        alert("페이지 로드 중 에러가 발생하였습니다.")
        history.back()
      })
    },
  },
  created () {
    this.loadData()
  },
}
</script>

<style lang="scss" scoped>
.comment-section {
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  margin-top: 30px;
  padding: 10px;
}
.comment-input-section {
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  margin-top: 30px;
  padding: 10px;
}
.comment-textarea {
  width: calc(100% - 80px);
  height: 62px;
}
.comment-regist-button {
  width: 70px;
  margin-left: 10px;
  height: 62px;
}
hr {
  margin: 20px 0;
}
.title {
  width: 100%;
  // font-weight: bold;
  font-size: 1.8rem;
  // margin-bottom: 20px;
}
.board-view-wrap {
  width: 100%;
  background-color: #fff;
  min-height: 100px;
  border-radius: 5px;
  padding: 20px;
}

.add-info-section {
  position: relative;
  top: -10px;
  float: right;
  color: #b4b4b4;
  font-size: 0.95rem;
}

.nickname {
  cursor: pointer;
}

.content {
  margin-top: 50px;
}

.hand-thumbs-wrap {
  margin-top: 40px;
  padding: 40px 0 20px 0;
  text-align: center;
  font-size: 16px;
}

.hand-thumbs {
  cursor: pointer;
  width: 17px;
  margin-right: 15px;
  vertical-align: middle;
}

.hand-thumbs-up-wrap, .hand-thumbs-down-wrap {
  display: inline-block;
}

.hand-thumbs-up-wrap {
  margin-right: 20px;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.4rem;
  }
}
</style>