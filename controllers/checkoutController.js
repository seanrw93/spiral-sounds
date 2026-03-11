import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:8000";


export const createCheckoutSession = async (req, res) => {
    const { orderId, orderNumber, items } = req.body;
    const orderProperties = Object.entries(req.body);

    // Validate top-level order fields
    for (const [key, value] of orderProperties) {
        if (value === undefined || value === null || value === "") {
            return res.status(400).json({ error: `${key} is missing a value` });
        }

        // Special case: items[] must not be empty
        if (Array.isArray(value) && value.length === 0) {
            return res.status(400).json({ error: `${key} array is missing` })
        }
    }

    // Validate each item inside items[]
    if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            for (const [key, value] of Object.entries(item)) {

                // Missing value
                if (value === undefined || value === null || value === "") {
                    return res.status(400).json({ error: `items[${i}].${key} is missing a value` });
                }

                // Quantity must be > 0
                if (key === "quantity" && value <= 0) {
                    return res.status(400).json({ error: `items[${i}].quantity must be greater than 0` });

                }

                // Price must be > 0
                if (key === "price" && value <= 0) {
                    return res.status(400).json({
                        error: `items[${i}].price must be greater than 0`
                    });
                }
            }
        }
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "required",
            shipping_address_collection: {
                allowed_countries: [
                    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE",
                    "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV",
                    "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
                    "SI", "ES", "SE", "GB"
                ]
            },
            line_items: items.map(item => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.productName,
                        images: [item.albumCover]
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity
            })),
            success_url: `${baseUrl}/cart.html?orderId=${orderId}&success=true`,
            cancel_url: `${baseUrl}/cart.html`,
            metadata: {
                orderNumber,
                orderId 
            }
        });

        return res.json({ url: checkoutSession.url });
    } catch (err) {
        console.error("Stripe session error:", err);
        return res.status(500).json({ error: "Failed to create checkout session" });
    }
}
