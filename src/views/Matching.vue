<template>
  <div class="content-container">
    <div class="search-wrap shadow-sm">
      <div class="line-wrap">
        <label class="custom-label" for="inlineFormCustomSelectPref">지역</label>
        <select class="custom-select" id="inlineFormCustomSelectPref" v-model="searchInfo.selectUpperAreaInfo" @change="upperAreaSelect" :disabled="upperAreaList.length === 0">
          <option selected :value="null">무관</option>
          <option v-for="(areaInfo, index) in upperAreaList" :key="index" :value="areaInfo">{{areaInfo.name}}</option>
        </select>
      </div>
      <div v-if="searchInfo.selectUpperAreaInfo !== null" class="subarea-checkbox-wrap shadow-sm">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" 
          :id="searchInfo.selectUpperAreaInfo.code"
          :value="searchInfo.selectUpperAreaInfo"
          v-model="searchInfo.upperAreaCheckedList"
          @change="upperAreaCheck($event, searchInfo.selectUpperAreaInfo)">
          <label class="custom-control-label" :for="searchInfo.selectUpperAreaInfo.code">{{ searchInfo.selectUpperAreaInfo.name }} 전체</label>
        </div>
        <div class="custom-control custom-checkbox"
        v-for="(areaInfo) in subAreaInfo[searchInfo.selectUpperAreaInfo.code]"
        :key="areaInfo.code">
          <input type="checkbox" class="custom-control-input" 
          :id="areaInfo.code" 
          :value="areaInfo"
          :disabled="searchInfo.upperAreaCheckedList.includes(searchInfo.selectUpperAreaInfo)"
          v-model="searchInfo.subAreaCheckedList">
          <label class="custom-control-label" :for="areaInfo.code">{{areaInfo.name.substr(5)}}</label>
        </div>
      </div>

      <div v-if="areaFilterList.length !== 0" class="filter-wrap shadow-sm">
        <span v-for="(areaInfo) in areaFilterList" :key="areaInfo.code" class="filter-child-wrap">
          {{ areaInfo.name }}
          <button class="filter-delete-button" @click="deleteAreaFilter(areaInfo)"></button>
        </span>
      </div>
      
      <div class="line-wrap">
        <label class="custom-label" for="inlineFormCustomSelectPref">MBTI</label>
        <select class="custom-select" id="inlineFormCustomSelectPref" @change="selectMBTI($event)" v-model="searchInfo.selectMbti" :disabled="mbtiList.length === 0">
          <option selected :value="null">무관</option>
          <option v-for="(mbti, index) in mbtiList" :key="index" :value="mbti">{{ mbti }}</option>
        </select>
      </div>

      <div v-if="searchInfo.mbtiCheckedList.length !== 0" class="line-wrap filter-wrap shadow-sm">
        <span v-for="(mbti, index) in searchInfo.mbtiCheckedList" :key="index" class="filter-child-wrap">
          {{ mbti }}
          <button class="filter-delete-button" @click="deleteMbtiFilter(mbti)"></button>
        </span>
      </div>

      <div class="line-wrap">
        <label class="custom-label" for="inlineFormCustomSelectPref">나이</label>
        <select class="custom-select age-select" id="inlineFormCustomSelectPref" v-model="searchInfo.ageRangeInfo.min">
          <option selected :value="null">무관</option>
          <option v-for="(age, index) in ageMinRangeArray" :value="age" :key="index">{{ age }}</option>
        </select>
        ~
        <select class="custom-select age-select" id="inlineFormCustomSelectPref" v-model="searchInfo.ageRangeInfo.max">
          <option selected :value="null">무관</option>
          <option v-for="(age, index) in ageMaxRangeArray" :value="age" :key="index">{{ age }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-info btn-block search-button" @click="search('search')">검색</button>
    </div>


    <!-- 인연 리스트 -->
    <div class="card-container" v-if="isShowPartnerList">
      <div class="partner-card" v-for="(partnerInfo, key) in matchingPartnerList" :key="key">
        <div class="nickname-section">
          {{ partnerInfo.nickname }}
        </div>
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">지역</th>
              <th scope="col">나이</th>
              <th scope="col">MBTI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">{{ partnerInfo.region.rootAreaName + ' ' + partnerInfo.region.subAreaName }}</td>
              <td>{{ partnerInfo.birthYear === 0 ? "?" : getAge(partnerInfo.birthYear) }}</td>
              <td>{{ partnerInfo.mbti === "unkown" ? "?" : partnerInfo.mbti }}</td>
            </tr>
          </tbody>
        </table>
        <template v-for="(questionInfo, root_index) in questionList">

          <template v-for="(questionAnswerInfo, sub_index) in partnerInfo.questionAnswerInfoList ">
            <div v-if=" questionAnswerInfo.questionId === questionInfo._id && questionAnswerInfo.answer.trim() !== ''" 
            class="partner-card-body" :key="root_index + sub_index">
              <div class="question-section">{{ questionInfo.content }}</div>
              <pre class="answer-section">{{ questionAnswerInfo.answer }}</pre>
            </div>
          </template>

        </template>
        <div class="detail-btn-blank"></div>
        <router-link :to="getDetailLink(partnerInfo._id)">
          <button type="submit" class="btn btn-primary btn-lg btn-block detail-btn">자세히 보기</button>
        </router-link>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="isShowLoading" style="margin-top: 100px">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-if="isShowMoreButton" @click="search('more')" class="more-partner-list-button shadow-sm"></div>
  </div>
</template>

<script>
const PARTNER_LIST_COUNT = 30

export default {
  name: 'Matching',
  data: () => {
    return {
      isShowLoading: false,
      isShowPartnerList: true,
      isShowMoreButton: false,
      questionList: [],
      mbtiList: [],
      upperAreaList: [],
      subAreaInfo: {
        // '상위지역코드': ['하위지역코드','하위지역코드', .....],
        // '상위지역코드': ['하위지역코드','하위지역코드', .....],
        // ..
      },
      matchingPartnerList: [],
      searchInfo: {
        mbtiCheckedList: [],
        ageRangeInfo: {
          min: null,
          max: null
        },
        selectUpperAreaInfo: null,
        selectMbti: null,
        upperAreaCheckedList: [],
        subAreaCheckedList: [],
      },
      getAge: (birthYear) => {
        var now = new Date();	// 현재 날짜 및 시간
        return now.getFullYear() - birthYear + 1;
      },
      getBirthYear: (age) => {
        if (!age) return null

        var now = new Date();
        return now.getFullYear() - age + 1
      },
      getDetailLink: (userId) => {
        return "/matching/detail/" + userId
      }
    }
  },
  computed: {
    areaFilterCount: function () {
      return this.searchInfo.upperAreaCheckedList.length + this.searchInfo.subAreaCheckedList.length
    },
    areaFilterList: function () {
      return this.searchInfo.upperAreaCheckedList.concat(this.searchInfo.subAreaCheckedList)
    },
    ageMinRangeArray: function () {
      let ageRangeArray = []
      let maxAge = this.searchInfo.ageRangeInfo.max === null ? 100 : this.searchInfo.ageRangeInfo.max

      for (var i=20; i<=maxAge; i++) {
        ageRangeArray.push(i)
      }
      return ageRangeArray
    },
    ageMaxRangeArray: function () {
      let ageRangeArray = []
      let minAge = this.searchInfo.ageRangeInfo.min === null ? 20 : this.searchInfo.ageRangeInfo.min

      for (var i=minAge; i<=100; i++) {
        ageRangeArray.push(i)
      }
      return ageRangeArray
    }
  },
  methods: {
    selectMBTI: function (e) {
      if (e.target.value === '') {
        this.searchInfo.mbtiCheckedList = []
      } else {
        if (!this.searchInfo.mbtiCheckedList.includes(e.target.value)) this.searchInfo.mbtiCheckedList.push(e.target.value)
      }
    },
    deleteMbtiFilter: function (filterMbti) {
      this.searchInfo.mbtiCheckedList = this.searchInfo.mbtiCheckedList.filter((mbti) => mbti !== filterMbti)

      if (this.searchInfo.mbtiCheckedList.length === 0) this.searchInfo.selectMbti = null
    },
    deleteAreaFilter: function (filterAreaInfo) {
      if (filterAreaInfo.parentCode === null) {
        this.searchInfo.upperAreaCheckedList = this.searchInfo.upperAreaCheckedList.filter((areaInfo) => areaInfo !== filterAreaInfo)
      } else {
        this.searchInfo.subAreaCheckedList = this.searchInfo.subAreaCheckedList.filter((areaInfo) => areaInfo !== filterAreaInfo)
      }
    },
    upperAreaSelect: function () {
      // 무관 선택 시 지역 관련 검색 조건 초기화
      if (this.searchInfo.selectUpperAreaInfo === null) {
        this.searchInfo.upperAreaCheckedList = []
        this.searchInfo.subAreaCheckedList = []
      }
    },
    upperAreaCheck: function (e, selectedUpperAreaInfo) {
      if (e.target.checked) {
        this.searchInfo.subAreaCheckedList = this.searchInfo.subAreaCheckedList.filter(
          (subAreaInfo) => subAreaInfo.parentCode !== selectedUpperAreaInfo.code
        )
      }
    },
    search: async function (type) {
      try {
        let isInitial = (type === 'initial') ? true : false
        let isMore = (type === 'more') ? true : false
        let skip = isMore ? this.matchingPartnerList.length : 0
        this.isShowMoreButton = false
        this.isShowPartnerList = isMore ? true : false
        this.isShowLoading = true

        let checkedUpperAreaCodeList = []
        let checkedSubAreaCodeList = []

        this.searchInfo.upperAreaCheckedList.forEach((areaInfo) => {
          checkedUpperAreaCodeList.push(areaInfo.code)
        })

        this.searchInfo.subAreaCheckedList.forEach((areaInfo) => {
          checkedSubAreaCodeList.push(areaInfo.code)
        })

        let searchStringQuery = isInitial ? 'isInitial=true&' : 'isInitial=false&'

        if (this.searchInfo.mbtiCheckedList.length > 0) {
          searchStringQuery += 'mbtiList=' + this.searchInfo.mbtiCheckedList.join(',') + '&'
        }

        if (this.searchInfo.ageRangeInfo.min !== null) {
          searchStringQuery += 'ageMin=' + this.getBirthYear(this.searchInfo.ageRangeInfo.min) + '&'
        }
        
        if (this.searchInfo.ageRangeInfo.max !== null) {
          searchStringQuery += 'ageMax=' + this.getBirthYear(this.searchInfo.ageRangeInfo.max) + '&'
        }
        
        if (checkedUpperAreaCodeList.length > 0) {
          searchStringQuery += 'upperAreaCodeList=' + checkedUpperAreaCodeList.join(',') + '&'
        }

        if (checkedSubAreaCodeList.length > 0) {
          searchStringQuery += 'subAreaCodeList=' + checkedSubAreaCodeList.join(',') + '&'
        }

        searchStringQuery += 'limit=' + PARTNER_LIST_COUNT + '&'
        searchStringQuery += 'skip=' + skip + '&'

        let response = await this.$http.get('/user/maching-partners?' + searchStringQuery)

        if (isMore) {
          this.matchingPartnerList = this.matchingPartnerList.concat(response.data.userList)
        } else {
          this.matchingPartnerList = response.data.userList
        }
        
        if (isInitial) {
          this.questionList = response.data.questionList
          this.mbtiList = response.data.mbtiList
          let regionInfo = response.data.regionInfo
          this.upperAreaList = regionInfo.upperArea

          // 지역 데이터 가공
          regionInfo.subArea.forEach((areaInfo) => {
            let isSubArea = Object.keys(this.subAreaInfo).includes(areaInfo.parentCode)
            let upperAreaName
            
            for (let index in regionInfo.upperArea) {
              let upperAreaInfo = regionInfo.upperArea[index]

              if (upperAreaInfo.code === areaInfo.parentCode) {
                upperAreaName = upperAreaInfo.name
                break
              }
            }

            if (!isSubArea) this.subAreaInfo[areaInfo.parentCode] = []

            // 상위 지역 이름 표시 (ex. 서울 > 관악구)
            areaInfo.name = upperAreaName + ' > ' + areaInfo.name

            this.subAreaInfo[areaInfo.parentCode].push(areaInfo)
          })
        }

        this.isShowMoreButton = (response.data.userList.length >= PARTNER_LIST_COUNT) ? true : false
      } catch (error) {
        alert('페이지 로드중 에러가 발생하였습니다.')
      } finally {
        this.isShowLoading = false
        this.isShowPartnerList = true
      }
    }
  },
  async created () {
    try {
      if ( this.getIsHistoryBack() ) {
        Object.assign(this.$data, JSON.parse(this.getCache()))
      } else {
        await this.search('initial')
      }
    } catch (error) {
      alert('페이지 로딩중 문제가 발생하였습니다.')
      console.log(error)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.saveCache(this.$data)
    next()
  }
}
</script>

<style lang="scss" scoped>
.content-container {
  font-size: 17px;
}
.nickname-section {
  width: 100%;
  text-align: center;
  padding: 0px 10px 10px 10px;
}
.search-button {
  margin-top: 24px;
  font-size: 18px;
}
.line-wrap:not(:first-child) {
  margin-top: 15px;
}
.filter-wrap {
  border-radius: 10px;
  padding: 10px;
  background-color: #e1e1e1;
  border: 1px solid #bbbbbb;
  margin: 0 auto;
}
.filter-child-wrap {
  margin-right: 8px;
}
.filter-delete-button {
  width: 21px;
  height: 21px;
  border: 0;
  vertical-align: text-top;
  background: url("../assets/img/x.svg");
  background-size: 23px;
  background-repeat: no-repeat;
}
.subarea-checkbox-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: 10px;
  font-size: 16px;
  padding: 10px 20px 5px 20px;
  background-color: #f4f4f4;
  margin: 20px auto;
  border: 1px solid #dbdbdb;
  .custom-checkbox {
    width: 20%;
    margin-bottom: 5px;
  }
  @media (min-width: 1400px) {
    .custom-checkbox {
      width: 16.6%;
      margin-bottom: 10px;
    }
  }
  @media (max-width: 768px) {
    .custom-checkbox {
      width: 50%;
      margin-bottom: 10px;
    }
  }
}
.custom-label {
  display: inline-block;
  width: 50px;
  margin-right: 15px;
}
.custom-select {
  vertical-align: baseline;
  display: inline-block;
  width: 200px;
}
.region-select-box {
  border: 1px solid #000;
  border-radius: 5px;
  padding: 10px;
}
.region-select-button {
  cursor: pointer;
  background-color: #000;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: white;
}
.search-wrap {
  background-color: #fff;
  border-radius: 6px;
  padding: 24px 24px 20px 24px;
  // padding: 18px 12px 14px 12px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #bdbdbd;
}
@media (max-width: 768px) {
  .search-wrap {
    padding: 15px;
  }
}
.detail-btn {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: calc(100% - 20px);
  margin-top: 15px;
}
.detail-btn-blank {
  height: 45px;
}
.card-container {
  display: flex;
  flex-wrap : wrap;
  justify-content: space-between;
  flex-direction: row;
}
.partner-card {
  position: relative;
  display: inline-block;
  margin-bottom: 7px;
  width: 33%;
  padding: 10px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0px 1px 5px -2px;
}
.table {
  text-align: center;
  margin-bottom: 18px;
}
.question-section {
  font-weight: bold;
  margin-bottom: 10px;
}
.answer-section {
  white-space: pre-wrap;
  word-break: break-all;
  background-color:#f9f9f9;
  border: 1px solid #d8d6d6;
  padding: 10px;
}

.more-partner-list-button {
  position: relative;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
  height: 50px;
  background-color: #ffffff;
  border-radius: 6px;
}

.more-partner-list-button:hover {
  opacity: 0.6;
}

.more-partner-list-button::after {
  content: '';
  width: 20px; /* 사이즈 */
  height: 20px; /* 사이즈 */
  border-top: 1px solid #121212; /* 선 두께 */
  border-right: 1px solid #121212; /* 선 두께 */
  display: inline-block;
  position: absolute;
  top: 50%; /* 기본 0px 값으로 해주세요 */
  left: 50%; /* 기본 0px 값으로 해주세요 */
  transform: translate(-50%, -75%) rotate(135deg);
}

@media (max-width: 1200px) {
  .partner-card {
    margin-bottom: 10px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .age-select {
    width: 30%;
  }
  .nickname-section {
    font-size: 16px;
  }
}
</style>