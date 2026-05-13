import { API_URL } from '../config/config.js';
import { createSpinner, destroySpinner } from '../ui/spinner.js';

export function addBtnListeners() {
  document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
      const albumId = event.currentTarget.dataset.id
      const albumTitle = event.currentTarget.closest('article')?.querySelector('h2')?.textContent || 'Item'

      try {
        const res = await fetch(API_URL + '/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId: albumId })
        })

        if (!res.ok) {
          return window.location.href = '/login.html'
        }

        await updateCartIcon()
        showToast(`"${albumTitle}" added to cart`)
      } catch (err) {
        console.error('Error adding to cart:', err)
      }
    })
  })
}

export async function updateCartIcon() {
  try {
    const res = await fetch(API_URL + '/api/cart/cart-count', { credentials: 'include' })
    const obj = await res.json()
    const totalItems = obj.totalItems

    const cartBanner = document.getElementById('cart-banner')
    if (!cartBanner) return

    if (totalItems > 0) {
      cartBanner.innerHTML = `
        <a href="/cart.html" aria-label="Cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="cart-count">${totalItems}</span>
        </a>
      `
      cartBanner.classList.remove('pulse')
      void cartBanner.offsetWidth
      cartBanner.classList.add('pulse')
      setTimeout(() => cartBanner.classList.remove('pulse'), 500)
    } else {
      cartBanner.innerHTML = ''
    }
  } catch (err) {
    console.error('Error updating cart icon:', err)
  }
}

export async function loadCart(dom) {
  const { checkoutBtn, userMessage, cartList, cartTotal } = dom;
  const container = document.querySelector('#cart-list')
  let spinner;
  try {
    spinner = createSpinner(container)
    const items = await fetchCartItems(dom)
    renderCartItems(items, cartList)
    updateCartTotal(items, cartTotal, checkoutBtn)
  } catch (err) {
    console.error('Error loading cart:', err)
    cartList.innerHTML = '<li>Error loading cart data.</li>'
  } finally {
    destroySpinner(spinner);
  }
}

async function fetchCartItems({ userMessage, checkoutBtn }) {
  const res = await fetch(API_URL + '/api/cart/', { credentials: 'include' })

  if (!res.ok) {
    window.location.href = '/'
    checkoutBtn.disabled = true
    checkoutBtn.classList.add('disabled')
    userMessage.innerHTML = 'Please <a href="login.html">log in</a>.'
    return []
  }

  const { items } = await res.json()
  return items
}

function renderCartItems(items, cartList) {
  cartList.innerHTML = ''

  items.forEach(item => {
    const li = document.createElement('li')
    li.className = 'cart-item'

    const itemTotal = item.price * item.quantity

    li.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <span>× ${item.quantity} = $${itemTotal.toFixed(2)}</span>
      </div>
      <button data-id="${item.cartitemid}" class="remove-btn" aria-label="Remove ${item.title}">🗑</button>
    `

    cartList.appendChild(li)
  })
}

function updateCartTotal(items, cartTotal, checkoutBtn) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.innerHTML = `$${total.toFixed(2)}`

  if (total <= 0) {
    checkoutBtn.disabled = true
    checkoutBtn.classList.add('disabled')
  }
}

export async function removeItem(itemId, dom) {
  try {
    const res = await fetch(API_URL + `/api/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.status === 204) {
      await loadCart(dom)
    } else {
      console.error('Error removing item:', await res.text())
    }
  } catch (err) {
    console.error('Error removing item:', err)
  }
}

export async function removeAll(dom) {
  try {
    const res = await fetch(API_URL + `/api/cart/all`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.status === 204) {
      await loadCart(dom)
    } else {
      console.error('Error clearing cart:', await res.text())
    }
  } catch (err) {
    console.error('Error clearing cart:', err)
  }
}

// ===== Toast =====

export function showToast(message) {
  const container = document.getElementById('toast-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.setAttribute('role', 'status')
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => toast.remove(), 3100)
}
