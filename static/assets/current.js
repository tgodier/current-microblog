;(function () {
  'use strict'

  /* ── Theme Switching ───────────────────────────────────── */

  var root = document.documentElement

  function getPalette () {
    return localStorage.getItem('current-palette') || 'paper'
  }

  function getMode () {
    var stored = localStorage.getItem('current-mode')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function applyTheme () {
    var palette = getPalette()
    var mode = getMode()
    root.setAttribute('data-palette', palette)
    if (palette === 'midnight') {
      root.setAttribute('data-mode', 'dark')
    } else {
      root.setAttribute('data-mode', mode)
    }
    updateDots(palette)
    updateModeLabel(palette === 'midnight' ? 'dark' : mode)
  }

  function setPalette (name) {
    localStorage.setItem('current-palette', name)
    applyTheme()
  }

  function toggleMode () {
    var current = getMode()
    var next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('current-mode', next)
    applyTheme()
  }

  function updateDots (palette) {
    var dots = document.querySelectorAll('.theme-switcher__dot')
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('active', dots[i].dataset.palette === palette)
    }
  }

  function updateModeLabel (mode) {
    var btn = document.querySelector('.theme-switcher__mode')
    if (btn) btn.textContent = mode === 'dark' ? '☀ Light' : '☾ Dark'
  }

  /* ── Font Size ────────────────────────────────────────── */

  function getSize () {
    return localStorage.getItem('current-size') || 'default'
  }

  function applySize () {
    var size = getSize()
    root.removeAttribute('data-size')
    if (size !== 'default') root.setAttribute('data-size', size)
    updateSizeBtns(size)
  }

  function setSize (size) {
    localStorage.setItem('current-size', size)
    applySize()
  }

  function updateSizeBtns (size) {
    var btns = document.querySelectorAll('.theme-switcher__size-btn')
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].dataset.size === size)
    }
  }

  /* ── Theme Picker Toggle ───────────────────────────────── */

  function initThemeSwitcher () {
    var toggle = document.querySelector('.theme-switcher__toggle')
    var dropdown = document.querySelector('.theme-switcher__dropdown')
    if (!toggle || !dropdown) return

    toggle.addEventListener('click', function (e) {
      e.stopPropagation()
      dropdown.classList.toggle('open')
    })

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.theme-switcher')) {
        dropdown.classList.remove('open')
      }
    })

    // Palette dots
    var dots = dropdown.querySelectorAll('.theme-switcher__dot')
    for (var i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', function () {
        setPalette(this.dataset.palette)
      })
    }

    // Size buttons
    var sizeBtns = dropdown.querySelectorAll('.theme-switcher__size-btn')
    for (var j = 0; j < sizeBtns.length; j++) {
      sizeBtns[j].addEventListener('click', function () {
        setSize(this.dataset.size)
      })
    }

    // Mode toggle
    var modeBtn = dropdown.querySelector('.theme-switcher__mode')
    if (modeBtn) {
      modeBtn.addEventListener('click', function () {
        toggleMode()
      })
    }
  }

  /* ── Rise-in Animation ─────────────────────────────────── */

  function initRiseIn () {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      var els = document.querySelectorAll('.rise-in')
      for (var i = 0; i < els.length; i++) els[i].classList.add('visible')
      return
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible')
          observer.unobserve(entries[i].target)
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    var items = document.querySelectorAll('.rise-in')
    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j])
    }

    // Beliefs page — animate each paragraph on scroll
    var beliefs = document.querySelectorAll('.beliefs .article__body > p')
    for (var k = 0; k < beliefs.length; k++) {
      observer.observe(beliefs[k])
    }
  }

  /* ── Init ──────────────────────────────────────────────── */

  // Apply theme + size immediately (before DOMContentLoaded) to prevent flash
  applyTheme()
  applySize()

  document.addEventListener('DOMContentLoaded', function () {
    initThemeSwitcher()
    initRiseIn()
  })

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!localStorage.getItem('current-mode')) {
      applyTheme()
    }
  })
})()
