<template>
  <div class="content-container">
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">신고자</th>
          <th scope="col">신고대상</th>
          <th scope="col">유형</th>
          <th scope="col" width="80">대상</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reportInfo, index) in reportList" :key="index">
          <td scope="row">{{reportInfo.reporterNickname}}</td>
          <td>{{reportInfo.reportedUserNickname}}</td>
          <td>{{ reportInfo.type }}</td>
          <td @click="moveReportDetail(reportInfo._id)" class="btn-link target">{{ reportInfo.target }}</td>
        </tr>
      </tbody>
    </table>
    <button v-if="isMoreButton" class="btn btn-light btn-block shadow" @click="loadData">더보기</button>
  </div>
</template>

<script>
const LIMIT = 10

export default {
  name: "ReportList",
  data () {
    return {
      reportList: [],
      isMoreButton: true,
    }
  },
  methods: {
    moveReportDetail: function (reportId) {
      this.$router.push('/report/' + reportId)
    },
    loadData: function () {
      let skip = this.reportList.length

      let url = `/user/report-list?skip=${skip}&limit=${LIMIT}`

      this.$http.get(url)
      .then((response) => {
        this.reportList = this.reportList.concat(response.data.reportList)

        if (response.data.reportList.length < LIMIT) this.isMoreButton = false
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.errorMessage)
      })
    },
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
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