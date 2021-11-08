let commonMixin = {
  data () {
    return {
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
    convertNumberUnit: function (number) {
      if (number < 999) {
        return number
      }

      if  (number < 9999) {
        if (number % 1000 >= 100) {
          return parseFloat(number / 1000).toFixed(1) + '천'
        } else {
          return Math.floor(number / 1000) + '천'
        }
        
      }

      if (number % 10000 >= 1000) {
        return parseFloat(number / 10000).toFixed(1) + '만'
      } else {
        return Math.floor(number / 10000) + '만'
      }
    },
    convertDateToTimestamp: function (timestamp) {
      let nowDate = new Date()
      let toConvertDate = new Date(timestamp)

      let returnData = {
        isToday: false,
        year: '',
        month: '',
        day: '',
        hours: '',
        minutes: '',
      }

      if (
        nowDate.getFullYear() === toConvertDate.getFullYear() &&
        nowDate.getMonth() === toConvertDate.getMonth() &&
        nowDate.getDate() === toConvertDate.getDate()
      ) returnData.isToday = true

      returnData.year = toConvertDate.getFullYear()
      returnData.month = this.fillZero((toConvertDate.getMonth() + 1))
      returnData.day = this.fillZero(toConvertDate.getDate())
      returnData.hours = this.fillZero(toConvertDate.getHours())
      returnData.minutes = this.fillZero(toConvertDate.getMinutes())

      return returnData
    },
    getDate: function (timestamp) {
      let dateInfo = this.convertDateToTimestamp(timestamp)

      return `${dateInfo.year}/${dateInfo.month}/${dateInfo.day} ${dateInfo.hours}:${dateInfo.minutes}`
    },
    getIsHistoryBack: function () {
      let today = new Date()
      let nowTimestamp = today.getTime()
      let backTimestamp = Number(localStorage.getItem("뒤로가기발생시간"))
      let savedData = localStorage.getItem(this.$route.name)

      // 현재 타임스탬프와 뒤로가기 시점의 타임스탬프 차이가 100ms 이하라면 뒤로가기 페이지로 판단
      return ( nowTimestamp - backTimestamp ) <= 100 && savedData !== null
    },
    getCache: function () {
      return localStorage.getItem(this.$route.name)
    },
    saveCache: function (data) {
      localStorage.setItem(this.$route.name, JSON.stringify(data));
    },
  },
  created () {
    // 뒤로가기 이벤트
    window.onpopstate = function(event) {
      let nowDate = new Date();
      localStorage.setItem("뒤로가기발생시간", nowDate.getTime())
    };
  },
}

export default commonMixin