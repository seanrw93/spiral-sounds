import { API_URL } from '../config/config.js'
import { checkAuth, showHideMenuItems, renderGreeting } from './authUI.js'
import { logout } from '../auth/logout.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function renderAccount(user) {
  document.getElementById('account-container').innerHTML = `
    <div class="account-card">
      <div class="account-avatar" aria-hidden="true">
        ${user.name.charAt(0).toUpperCase()}
      </div>

      <div class="account-fields">
        <div class="account-field">
          <span class="account-field-label">Full name</span>
          <span class="account-field-value">${user.name}</span>
        </div>
        <div class="account-field">
          <span class="account-field-label">Username</span>
          <span class="account-field-value">@${user.username}</span>
        </div>
        <div class="account-field">
          <span class="account-field-label">Email</span>
          <span class="account-field-value">${user.email}</span>
        </div>
        <div class="account-field">
          <span class="account-field-label">Member since</span>
          <span class="account-field-value">${formatDate(user.created_at)}</span>
        </div>
      </div>

      <div class="account-actions">
        <a href="/orders.html" class="nav-auth-btn" style="text-decoration:none;">View Order History</a>
        <a href="/reset-password.html" class="nav-auth-link" style="font-size:.875rem;">Change password</a>
      </div>
    </div>
  `
}

async function init() {
  const username = await checkAuth()
  if (!username) {
    window.location.href = '/login.html'
    return
  }

  renderGreeting(username)
  showHideMenuItems(username)

  document.getElementById('logout-btn')?.addEventListener('click', logout)
  document.getElementById('user-menu-name').textContent = username

  try {
    const res = await fetch(API_URL + '/api/auth/account', { credentials: 'include' })
    if (!res.ok) throw new Error(res.status)
    const user = await res.json()
    renderAccount(user)
  } catch (err) {
    console.error('Failed to load account:', err)
    document.getElementById('account-container').innerHTML =
      '<p class="error" style="text-align:center;padding:2rem;">Failed to load account. Please try again.</p>'
  }
}

init()
