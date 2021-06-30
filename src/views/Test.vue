<template>
  <div class="content-container">
    <div class="form-group">
      <label for="exampleInputPassword1">ID</label>
      <input type="text" class="form-control" id="exampleInputPassword1" v-model="id">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">PW</label>
      <input type="text" class="form-control" id="exampleInputPassword2" v-model="pw">
    </div>
    
    <button type="button" class="btn btn-primary" @click="get">회원목록</button>
    <button type="button" class="btn btn-primary" @click="post">회원추가</button>
    <button type="button" class="btn btn-primary" @click="createToken">토큰 생성</button>
    <button type="button" class="btn btn-primary" @click="authRequest">인증 요청</button>
    <button type="button" class="btn btn-primary" @click="test">test</button>

    <ul class="list-group" v-if="userList.length > 0">
      <li class="list-group-item" v-for="(user, index) in userList" :key="index">{{ user.id + ' || ' + user.pw }}</li>
    </ul>

    <div class="division-line"></div>

    <div class="form-group">
      <label for="title">번호</label>
      <input type="text" class="form-control" id="title" v-model="todoId">
    </div>
    <div class="form-group">
      <label for="content">내용</label>
      <input type="text" class="form-control" id="content" v-model="todoContent">
    </div>

    <button type="button" class="btn btn-primary" @click="addTodo">할일 추가</button>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
import VueCookies from 'vue-cookies'

export default {
  name: 'Test',
  data : () => {
    return {
      id : '',
      pw : '' ,
      userList : [],
      todoId : '',
      todoContent : ''
    }
  },
  methods: {
    test : function () {
      VueCookies.remove('token')
      console.log(VueCookies.get('token'))
    },
    get : function () {
      let config = {
        headers: { 'Authorization': '123' },
      }

      let that = this

      this.$http.get('/users', config).then(function(response) {
          console.log(response.data);
          that.userList = response.data
        }).catch(function(error) {
          console.log(error);
        });
    },
    post : function () {
      let reqBody = {
        id : this.id,
        pw : this.pw
      } 
      this.$http.post('/users', reqBody).then((response) => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error);
      })
    },
    createToken : function () {
      let reqBody = {
        id : this.id,
        pw : this.pw
      } 
      this.$http.post('/users/login', reqBody).then((response) => {
        if (response.status === 201) {
          alert('토큰 생성 완료')
        }
      }).catch((error) => {
        alert('로그인 실패')
        console.log(error);
      })
    },
    authRequest : function () {
      let config = {
        headers: { 'Authorization': '123' },
      }
      this.$http.get('/users/auth', config).then((response) => {
        if (response.status === 200) {
          alert('인증 완료')
        }
      }).catch((error) => {
        alert('인증 실패')
        console.log(error);
      })
    },
    addTodo : function () {
      let reqBody = {
        todoid : this.todoId,
        content : this.todoContent,
        completed : false
      }
      this.$http.post('/test', reqBody).then((response) => {
        console.log(response)
        alert('전송완료')
      }).catch((error) => {
        alert('전송실패')
        console.log(error);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.btn-primary {
  margin-top: 20px;
  margin-right: 10px;
}
.list-group {
  margin-top: 20px;
}
.division-line {
  height: 8px;
  width: 100%;
  background-color: #ededed;
  margin-top: 40px;
  margin-bottom: 40px;
  border-radius: 3px;
}
</style>
