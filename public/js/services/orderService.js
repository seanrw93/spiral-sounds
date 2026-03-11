import { API_URL } from "../config/config.js";
import { updateOrderStatusUI } from "../ui/orderUI.js";

export async function createOrder() {
    try {
        const res = await fetch(API_URL + '/api/orders', {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);

            return {
                success: false,
                status: res.status,
                error: errorData?.error || "Failed to create order"
            };
        }

        const data = await res.json();

        return {
            success: true,
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            totalPrice: data.totalPrice,
            items: data.items
        };

    } catch (err) {
        return {
            success: false,
            error: "Network error creating order",
            details: err.message
        };
    }
}

export const loadOrderStatusMessage = async (orderId, dom) => {
    try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, { credentials: "include"} );

        if (!res.ok) {
                dom.userMessage.textContent = 'Your are not authorised to view this order.';
                dom.checkoutBtn.classList.add('visually-hidden');
                dom.cartTotal.classList.add('visually-hidden');
        }

        const order = await res.json();
        updateOrderStatusUI(dom, order);
    } catch (err) {
        console.error("Error loading order status", err);
    }
}
