import { API_URL } from '../config/config.js'
import { checkAuth, showHideMenuItems, renderGreeting } from './authUI.js'
import { logout } from '../auth/logout.js'

const STATUS_LABELS = {
  pending:    { label: 'Processing',  cls: 'status-processing' },
  paid:       { label: 'Paid',        cls: 'status-paid' },
  processing: { label: 'Processing',  cls: 'status-processing' },
  sent:       { label: 'Shipped',     cls: 'status-shipped' },
  shipped:    { label: 'Shipped',     cls: 'status-shipped' },
  completed:  { label: 'Delivered',   cls: 'status-delivered' },
  delivered:  { label: 'Delivered',   cls: 'status-delivered' },
  cancelled:  { label: 'Cancelled',   cls: 'status-cancelled' },
  refunded:   { label: 'Refunded',    cls: 'status-cancelled' },
}

function statusBadge(raw) {
  const key = (raw || 'pending').toLowerCase()
  const { label, cls } = STATUS_LABELS[key] ?? { label: raw, cls: 'status-processing' }
  return `<span class="order-status-badge ${cls}">${label}</span>`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function renderOrders(orders) {
  const container = document.getElementById('orders-container')

  if (!orders.length) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
        </svg>
        <p>No orders yet</p>
        <span>Your orders will appear here once you make a purchase</span>
        <a href="/" class="main-btn" style="width:auto;margin-top:1rem;padding:.65rem 1.5rem;">Browse the Collection</a>
      </div>`
    return
  }

  container.innerHTML = orders.map(order => `
    <article class="order-card">
      <div class="order-card-header">
        <div class="order-meta">
          <span class="order-number">Order #${order.order_number}</span>
          <span class="order-date">${formatDate(order.created_at)}</span>
        </div>
        <div class="order-header-right">
          ${statusBadge(order.status)}
          <span class="order-total">$${parseFloat(order.total_price).toFixed(2)}</span>
        </div>
      </div>

      <ul class="order-items-list">
        ${order.items.map(item => `
          <li class="order-item">
            <img src="${item.image}" alt="${item.title}" class="order-item-img lazy" data-src="${item.image}">
            <div class="order-item-info">
              <strong>${item.title}</strong>
              <span>${item.artist}</span>
            </div>
            <span class="order-item-qty">× ${item.quantity}</span>
            <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </li>`).join('')}
      </ul>

      ${order.shipping_city ? `
        <p class="order-shipping">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Shipping to ${order.shipping_city}${order.shipping_country ? ', ' + order.shipping_country : ''}
        </p>` : ''}
    </article>
  `).join('')
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
    const res = await fetch(API_URL + '/api/orders/history', { credentials: 'include' })
    if (!res.ok) throw new Error(res.status)
    const orders = await res.json()
    renderOrders(Array.isArray(orders) ? orders : [])
  } catch (err) {
    console.error('Failed to load orders:', err)
    document.getElementById('orders-container').innerHTML =
      '<p class="error" style="text-align:center;padding:2rem;">Failed to load orders. Please try again.</p>'
  }
}

init()
