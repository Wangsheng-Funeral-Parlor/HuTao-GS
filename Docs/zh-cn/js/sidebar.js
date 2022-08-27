(() => { // NOSONAR
  const APP_NAME = 'HuTao GS/CN'
  const CURRENT_PATH = location.href.replace(/#.*$/m, '')
  const BASE_PATH = CURRENT_PATH.match(/.*\/zh-cn/)[0]
  const SIDEBAR_TEMPLATE = [
    {
      id: 'guide',
      title: '目录',
      heading: true,
      child: [
        { id: 'building', title: '构建服务端' },
        { id: 'resources', title: 'Resources' },
        { id: 'running', title: '运行与连接' },
        { id: 'troubleshooting', title: '问题解答' }
      ]
    }
  ]

  const sidebarElem = $('<div class="sidebar">').appendTo($('body'))

  function parseId(text) {
    return text
      .replace(/\(.*\)/g, '')
      .trim()
      .replace(/ /g, '-')
      .toLowerCase()
  }

  function buildAnchors() {
    $('h2').each(function () {
      const elem = $(this)

      const text = elem.text()
      const html = elem.html()
      const anchorId = parseId(text)

      elem
        .empty()
        .append(
          $('<a class="anchor">')
            .attr('id', `a-${anchorId}`)
            .attr('href', `#a-${anchorId}`)
            .html(html)
        )
    })
  }

  function buildSubNav(container) {
    $('.anchor').each(function () {
      const anchor = $(this)
      const anchorId = anchor.attr('id')

      $('<li>')
        .data('id', anchorId)
        .append(
          $('<a>')
            .attr('href', `#${anchorId}`)
            .text(anchor.text().replace(/\(.*\)/g, ''))
        )
        .appendTo(container)
    })
  }

  function buildNav(container, templateArray, path) {
    container.empty()

    for (let template of templateArray) {
      if (typeof template === 'string') template = { title: template } // NOSONAR

      const { id, title, heading, child } = template
      const itemId = id || parseId(title)
      const itemPath = `${path}/${itemId}`

      const elem = $('<li>').appendTo(container)

      if (heading) {
        $('<p>')
          .attr('title', title)
          .text(title)
          .appendTo(elem)
      } else {
        $('<a>')
          .attr('href', `${itemPath}.html`)
          .attr('title', title)
          .text(title)
          .appendTo(elem)
      }

      if (CURRENT_PATH.replace(/\/index.html|.html/, '') === itemPath) {
        buildSubNav($('<ul class="sub-nav">').appendTo(elem.addClass('active')))
      }

      if (child && CURRENT_PATH.indexOf(path) === 0) buildNav($('<ul>').appendTo(elem), child, itemPath)
    }
  }

  function updateAnchor(evt) {
    const anchor = $(evt.detail.anchor)
    $('.sidebar .sub-nav li').each(function () {
      const elem = $(this)

      if (anchor.attr('id') === elem.data('id')) {
        elem.addClass('active')
      } else {
        elem.removeClass('active')
      }
    })
  }

  buildAnchors()

  $('<h1 class="app-name">').append(
    $('<a class="app-name-link">')
      .attr('href', `${BASE_PATH}/index.html`)
      .text(APP_NAME)
  ).appendTo(sidebarElem)

  buildNav($('<ul class="nav">').appendTo(sidebarElem), SIDEBAR_TEMPLATE, BASE_PATH)

  window.addEventListener('anchorupdate', updateAnchor)

  $('<button class="sidebar-toggle"><svg><path d="M 0,2 L 25,2 Z M 0,12.5 L 25,12.5 Z M 0,23 L 25,23" /></svg></button>').on('click', () => {
    $('body').toggleClass('sidebar-toggled')
  }).appendTo($('body'))

  if ($(location.hash).length > 0) {
    $(location.hash)[0].scrollIntoView(true)
  } else if ($(`[name="${location.hash.replace(/#/, '')}"]`).length > 0) {
    $(`[name="${location.hash.replace(/#/, '')}"]`)[0].scrollIntoView(true)
  }
})()
