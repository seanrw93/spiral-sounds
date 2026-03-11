export function updateOrderStatusUI(dom, order) {
  switch (order.status) {
    case "paid":
      dom.userMessage.textContent = `Your order is confirmed with order number ${order.order_number}`;
      dom.checkoutBtn.classList.add('visually-hidden');
      dom.cartTotal.classList.add('visually-hidden');
      break;

    case "pending":
      dom.userMessage.textContent = "Payment pending… waiting for confirmation.";
      dom.checkoutBtn.classList.add('visually-hidden');
      dom.cartTotal.classList.add('visually-hidden');
      break;

    case "cancelled":
      dom.userMessage.textContent = "Payment failed or was cancelled. Please try again later.";
      dom.checkoutBtn.classList.add('visually-hidden');
      dom.cartTotal.classList.add('visually-hidden');
      break;

    default:
      dom.userMessage.textContent = "Unknown order status.";
      dom.checkoutBtn.classList.add('visually-hidden');
      dom.cartTotal.classList.add('visually-hidden');
  }
}
