<template>
  <div class="content-container">
    <div class="button-wrap">
      <button class="btn btn-primary" @click="moveWritePage">글쓰기</button>
    </div>
    <table class="table shadow">
      <thead class="thead-dark">
        <tr>
          <th scope="col" class="title">제목</th>
          <th scope="col" class="views">조회수</th>
          <th scope="col" class="like">추천수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(boardInfo, key) in boardList" :key="key" @click="moveBoardView(boardInfo.Objectid)">
          <td scope="row">{{ boardInfo.title }}</td>
          <td>{{ boardInfo.view }}</td>
          <td>{{ boardInfo.like }}</td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Community",
  data: () => {
    return {
      boardList: []
    }
  },
  methods: {
    moveWritePage: function () {
      this.$router.push('/community-write');
    },
    moveBoardView: function (boardId) {
      this.$router.push('/community/detail/' + boardId);
    },
    loadData: function () {
      this.$http.get('/community/board-list')
      .then((response) => {
        this.boardList = response.data.boardList
      })
      .catch((err) => {
        console.log(err)
        alert('에러발생')
      })
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.content-container {
  // width: 90%;
}
.button-wrap {
  width: 100%;
  text-align: right;
}
.table {
  margin-top: 20px;
  margin-bottom: 40px;
  thead {
    font-size: 14px;
    text-align: center;
    .title {
      text-align: left;
    }
  }
  th {
    border-top: 0;
  }
  td {
    border-top: 0;
  }
  .title {
    width: auto;
  }
  .views, .like {
    width: 74px;
  }
  td:not(:first-child) {
    text-align: center;
  }
  tbody tr {
    background-color: white;
  }
  tbody tr:hover {
    cursor: pointer;
    background-color: rgb(248, 248, 248);
  }
}
.pagination {
  justify-content: center;
}
</style>