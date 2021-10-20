<template>
  <div class="content-container">
    <form class="search-box shadow-sm">
      <div class="form-row">
        <div class="mb-2 col-md-6">
          <label for="inputEmail4">신고자</label>
          <input type="text" class="form-control" id="inputEmail4" v-model="inputReporter">
        </div>
        <div class="mb-2 col-md-6">
          <label for="inputPassword4">신고 대상자</label>
          <input type="text" class="form-control" id="inputPassword4" v-model="inputReported">
        </div>
      </div>
      <div class="form-row">
        <div class="mb-2 col-md-6">
          <label for="inputType">유형</label>
          <select id="inputType" class="form-control" v-model="inputReportType">
            <option selected :value="null">무관</option>
            <option value="모욕/비방">모욕/비방</option>
            <option value="성희롱">성희롱</option>
            <option value="광고">광고</option>
            <option value="도배">도배</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div class="mb-2 col-md-6">
          <label for="inputTarget">대상</label>
          <select id="inputTarget" class="form-control" v-model="inputReportTarget">
            <option selected :value="null">무관</option>
            <option value="채팅">채팅</option>
            <option value="게시글">게시글</option>
            <option value="댓글">댓글</option>
            <option value="자기소개">자기소개</option>
          </select>
        </div>
      </div>
      <button @click.prevent="loadData('search')" class="btn btn-primary btn-block search-button">검색</button>
    </form>
    
    <table class="table shadow-sm">
      <thead class="thead-dark">
        <tr>
          <th scope="col">신고자</th>
          <th scope="col">신고대상</th>
          <th scope="col">유형</th>
          <th scope="col" width="120">대상</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reportInfo, index) in reportList" :key="index">
          <td scope="row">{{reportInfo.reporterNickname}}</td>
          <td>{{reportInfo.reportedUserNickname}}</td>
          <td>{{ reportInfo.type }}</td>
          <td @click="moveReportDetail(reportInfo._id)" class="btn-link target">{{ reportInfo.target }}</td>
        </tr>
        <tr v-if="isResponseComplete && reportList.length === 0">
          <td colspan="4">조회된 신고목록이 없습니다.</td>
        </tr>
        <tr v-if="!isResponseComplete">
          <td colspan="4">
            <div>
              <div class="d-flex justify-content-center" style="margin: 40px 0">
                <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <button v-if="isMoreButton" class="btn btn-light btn-block shadow-sm" @click="loadData">더보기</button>
  </div>
</template>

<script>
const LIMIT = 10

export default {
  name: "ReportList",
  data () {
    return {
      isResponseComplete: false,
      reportList: [],
      isMoreButton: true,
      inputReportType: null,
      inputReportTarget: null,
      inputReporter: '',
      inputReported: '',
    }
  },
  methods: {
    moveReportDetail: function (reportId) {
      this.$router.push('/report/' + reportId)
    },
    loadData: function (type) {
      this.isMoreButton = true
      this.isResponseComplete = false

      if (type === 'search') this.reportList = []

      let url = `/user/report-list?skip=${this.reportList.length}&limit=${LIMIT}`

      if (this.inputReportType !== null) url += `&reportType=${this.inputReportType}`
      if (this.inputReportTarget !== null) url += `&reportTarget=${this.inputReportTarget}`
      if (this.inputReported !== '') url += `&reported=${this.inputReported}`
      if (this.inputReporter !== '') url += `&reporter=${this.inputReporter}`

      this.$http.get(url)
      .then((response) => {
        this.reportList = this.reportList.concat(response.data.reportList)

        if (response.data.reportList.length < LIMIT) this.isMoreButton = false
        this.isResponseComplete = true
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
  },
  created () {
    // 현재 타임스탬프와 뒤로가기 시점의 타임스탬프 차이가 100ms 이하라면 뒤로가기 페이지로 판단
    if ( this.getIsHistoryBack() ) {
      Object.assign(this.$data, JSON.parse(this.getCache()))
    } else {
      this.loadData()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.saveCache(this.$data)
    next()
  }
}
</script>

<style lang="scss" scoped>
.form-control {
  height: 34px;
  font-size: 14px;
}
.search-button {
  margin: 10px 0 5px 0;
}
.search-box {
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 14px 16px 8px 16px;
  margin-bottom: 20px;
  font-size: 14px;
}
table {
  text-align: center;
  background-color: #ffffff;
  thead tr th {
    padding: 10px;
  }
  tbody {
    tr {
      td {
        padding: 8px;
        
      }
    }
  }
  .target {
    cursor: pointer;
  }
}
</style>