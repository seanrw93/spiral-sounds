import { API_URL } from '../config/config.js'

export async function checkAuth() {
  try {
    const res = await fetch(API_URL + '/api/auth/me', { credentials: 'include' })
    if (!res.ok) return false
    const user = await res.json()
    return user.isLoggedIn ? user.name : false
  } catch (err) {
    console.log(err, 'Auth check failed')
    return false
  }
}

export function renderGreeting(name) {
  const el = document.getElementById('greeting')
  if (el) el.textContent = name ? `Welcome, ${name}!` : ''
}

export function showHideMenuItems(name) {
  const isLoggedIn = !!name

  const login    = document.getElementById('login')
  const signup   = document.getElementById('signup')
  const userMenu = document.getElementById('user-menu')
  const namEl    = document.getElementById('user-menu-name')

  if (login)  login.style.display  = isLoggedIn ? 'none' : ''
  if (signup) signup.style.display = isLoggedIn ? 'none' : ''

  if (userMenu) {
    userMenu.style.display = isLoggedIn ? 'flex' : 'none'
    if (namEl && name) namEl.textContent = name
  }

  // Legacy logout-btn outside dropdown (cart.js / index.js still listen on it)
  const legacyLogout = document.getElementById('logout-btn')
  if (legacyLogout && !legacyLogout.closest('.user-menu')) {
    legacyLogout.style.display = isLoggedIn ? 'inline' : 'none'
  }
}

export function initUserMenuDropdown() {
  const trigger  = document.getElementById('user-menu-trigger')
  const dropdown = document.getElementById('user-menu-dropdown')
  if (!trigger || !dropdown) return

  const open = () => {
    dropdown.classList.add('open')
    trigger.setAttribute('aria-expanded', 'true')
  }
  const close = () => {
    dropdown.classList.remove('open')
    trigger.setAttribute('aria-expanded', 'false')
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation()
    dropdown.classList.contains('open') ? close() : open()
  })

  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) close()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}
