# Spiral Sounds

Spiral Sounds is a web application designed for managing and browsing a music store. It allows users to view products, filter them by genre or search terms, and manage their shopping cart. The application also includes user authentication and database management features.

## Features

### Frontend
- **Product Display**: Users can browse a list of music albums with details such as title, artist, price, and genre.
- **Search and Filter**: Users can search for products by keywords or filter them by genre.
- **Cart Management**: Users can add products to their cart, view the cart, and manage quantities.
- **User Authentication**: Login and signup functionality for secure access.

### Backend
- **Product Management**: API endpoints to fetch products, filter by genre, and search by keywords.
- **User Management**: API endpoints for user authentication and account management.
- **Cart Management**: API endpoints to manage cart items for authenticated users.
- **Database Integration**: PostgreSQL database for storing products, users, and cart data.

## Project Structure

```
spiral_sounds_v2/
├── controllers/       # Backend controllers for handling API requests
│   ├── authControllers.js
│   ├── meController.js
│   └── productControllers.js
├── data/              # Static data or utility scripts
│   └── data.js
├── db/                # Database connection and configuration
│   └── db.js
├── public/            # Frontend files
│   ├── cart.html
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── css/
│   │   └── index.css
│   ├── images/
│   └── js/
│       ├── authUI.js
│       ├── cart.js
│       ├── cartService.js
│       ├── index.js
│       ├── login.js
│       ├── logout.js
│       ├── menu.js
│       ├── productService.js
│       ├── productUI.js
│       └── signup.js
├── routes/            # Express routes
│   ├── auth.js
│   └── products.js
├── sql/               # SQL scripts for database management
│   ├── createTable.js
│   ├── deleteUser.js
│   ├── logTable.js
│   └── seedTable.js
├── .gitignore         # Git ignore file
├── package.json       # Node.js dependencies and scripts
├── server.js          # Main server file
└── README.md          # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd spiral_sounds_v2
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the database:
   - Ensure PostgreSQL is installed and running.
   - Update the database connection settings in `db/db.js`.
   - Run the `createTable.js` script to initialize the database schema:
     ```bash
     node sql/createTable.js
     ```
   - (Optional) Seed the database with initial data:
     ```bash
     node sql/seedTable.js
     ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open the application in your browser at `http://localhost:3000`.

## Usage

- **Browse Products**: Navigate to the homepage to view available products.
- **Search and Filter**: Use the search bar or genre dropdown to filter products.
- **Manage Cart**: Add products to your cart and adjust quantities.
- **Authentication**: Sign up or log in to access personalized features.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors and open-source libraries used in this project.