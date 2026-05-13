import { API_URL } from '../config/config.js';
import { renderSkeletons } from '../ui/productUI.js'


// ===== Fetching products =====

export async function getProducts(filters = {}) {
  const queryParams = new URLSearchParams(filters);
  const container = document.querySelector('#products-container');

  if (container) renderSkeletons()

  try {
    const res = await fetch(`${API_URL}/api/products?${queryParams}`, { credentials: 'include' });
    if (!res.ok) return null
    const data = await res.json();
    return Array.isArray(data) ? data : null
  } catch (err) {
    console.error('Error loading products:', err);
    return null
  }
}

// ===== Populate the genre dropdown =====

export async function populateGenreSelect() {
  const res = await fetch(API_URL + '/api/products/genres', { credentials: 'include' });
  const data = await res.json()
  const genres = Array.isArray(data) ? data : []
  const select = document.getElementById('genre-select')

  genres.forEach(genre => {
    const option = document.createElement('option')
    option.value = genre
    option.textContent = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
    select.appendChild(option)
  })
}
