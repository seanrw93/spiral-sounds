import { logout } from '../auth/logout.js'

// ===== Navbar: scroll backdrop-blur =====
const banner = document.getElementById('top-banner')

if (banner) {
  const onScroll = () => banner.classList.toggle('scrolled', window.scrollY > 10)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// ===== Mobile menu =====
const toggle     = document.getElementById('menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')

function openMenu() {
  mobileMenu?.classList.add('open')
  mobileMenu?.removeAttribute('aria-hidden')
  toggle?.classList.add('is-open')
  toggle?.setAttribute('aria-expanded', 'true')
  toggle?.setAttribute('aria-label', 'Close menu')
  document.body.style.overflow = 'hidden'
}

function closeMenu() {
  mobileMenu?.classList.remove('open')
  mobileMenu?.setAttribute('aria-hidden', 'true')
  toggle?.classList.remove('is-open')
  toggle?.setAttribute('aria-expanded', 'false')
  toggle?.setAttribute('aria-label', 'Toggle menu')
  document.body.style.overflow = ''
}

toggle?.addEventListener('click', () => {
  mobileMenu?.classList.contains('open') ? closeMenu() : openMenu()
})

mobileMenu?.addEventListener('click', (e) => {
  if (e.target.matches('a')) closeMenu()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu()
})

// ===== Inject mobile auth section based on auth state =====
// Called by authUI.js after auth check resolves

export function renderMobileAuth(name) {
  const container = document.getElementById('mobile-auth-links')
  if (!container) return

  if (name) {
    container.innerHTML = `
      <a href="/orders.html" class="mobile-nav-link">Order History</a>
      <a href="/account.html" class="mobile-nav-link">Account</a>
      <button class="mobile-nav-link mobile-nav-logout" id="mobile-logout-btn">Log out</button>
    `
    container.querySelector('#mobile-logout-btn')?.addEventListener('click', logout)
  } else {
    container.innerHTML = `
      <a href="/login.html" class="mobile-nav-link">Log in</a>
      <a href="/signup.html" class="mobile-nav-link mobile-nav-signup">Sign up</a>
    `
  }
}
