let commonMixin = {
  methods: {
    fillZero: function (num) {
      if (num < 10) {
        return '0' + String(num)
      } else {
        return String(num)
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
    }
  },
}

export default commonMixin