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
          <td scope="row">{{ boardInfo.title }} <span class="comment-count">{{'[' + boardInfo.commentCount + ']'}}</span></td>
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
    
    <div v-if="isResponseComplete" class="input-group">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{searchOption}}</button>
        <div class="dropdown-menu">
          <!-- <a class="dropdown-item" @click="selectSearchOption('닉네임')">닉네임</a> -->
          <a class="dropdown-item" @click="selectSearchOption('제목')">제목</a>
          <a class="dropdown-item" @click="selectSearchOption('내용')">내용</a>
          <a class="dropdown-item" @click="selectSearchOption('제목+내용')">제목+내용</a>
        </div>
      </div>
      <input v-model="searchContent" type="text" class="form-control" aria-label="Text input with dropdown button">
      <div class="input-group-append">
        <button @click="searchBoard" class="btn btn-outline-secondary search-button" type="button" id="button-addon2">검색</button>
      </div>
    </div>

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
      searchOption: '선택',
      searchContent: '',
    }
  },
  methods: {
    searchBoard: function () {
      if (this.searchOption === '선택') {
        alert('옵션을 선택해주세요.')
        return
      }
      if (this.searchContent === '') {
        alert('검색 내용을 입력해주세요.')
        return
      }
      if (this.searchContent.length < 2) {
        alert('2글자 이상 검색어를 입력해주세요.')
        return
      }

      this.loadData(true)
    },
    selectSearchOption: function (option) {
      this.searchOption = option
    },
    getCreatedDate: function (createdAt) {
      let dateInfo = this.convertDateToTimestamp(createdAt)

      if (dateInfo.isToday) {
        return dateInfo.hours + ':' + dateInfo.minutes
      } else {
        return dateInfo.year + '/' + dateInfo.month + '/' + dateInfo.day
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
    loadData: function (isSearch) {
      let requestUrl

      if (isSearch) {
        let searchOption
        if (this.searchOption === '닉네임') searchOption = 'nickname'
        else if (this.searchOption === '제목') searchOption = 'title'
        else if (this.searchOption === '내용') searchOption = 'content'
        else if (this.searchOption === '제목+내용') searchOption = 'title+content'

        requestUrl = '/community/board-list?' +
        'page=' + this.currentPage + 
        '&countPerPage=' + COUNT_PER_PAGE +
        '&searchOption=' + searchOption +
        '&searchContent=' + this.searchContent
      } else {
        requestUrl = '/community/board-list?page=' + this.currentPage + '&countPerPage=' + COUNT_PER_PAGE
      }

      this.$http.get(requestUrl)
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
.input-group {
  background-color: #fff;
  margin-bottom: 20px;
}
.button-wrap {
  width: 100%;
  text-align: right;
}
.table {
  margin-top: 20px;
  margin-bottom: 20px;
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
  .comment-count {
    display: inline-block;
    margin-left: 5px;
    color: #a5a5a5;
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