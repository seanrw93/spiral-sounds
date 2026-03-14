# Spiral Sounds 🎵

Spiral Sounds is a fullstack web application for browsing and managing a music store. Users can explore albums, filter by genre or keyword, manage a shopping cart, and securely authenticate — including a full token-based password reset flow.

**Live site**: [srw-spiral-sounds.netlify.app](https://srw-spiral-sounds.netlify.app/)

---

## Features

### Frontend
- **Product Display** — Browse music albums with title, artist, price, and genre
- **Search & Filter** — Filter products by keyword or genre
- **Cart Management** — Add items, adjust quantities, and review your cart
- **User Authentication** — Sign up, log in, and manage your account
- **Forgot Password UI** — `login.html` conditionally renders either the login form or the forgot password form based on the `?view=forgot-password` URL search param — no separate page required
- **Password Reset** — Users follow an emailed link to `reset-password.html` to securely set a new password

### Backend
- **Product API** — Fetch, filter, and search products
- **User & Auth API** — Register, login, and full password reset flow
- **Cart API** — Manage cart items for authenticated users
- **Secure Password Reset** — Token-based reset via email (Resend), with SHA-256 hashed tokens, 15-minute expiry, and single-use enforcement
- **Token Cleanup** — Daily cron job removes expired and used reset tokens
- **Database** — PostgreSQL for products, users, cart, and password reset tokens

---

## Project Structure

```
spiral-sounds/
├── controllers/
│   ├── authController.js       # Register, login, request reset, reset password
│   ├── cartController.js
│   ├── meController.js
│   └── productControllers.js
├── cron/
│   └── cleanupTokens.js        # Daily cron job to purge expired/used tokens
├── data/
│   └── data.js
├── db/
│   └── db.js                   # PostgreSQL connection pool
├── middleware/
├── public/
│   ├── index.html
│   ├── login.html              # Renders login or forgot password form via search params
│   ├── signup.html
│   ├── cart.html
│   ├── reset-password.html     # Password reset form (linked from email)
│   ├── css/
│   ├── images/
│   └── js/
│       ├── auth/
│       │   ├── login.js        # Handles login + forgot password form submission
│       │   └── resetPassword.js # Extracts token from URL, submits new password
│       └── ui/
│           └── loginUI.js      # Toggles login/forgot-password UI from search params
├── routes/
│   ├── auth.js
│   ├── cart.js
│   └── products.js
├── sql/
│   ├── createTable.js          # DB schema including password_reset_tokens table
│   ├── deleteUser.js
│   ├── logTable.js
│   └── seedTable.js
├── utils/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/seanrw93/spiral-sounds.git
   cd spiral-sounds
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```
   DATABASE_URL=
   SESSION_SECRET=
   RESEND_SECRET_KEY=
   CLIENT_URL=              # e.g. https://yourdomain.com (used in reset email links)
   NODE_ENV=development
   ```

4. **Set up the database**

   Ensure PostgreSQL is running, then initialise the schema:
   ```bash
   node sql/createTable.js
   ```

   Optionally seed with product data:
   ```bash
   node sql/seedTable.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. Open `http://localhost:8000` in your browser.

---

## Password Reset Flow

1. User clicks **"Forgot password?"** on `login.html?view=forgot-password`
2. They submit their email — the server generates a secure random token, hashes it (SHA-256), and stores it in `password_reset_tokens` with a 15-minute expiry
3. An email is sent via **Resend** from `no-reply@spiralsounds.shop` containing a link to `reset-password.html?token=<raw_token>`
4. The user submits a new password — the server hashes the incoming token, validates it against the DB (unexpired + unused), prevents password reuse, updates the password, and marks the token as used
5. A **daily cron job** (3am) cleans up all expired and used tokens

---

## Technologies Used

| Layer | Stack |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | bcryptjs, express-session |
| Email | Resend |
| Scheduling | node-cron |
| Validation | validator |
| Payments | Stripe |

---

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: describe your change"
   ```
4. Push and open a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## License

This project is licensed under the MIT License.
