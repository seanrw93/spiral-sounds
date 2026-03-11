# Spiral Sounds

Full-stack e-commerce application for purchasing vinyl records.

The project implements a custom backend with secure authentication, cart management, Stripe payments, and PostgreSQL order storage.

Originally built as a prototype using SQLite, the application has now been upgraded to a production-ready architecture using PostgreSQL and Stripe Checkout.

---

## Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express

**Database**
- PostgreSQL (Render)

**Payments**
- Stripe Checkout
- Stripe Webhooks

---

## Features

- User authentication with sessions and HTTPOnly cookies
- Shopping cart functionality
- Product catalog
- Secure Stripe Checkout integration
- PostgreSQL order management
- Webhook-based payment confirmation
- Dynamic order success page

---

## Project Structure

```
spiral_sounds/
┣ controllers/
┃ ┣ authController.js
┃ ┣ cartController.js
┃ ┣ checkoutController.js
┃ ┣ healthController.js
┃ ┣ meController.js
┃ ┣ ordersController.js
┃ ┣ productController.js
┃ ┗ webhookController.js
┣ data/
┃ ┗ data.js
┣ db/
┃ ┗ db.js
┣ middleware/
┃ ┗ requireAuth.js
┣ node_modules/
┣ public/
┃ ┣ css/
┃ ┃ ┗ index.css
┃ ┣ images/
┃ ┃ ┣ cart.png
┃ ┃ ┗ menu.svg
┃ ┣ js/
┃ ┃ ┣ auth/
┃ ┃ ┃ ┣ login.js
┃ ┃ ┃ ┣ logout.js
┃ ┃ ┃ ┗ signup.js
┃ ┃ ┣ config/
┃ ┃ ┃ ┗ config.js
┃ ┃ ┣ services/
┃ ┃ ┃ ┣ cartService.js
┃ ┃ ┃ ┣ checkoutService.js
┃ ┃ ┃ ┣ orderService.js
┃ ┃ ┃ ┗ productService.js
┃ ┃ ┣ ui/
┃ ┃ ┃ ┣ authUI.js
┃ ┃ ┃ ┣ cart.js
┃ ┃ ┃ ┣ menu.js
┃ ┃ ┃ ┣ orderUI.js
┃ ┃ ┃ ┣ productUI.js
┃ ┃ ┃ ┗ spinner.js
┃ ┃ ┣ debouncer.js
┃ ┃ ┗ index.js
┃ ┣ cart.html
┃ ┣ index.html
┃ ┣ login.html
┃ ┗ signup.html
┣ routes/
┃ ┣ auth.js
┃ ┣ cart.js
┃ ┣ checkout.js
┃ ┣ health.js
┃ ┣ orders.js
┃ ┣ products.js
┃ ┗ webhook.js
┣ sql/
┃ ┣ createTable.js
┃ ┣ deleteUser.js
┃ ┣ logTable.js
┃ ┣ README.md
┃ ┗ seedTable.js
┣ utils/
┃ ┗ orderNumber.js
┣ .env
┣ .env.example
┣ .gitignore
┣ database.db
┣ package-lock.json
┣ package.json
┣ README.md
┗ server.js
```

---

## Database Migration

The project migrated from **SQLite** to **PostgreSQL** to support production deployment.

Reasons for migration:

- Better concurrency
- Production reliability
- Render cloud compatibility
- Reliable Stripe webhook processing

Database connection uses:

```
process.env.DATABASE_URL
```

SSL is enabled for Render PostgreSQL.

---

## Database Schema

### Products Table

```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  artist VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  year INTEGER,
  genre VARCHAR(100),
  stock INTEGER
);
```

### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Cart Items Table

```sql
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Orders Table

```sql
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending',
  order_number VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  billing_line1 TEXT,
  billing_line2 TEXT,
  billing_city TEXT,
  billing_postal_code TEXT,
  billing_country TEXT,
  shipping_line1 TEXT,
  shipping_line2 TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table

```sql
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## Stripe Checkout Integration

> ⚠️ **Testing only.** The Stripe Checkout integration is currently configured for test mode. No real payments will be processed. To simulate payments, refer to the [Stripe Testing documentation](https://docs.stripe.com/testing).

The application uses **Stripe Checkout** for secure payment processing.

Checkout flow:

1. User proceeds to checkout from the cart
2. Backend creates a Stripe Checkout session
3. Order is created in PostgreSQL with status `pending`
4. User is redirected to Stripe Checkout
5. Stripe processes the payment
6. Stripe webhook updates the order status

---

## Checkout Endpoint

```
POST /api/create-checkout-session
```

Responsibilities:

- Validates cart data
- Creates order in PostgreSQL
- Generates Stripe checkout session
- Redirects user to Stripe payment page

Redirects:

```
success_url: /success.html?orderId={ORDER_ID}
cancel_url:  /cart.html
```

---

## Stripe Webhooks

Stripe webhooks confirm the payment securely.

Endpoint:

```
POST /api/stripe/webhook
```

Events handled:

- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Webhook responsibilities:

- Verify Stripe signature
- Update order status
- Store billing and shipping details
- Ensure only Stripe can confirm payments

---

## Success Page

The success page displays order confirmation after payment.

Behavior:

- Reads `orderId` from URL parameters
- Fetches order data from backend

```
GET /api/orders/:id
```

- Displays payment confirmation and order details
- Prevents cart logic from executing on success page

---

## Environment Variables

```env
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SESSION_SECRET=
```

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start backend server:

```bash
npm run dev
```

The server will start on:

```
http://localhost:8000
```

---

## Future Improvements

- React frontend
- Admin product dashboard
- Order history for users
- Inventory management
- Email order confirmations

---

## License

MIT
