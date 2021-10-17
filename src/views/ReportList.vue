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
  </div>
</template>

<script>
export default {
  name: "ReportList",
  data () {
    return {
      reportList: []
    }
  },
  methods: {
    moveReportDetail: function (reportId) {
      this.$router.push('/report/' + reportId)
    },
  },
  created () {
    this.$http.get('/user/report-list')
    .then((response) => {
      this.reportList = response.data.reportList
    })
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