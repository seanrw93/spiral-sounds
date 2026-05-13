import { addBtnListeners } from '../services/cartService.js'
import { getProducts } from '../services/productService.js'

// ===== IntersectionObserver lazy loader =====

let lazyObserver = null

function getLazyObserver() {
  if (lazyObserver) return lazyObserver

  lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const img = entry.target
      const src = img.dataset.src
      if (!src) return

      img.src = src
      img.removeAttribute('data-src')
      img.classList.add('lazy-loaded')
      lazyObserver.unobserve(img)
    })
  }, {
    rootMargin: '200px 0px',  // start loading 200px before entering viewport
    threshold: 0
  })

  return lazyObserver
}

function observeLazyImages(container) {
  const observer = getLazyObserver()
  container.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))
}

// ===== Skeleton loading =====

export function renderSkeletons(count = 8) {
  const container = document.getElementById('products-container')
  if (!container) return

  container.innerHTML = Array.from({ length: count }, () => `
    <div class="product-card-skeleton" aria-hidden="true">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
      <div class="skeleton skeleton-line price"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>
  `).join('')
}

// ===== Rendering products =====

export function renderProducts(products) {
  const container = document.getElementById('products-container')
  if (!container) return

  if (products === null) {
    container.innerHTML = `
      <div class="empty-state" role="status">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Couldn't load the collection</p>
        <span>We're having a technical issue — please check back shortly or <a href="mailto:hello@spiralsounds.shop">contact us</a>.</span>
      </div>
    `
    return
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p>No records found</p>
        <span>Try adjusting your search or filter</span>
      </div>
    `
    return
  }

  const cards = products.map((album) => `
    <article class="product-card" aria-label="${album.title} by ${album.artist}">
      <div class="product-card-image">
        <img
          data-src="${album.image}"
          alt="${album.title} album art"
          decoding="async"
          class="lazy"
        >
        <span class="genre-label">${album.genre}</span>
      </div>
      <div class="product-card-body">
        <h2>${album.title}</h2>
        <h3>${album.artist}</h3>
        <p class="product-card-price">$${parseFloat(album.price).toFixed(2)}</p>
      </div>
      <div class="product-card-footer">
        <div class="add-btn-wrapper">
          <button class="main-btn add-btn" data-id="${album.id}" aria-label="Add ${album.title} to cart">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join('')

  container.innerHTML = cards
  observeLazyImages(container)
  addBtnListeners()
}

// ===== Handling filtering =====

export async function applySearchFilter() {
  const search = document.getElementById('search-input')?.value.trim()
  const filters = {}
  if (search) filters.search = search
  const products = await getProducts(filters)
  renderProducts(products)
}
