import { logout } from './auth/logout.js'
import { checkAuth, renderGreeting, showHideMenuItems, initUserMenuDropdown } from './ui/authUI.js'
import { getProducts, populateGenreSelect } from './services/productService.js'
import { renderProducts, applySearchFilter } from './ui/productUI.js'
import { updateCartIcon } from './services/cartService.js'
import { debounce } from './debouncer.js'

document.getElementById('logout-btn').addEventListener('click', logout)

// ===== Initial Load =====

async function init() {
  populateGenreSelect()
  const products = await getProducts()
  const username = await checkAuth()
  renderGreeting(username)
  renderProducts(products)
  showHideMenuItems(username)
  initUserMenuDropdown()
  if (username) {
    await updateCartIcon()
  }
}

init()


// ===== Event Listeners =====
const debouncedSearch = debounce(applySearchFilter);

document.getElementById('search-input').addEventListener('input', (e) => {
  e.preventDefault();
  debouncedSearch();
})

// prevent 'enter' from submitting
document.getElementById('search-input').addEventListener('submit', (e) => {
  e.preventDefault()
})

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  applySearchFilter() 
})

document.getElementById('genre-select').addEventListener('change', async (e) => {
  const genre = e.target.value
  const products = await getProducts(genre ? { genre } : {})
  renderProducts(products)
})


 