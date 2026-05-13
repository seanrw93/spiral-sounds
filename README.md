# Spiral Sounds

Spiral Sounds is a fullstack web application for browsing and purchasing vinyl records. Users can explore albums, filter by genre or keyword, manage a shopping cart, checkout via Stripe, and manage their account — including a full token-based password reset flow.

**Live site**: [srw-spiral-sounds.netlify.app](https://srw-spiral-sounds.netlify.app/)

---

## Features

### Frontend
- **Product Display** — Browse vinyl albums with title, artist, price, and genre
- **Search & Filter** — Filter products by keyword or genre in real time
- **Lazy Loading** — Product images load on scroll via `IntersectionObserver`
- **Cart Management** — Add items, adjust quantities, and review your cart with live totals
- **Checkout** — Stripe-powered payment flow
- **User Authentication** — Sign up, log in, and manage your session
- **Account Page** — View your profile details
- **Order History** — Browse all past orders with status and line items
- **Password Reset** — Request a reset link by email; `login.html` conditionally renders the forgot-password form via URL params — no separate page needed
- **Responsive Design** — Mobile-first layout with animated hamburger menu and full-width dropdown nav
- **Mobile Auth Menu** — Hamburger menu shows Log in / Sign up when logged out, and Order History / Account / Log out when logged in — consistent across all pages

### Backend
- **Product API** — Fetch, filter, and search products
- **Auth API** — Register, login, logout, account details, and full password reset flow
- **Cart API** — Per-user cart management (auth-gated)
- **Orders API** — Order history with line items via `json_agg` SQL aggregate (auth-gated)
- **Checkout API** — Stripe session creation and webhook handling
- **Secure Password Reset** — Token-based reset via email (Resend), SHA-256 hashed tokens, 15-minute expiry, single-use enforcement
- **Token Cleanup** — Daily cron job (3am) removes expired and used reset tokens
- **Database** — PostgreSQL for products, users, cart, orders, and password reset tokens

---

## Project Structure

```
spiral_sounds_v2/
├── controllers/
│   ├── authController.js       # Register, login, request reset, reset password
│   ├── cartController.js
│   ├── meController.js         # Account details
│   ├── ordersController.js     # Order history
│   └── productControllers.js
├── cron/
│   └── cleanupTokens.js        # Daily cron to purge expired/used tokens
├── db/
│   └── db.js                   # PostgreSQL connection pool
├── middleware/
│   └── requireAuth.js
├── public/
│   ├── index.html              # Product listing + hero
│   ├── about.html
│   ├── faq.html
│   ├── login.html              # Login + forgot-password (toggled via URL params)
│   ├── signup.html
│   ├── cart.html
│   ├── orders.html             # Order history (auth-gated)
│   ├── account.html            # Account profile (auth-gated)
│   ├── reset-password.html     # Password reset form (linked from email)
│   ├── css/
│   │   └── index.css           # Full design system (CSS custom properties, dark theme)
│   ├── images/
│   └── js/
│       ├── auth/
│       │   ├── login.js
│       │   ├── signup.js
│       │   └── resetPassword.js
│       ├── services/
│       │   ├── cartService.js
│       │   └── productService.js
│       └── ui/
│           ├── accountUI.js
│           ├── authUI.js       # checkAuth, showHideMenuItems, initAuth, initUserMenuDropdown
│           ├── cart.js
│           ├── loginUI.js
│           ├── menu.js         # Mobile menu toggle + renderMobileAuth (injects auth links)
│           ├── ordersUI.js
│           ├── productUI.js
│           └── spinner.js
├── routes/
│   ├── auth.js
│   ├── cart.js
│   ├── checkout.js
│   ├── health.js
│   ├── orders.js
│   ├── products.js
│   └── webhook.js
├── sql/
│   ├── createTable.js
│   ├── deleteUser.js
│   ├── logTable.js
│   └── seedTable.js
├── utils/
├── vite.config.js              # Multi-page Vite config, output to public/dist/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/seanrw93/spiral-sounds.git
cd spiral_sounds_v2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required variables:
```
DATABASE_URL=
SPIRAL_SECRET_SESSION=
RESEND_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLIENT_URL=              # e.g. https://yourdomain.com
NODE_ENV=development
```

### 4. Set up the database

Ensure PostgreSQL is running, then initialise the schema:
```bash
node sql/createTable.js
```

Optionally seed with product data:
```bash
node sql/seedTable.js
```

### 5. Run in development

Start the Express backend and Vite dev server in two terminals:
```bash
# Terminal 1 — Express API on port 8000
npm start

# Terminal 2 — Vite dev server on port 3000 (proxies /api to Express)
npm run dev
```

Open `http://localhost:3000` in your browser.

### 6. Build for production
```bash
npm run build   # outputs to public/dist/
npm start       # Express serves public/dist/ when NODE_ENV=production
```

---

## Password Reset Flow

1. User clicks **"Forgot password?"** on `login.html` — the page switches to the forgot-password form via URL params
2. They submit their email — the server generates a secure random token, hashes it (SHA-256), and stores it in `password_reset_tokens` with a 15-minute expiry
3. An email is sent via **Resend** from `no-reply@spiralsounds.shop` with a link to `reset-password.html?token=<raw_token>`
4. The user submits a new password — the server validates the token (unexpired + unused), prevents password reuse, updates the password, and marks the token as used
5. A **daily cron job** (3am) cleans up all expired and used tokens

---

## Technologies Used

| Layer | Stack |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript (ES Modules) |
| Bundler | Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | bcryptjs, express-session |
| Email | Resend |
| Payments | Stripe |
| Scheduling | node-cron |
| Validation | validator |

---

## License

This project is licensed under the MIT License.
