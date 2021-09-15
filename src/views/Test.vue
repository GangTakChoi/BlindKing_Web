<template>
  <div class="content-container">
    <div>
      <form>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            
            <label for="validationServer01">First name</label>
            <input type="text" class="form-control is-invalid" id="validationServer01" value="Mark" required>
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            <div class="valid-feedback">
              Looks good!
            </div>
            <div class="invalid-feedback">
              test
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="validationServer02">Last name</label>
            <input type="text" class="form-control is-valid" id="validationServer02" value="Otto" required>
            <div class="valid-feedback">
              Looks good!
            </div>
            <div class="invalid-feedback">
              test
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="validationServer03">City</label>
            <input type="text" class="form-control is-invalid" id="validationServer03" aria-describedby="validationServer03Feedback" required>
            <div id="validationServer03Feedback" class="invalid-feedback">
              Please provide a valid city.
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <label for="validationServer04">State</label>
            <select class="custom-select is-invalid" id="validationServer04" aria-describedby="validationServer04Feedback" required>
              <option selected disabled value="">Choose...</option>
              <option>...</option>
            </select>
            <div id="validationServer04Feedback" class="invalid-feedback">
              Please select a valid state.
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <label for="validationServer05">Zip</label>
            <input type="text" class="form-control is-invalid" id="validationServer05" aria-describedby="validationServer05Feedback" required>
            <div id="validationServer05Feedback" class="invalid-feedback">
              Please provide a valid zip.
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="form-check">
            <input class="form-check-input is-invalid" type="checkbox" value="" id="invalidCheck3" aria-describedby="invalidCheck3Feedback" required>
            <label class="form-check-label" for="invalidCheck3">
              Agree to terms and conditions
            </label>
            <div  id="invalidCheck3Feedback" class="invalid-feedback">
              You must agree before submitting.
            </div>
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Submit form</button>
      </form>
    </div>



    <br><br><br><br>



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
    <button type="button" class="btn btn-primary" id="liveToastBtn" @click="toast">Show live toast</button>

    <div style="margin-top: 10px">
      <form method="POST" action="/upload" enctype="multipart/form-data">
        <input type="file" name="upload">
        <button type="submit">업로드</button>
      </form>
    </div>

    <div class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0;">
      <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
        <div class="toast-header">
          <!-- <img src="..." class="rounded mr-2" alt="..."> -->
          <strong class="mr-auto">Bootstrap</strong>
          <!-- <small>11 mins ago</small> -->
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          Hello, world! This is a toast message.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VueCookies from 'vue-cookies'
import $ from 'jquery'

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
    toast : function () {
      console.log('test')
      let option = {
        delay: 3000
      }
      $('.toast').toast(option)
      $('.toast').toast('show')
    },
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
