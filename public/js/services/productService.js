import { API_URL } from '../config/config.js';
import { createSpinner, destroySpinner} from "../ui/spinner.js"


// ===== Fetching products =====

export async function getProducts(filters = {}) {
  const queryParams = new URLSearchParams(filters);
  const container = document.querySelector("#products-container");
  let spinner;
  
  try {
    spinner = createSpinner(container)
    const res = await fetch(`${API_URL}/api/products?${queryParams}`, { credentials: 'include' });
    return await res.json();
  } catch (err) {
    console.error('Error loading products:', err);
  } finally {
    destroySpinner(spinner);
  }
}

// ===== Populate the genre dropdown =====

export async function populateGenreSelect() {
  const res = await fetch(API_URL + '/api/products/genres', { credentials: 'include' });
  const genres = await res.json() // expects an array of genres as strings: ['rock', 'pop', ...]
  const select = document.getElementById('genre-select')

  genres.forEach(genre => {
    const option = document.createElement('option')
    option.value = genre
    option.textContent = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
    select.appendChild(option)
  })
}