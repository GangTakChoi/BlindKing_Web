let commonMixin = {
  data () {
    return {
      isMobile: Boolean
    }
  },
  created () {
    this.isMobile = window.innerWidth <= 768
  }
}

export default commonMixin