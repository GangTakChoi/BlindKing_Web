<template>
  <div class="content-container">
    <div class="category-wrap">
      <ul>
        <li v-for="(categoryInfo, index) in adminCategoryList" :key="index" 
        @click="changeCategory(categoryInfo._id)"
        :class="{ 'seleted': categoryInfo._id === selectCategoryId }" class="category-button shadow-sm notice" id="category-button">
          {{ categoryInfo.name }}
        </li>
      </ul>
      <ul>
        <li v-for="(categoryInfo, index) in categoryList" :key="index" 
        @click="changeCategory(categoryInfo._id)"
        :class="{ 'seleted': categoryInfo._id === selectCategoryId }" class="category-button shadow-sm" id="category-button">
          {{ categoryInfo.name }}
        </li>
      </ul>
      <ul v-if="$global.isAdmin">
        <li class="category-button shadow-sm" data-toggle="modal" data-target="#addCategory">
          <img class="category-plus-img" src="@/assets/img/plus-lg.svg" alt=""> 추가
        </li>
        <li class="category-button shadow-sm" style="padding:4px 8px" data-toggle="modal" data-target="#settomgCategory">
          <img width="20px" class="category-plus-img" src="@/assets/img/gear.svg" alt="">
        </li>
      </ul>
    </div>
    <div class="top-wrap">
      <div class="refresh-box shadow" @click="loadBoardData(false)"></div>
      <button v-if="isShowWriteButton" class="btn btn-dark shadow" @click="moveWritePage">글쓰기</button>
    </div>
    <div class="board-list-wrap shadow-sm">
      <div v-for="(boardInfo, key) in boardList" :key="key" @click="moveBoardView(boardInfo.Objectid)" class="board-list-row">
        <div class="board-title btn-link"> {{ boardInfo.title }} <span class="comment-count">{{'[' + boardInfo.commentCount + ']'}}</span></div>
        <div class="board-detail-info">
          <span class="view"><img class="view-icon" src="@/assets/img/eye.svg" alt="view"> {{ convertNumberUnit(boardInfo.view) }}</span>
          <span class="like"><img class="like-icon" src="@/assets/img/heart.svg" alt="like"> {{ convertNumberUnit(boardInfo.like) }}</span>
          <span class="nickname">{{ boardInfo.nickname }}</span>
          <span class="date">{{ getCreatedDate(boardInfo.createdAt) }}</span>
        </div>
      </div>
      <div v-if="boardList.length === 0 && isResponseComplete">
        등록된 글이 없습니다.
      </div>
      <div v-if="!isResponseComplete">
        <div class="d-flex justify-content-center" style="margin: 40px 0">
          <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isResponseComplete" class="input-group">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{searchOption}}</button>
        <div class="dropdown-menu">
          <a class="dropdown-item" @click="selectSearchOption('닉네임')">닉네임</a>
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
    <AddCategoryModel @updateCategory="loadCategory"/>
    <SettingCategory ref="SettingCategory" :categoryList="categoryList" :adminCategoryList="adminCategoryList" @updateCategory="loadCategory"/>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import AddCategoryModel from '@/components/AddCategoryModel.vue'
import SettingCategory from '@/components/SettingCategory.vue'

const PAGE_COUNT = 5;
const COUNT_PER_PAGE = 10 ;

export default {
  name: "Community",
  components: { AddCategoryModel, SettingCategory },
  data: () => {
    return {
      boardList: [],
      categoryList: [],
      adminCategoryList: [],
      selectCategoryId: null,
      isResponseComplete: false,
      currentPage: 1,
      pageNumberList: [],
      minPage: 1,
      maxPage: PAGE_COUNT,
      isNextPageButtonActive: false,
      searchOption: '선택',
      searchContent: '',
    }
  },
  computed: {
    isShowWriteButton: function () {
      if (this.$global.isAdmin) {
        return true
      }

      let result = this.adminCategoryList.find((categoryInfo) => {
        if (categoryInfo._id === this.selectCategoryId) return true
      })

      return result === undefined ? true : false
    },
  },
  methods: {
    getCategoryType: function (categoryId) {
      let result = this.adminCategoryList.find((categoryInfo) => {
        if (categoryInfo._id === categoryId) return true
      })

      if (result !== undefined) {
        return result.type
      }

      result = this.categoryList.find((categoryInfo) => {
        if (categoryInfo._id === categoryId) return true
      })

      if (result !== undefined) {
        return result.type
      }

      return 'normal'
    },
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

      this.loadBoardData(true)
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
      if (!this.$global.isLogin) {
        alert('글 작성은 로그인 후 이용해주세요.')
        return
      }
      let categoryType = this.getCategoryType(this.selectCategoryId)
      this.$router.push(`/community-write?categoryId=${this.selectCategoryId}&categoryType=${categoryType}`);
    },
    moveBoardView: function (boardId) {
      this.$router.push('/community/detail/' + boardId);
    },
    movePage: function (pageNumber) {
      this.isResponseComplete = false
      this.currentPage = pageNumber
      this.boardList = []
      this.loadBoardData()
    },
    changeCategory: function (categoryId) {
      this.selectCategoryId = categoryId
      this.initData()
      this.loadBoardData()
    },
    initData: function () {
      this.minPage = 1
      this.maxPage = PAGE_COUNT
      this.isNextPageButtonActive = false
      this.pageNumberList = []
      this.currentPage = 1
    },
    loadBoardData: function (isSearch) {
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

      if (this.selectCategoryId !== null) {
        requestUrl += `&categoryId=${this.selectCategoryId}`
      }

      this.boardList = []
      this.isResponseComplete = false

      this.$http.get(requestUrl)
      .then((response) => {
        this.selectCategoryId = response.data.categoryId
        this.isResponseComplete = true
        this.boardList = response.data.boardList
        let lastPageNumber = response.data.lastPageNumber

        if (this.maxPage >= lastPageNumber) {
          this.maxPage = lastPageNumber
          this.isNextPageButtonActive = false
        } else {
          this.isNextPageButtonActive = true
        }

        this.loadPaginationNumber()
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
    previousPagination: function () {
      if (this.minPage === 1) return

      this.minPage -= PAGE_COUNT;
      this.maxPage = this.minPage + (PAGE_COUNT - 1);

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
    loadCategory: function () {
      this.$http.get('/community/category')
      .then((response) => {
        this.categoryList = response.data.normalCategory
        this.adminCategoryList = response.data.adminCategory
        localStorage.setItem("categoryList", JSON.stringify(this.categoryList))
        localStorage.setItem("adminCategoryList", JSON.stringify(this.adminCategoryList))
        this.$refs.SettingCategory.initData()
      })
      .catch ((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
  },
  async created () {
    if ( this.getIsHistoryBack() ) {
      Object.assign(this.$data, JSON.parse(this.getCache()))
      this.isResponseComplete = true
    } else {
      if (this.$route.query.categoryId !== undefined) {
        this.selectCategoryId = this.$route.query.categoryId
      }
      this.loadCategory()
      this.loadBoardData()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.saveCache(this.$data)
    next()
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  background-color: #fff;
  margin-bottom: 20px;
}
.category-wrap {
  margin-bottom: 10px;
  ul {
    padding: 0;
    margin: 0;
  }
  .category-plus-img {
    position: relative;
    top: -2px;
    margin-right: 2px;
  }
  .category-button {
    cursor: pointer;
    display: inline-block;
    padding: 4px 10px;
    border-radius: 10px;
    background-color: #ffffff;
    margin-right: 8px;
    margin-bottom: 8px;
    border: 2px solid #ffffff;
    text-align: center;
  }
  .category-button:hover {
    background-color: #f4f4f4;
  }
  .seleted {
    border: 2px solid #000000;
    background-color: #ffffff;
    color: #000000;
  }
  .notice {
    color: #ff6b6b;
  }
}
.top-wrap {
  display: flex;
  justify-content: space-between;
  .refresh-box {
    cursor: pointer;
    background: center no-repeat url("../assets/img/arrow-counterclockwise.svg");
    background-size: 26px;
    background-color: #ffffff;
    border: 0;
    border-radius: 10px;
    padding: 19px;
  }
  .refresh-box:hover {
    background-color: #f4f4f4;
  }
  width: 100%;
  text-align: right;
}
.board-list-wrap {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 20px 0;
  .board-list-row {
    padding: 6px;
  }
  .board-list-row:hover {
    cursor: pointer;
    border-radius: 10px;
    background-color: #f4f4f4;
  }
  .comment-count {
    display: inline-block;
    margin-left: 5px;
    color: #a5a5a5;
  }
  .board-detail-info {
    color: #535353;
    margin-top: 1px;
    span:not(:last-child) {
      margin-right: 10px;
    }
    .like {
      .like-icon {
        width: 14px;
        margin-right: 5px;
      }
    }
    .view {
      .view-icon {
        width: 16px;
        margin-right: 5px;
      }
    }
    .date {

    }
    .nickname {

    }
  }
}
@media (max-width: 768px) {
  .board-list-wrap {
    padding: 5px;
  }
}
// .table {
//   margin-top: 20px;
//   margin-bottom: 20px;
//   thead {
//     font-size: 14px;
//     text-align: center;
//   }
//   th {
//     border-top: 0;
//     font-size: 13px;
//   }
//   td {
//     border-top: 0;
//   }
//   td:not(:first-child) {
//     font-size: 16px;
//   }
//   .title {
//     width: auto;
//   }
//   .comment-count {
//     display: inline-block;
//     margin-left: 5px;
//     color: #a5a5a5;
//   }
//   .views, .like, .nickname, .created {
//     width: 63px;
//   }
//   td:not(:first-child) {
//     text-align: center;
//   }
//   tbody tr {
//     background-color: white;
//   }
//   tbody tr:hover {
//     cursor: pointer;
//     background-color: rgb(248, 248, 248);
//   }
// }

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