// ===== Navbar: scroll backdrop-blur =====
const banner = document.getElementById('top-banner')

if (banner) {
  const onScroll = () => {
    banner.classList.toggle('scrolled', window.scrollY > 10)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// ===== Mobile dropdown =====
const toggle = document.getElementById('menu-toggle')
const nav    = document.getElementById('header-menu')   // the nav-auth element

function openMenu() {
  nav?.classList.add('open')
  toggle?.classList.add('is-open')
  toggle?.setAttribute('aria-expanded', 'true')
  toggle?.setAttribute('aria-label', 'Close menu')
}

function closeMenu() {
  nav?.classList.remove('open')
  toggle?.classList.remove('is-open')
  toggle?.setAttribute('aria-expanded', 'false')
  toggle?.setAttribute('aria-label', 'Toggle menu')
}

toggle?.addEventListener('click', () => {
  nav?.classList.contains('open') ? closeMenu() : openMenu()
})

nav?.addEventListener('click', (e) => {
  if (e.target.matches('a')) closeMenu()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) closeMenu()
})
