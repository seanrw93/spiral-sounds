import { logout } from '../auth/logout.js';
import { checkAuth, renderGreeting, showHideMenuItems } from './authUI.js';
import { loadCart, removeItem, removeAll } from '../services/cartService.js';
import { createOrder } from '../services/orderService.js';
import { createCheckoutSession } from '../services/checkoutService.js';
import { loadOrderStatusMessage } from '../services/orderService.js';

const dom = {
  checkoutBtn: document.getElementById('checkout-btn'),
  userMessage: document.getElementById('user-message'),
  cartList: document.getElementById('cart-list'),
  cartTotal: document.getElementById('cart-total')
}

document.getElementById('logout-btn').addEventListener('click', logout);

dom.cartList.addEventListener('click', event => {
  if (event.target.matches('.remove-btn')) {
    removeItem(event.target.dataset.id, dom);
  }
});

dom.checkoutBtn.addEventListener('click', async () => {
  const result = await createOrder();

  if (!result.success) {
    dom.userMessage.textContent = result.error || "Order failed.";
    return;
  }
  
  removeAll(dom);
  const url = await createCheckoutSession(result);
  window.location.href = url.url;

  dom.userMessage.textContent = 'Your order has been sent for processing.';
  dom.checkoutBtn.classList.add('visually-hidden');
  dom.cartTotal.classList.add('visually-hidden');
});

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    
    if (orderId) {
      await loadOrderStatusMessage(orderId, dom);
    }
});

async function init() {
  loadCart(dom);
  const username = await checkAuth();
  renderGreeting(username);
  showHideMenuItems(username);
} 
 
init();
