(() => {
  let anchor = null

  function findClosestAnchor() {
    const scrollHeight = $('.content').prop('scrollHeight')
    let distance = Infinity
    let closest = null

    $('.content .anchor').each(function () {
      const { y } = this.getBoundingClientRect()
      const d = Math.abs(y) + (y < 0 ? scrollHeight : 0)

      if (d >= distance) return

      distance = d
      closest = this
    })

    if (anchor === closest) return

    anchor = closest
    window.dispatchEvent(new CustomEvent('anchorupdate', {
      detail: {
        anchor
      }
    }))
  }

  $('.content').on('scroll', findClosestAnchor)

  findClosestAnchor()
})()