<template>
  <div class="content-container">
    <div class="button-wrap">
      <button class="btn btn-primary" @click="moveWritePage">글쓰기</button>
    </div>
    <table class="table shadow-sm">
      <thead class="thead-dark">
        <tr>
          <th scope="col" class="title">제목</th>
          <th scope="col" class="nickname">작성자</th>
          <th scope="col" class="created">작성일</th>
          <th scope="col" class="views">조회수</th>
          <th scope="col" class="like">추천수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(boardInfo, key) in boardList" :key="key" @click="moveBoardView(boardInfo.Objectid)">
          <td scope="row">{{ boardInfo.title }}</td>
          <td>{{ boardInfo.nickname }}</td>
          <td>{{ getCreatedDate(boardInfo.createdAt) }}</td>
          <td>{{ boardInfo.view.toLocaleString('ko-KR') }}</td>
          <td>{{ boardInfo.like }}</td>
        </tr>
        <tr v-if="boardList.length === 0 && isResponseComplete">
          <td colspan="5" scope="row" style="text-align:center"> 등록된 글이 없습니다.</td>
        </tr>
        <tr v-if="!isResponseComplete">
          <td colspan="5" >
            <div class="d-flex justify-content-center" style="margin: 40px 0">
              <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <nav v-if="pageNumberList.length !== 0" aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled : minPage === 1 }" @click="previousPagination">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" :class="{ active : pageNumber === currentPage }" v-for="(pageNumber, key) in pageNumberList" :key="key">
          <a class="page-link" href="#" @click="movePage(pageNumber)">{{pageNumber}}</a>
        </li>
        <li class="page-item" :class="{ disabled : !isNextPageButtonActive }" @click="nextPagination">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
const PAGE_COUNT = 10;
const COUNT_PER_PAGE = 15;

export default {
  name: "Community",
  data: () => {
    return {
      boardList: [],
      isResponseComplete: false,
      currentPage: 1,
      pageNumberList: [],
      pageNumberCount: 10,
      minPage: 1,
      maxPage: PAGE_COUNT,
      isNextPageButtonActive: false,
    }
  },
  methods: {
    fillZero: function (num) {
      if (num < 10) {
        return '0' + String(num)
      } else {
        return String(num)
      }
    },
    getCreatedDate: function (createdAt) {
      let nowDate = new Date()
      let createdDate = new Date(createdAt)

      if (
        nowDate.getFullYear() === createdDate.getFullYear() &&
        nowDate.getMonth() === createdDate.getMonth() &&
        nowDate.getDate() === createdDate.getDate()
      ) {
        return this.fillZero(createdDate.getHours()) + ':' + this.fillZero(createdDate.getMinutes())
      } else {
        return createdDate.getFullYear() + '/' + this.fillZero((createdDate.getMonth() + 1)) + '/' + this.fillZero(createdDate.getDate())
      }

      
    },
    moveWritePage: function () {
      this.$router.push('/community-write');
    },
    moveBoardView: function (boardId) {
      this.$router.push('/community/detail/' + boardId);
    },
    movePage: function (pageNumber) {
      this.isResponseComplete = false
      this.currentPage = pageNumber
      this.boardList = []
      this.loadData()
    },
    loadData: function () {
      this.$http.get('/community/board-list?page=' + this.currentPage + '&countPerPage=' + COUNT_PER_PAGE)
      .then((response) => {
        this.isResponseComplete = true
        this.boardList = response.data.boardList
        let lastPageNumber = response.data.lastPageNumber

        
        if (this.maxPage >= lastPageNumber) {
          this.maxPage = lastPageNumber
          this.isNextPageButtonActive = false
        }

        this.loadPaginationNumber()
      })
      .catch((err) => {
        console.log(err)
        alert('에러발생')
      })
    },
    previousPagination: function () {
      if (this.minPage === 1) return

      this.minPage -= PAGE_COUNT;
      this.maxPage -= PAGE_COUNT;

      this.movePage(this.maxPage)
    },
    nextPagination: function () {
      if (!this.isNextPageButtonActive) return

      this.minPage += PAGE_COUNT;
      this.maxPage += PAGE_COUNT;

      this.movePage(this.minPage)
    },
    loadPaginationNumber: function () {
      this.pageNumberList = []

      for (var i=this.minPage; i<=this.maxPage; i++) {
        this.pageNumberList.push(i)
      }
    },
  },
  async created () {
    await this.loadData()
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
    font-size: 13px;
  }
  td {
    border-top: 0;
  }
  td:not(:first-child) {
    font-size: 16px;
  }
  .title {
    width: auto;
  }
  .views, .like, .nickname, .created {
    width: 63px;
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
@media (max-width: 768px) {
  .table {
    thead th {
      vertical-align: middle;
    }
    .views, .like {
      width: 50px;
    }
    .created {
      width: 55px;
    }
  }
}
</style>