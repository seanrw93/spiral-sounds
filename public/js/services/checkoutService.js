import { API_URL } from "../config/config.js";

export async function createCheckoutSession(orders) {
    try {
        const res = await fetch(API_URL + '/api/checkout/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(orders)
        });

        const data = res.json()
        return data;
    } catch (err) {
        console.error("Network error:", err)
    }
}