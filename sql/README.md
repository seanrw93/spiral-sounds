# SQL Schemas

This directory contains SQL scripts for managing the database schema and data for the project. Below is a description of each file:

## Files

1. **createTable.js**
   - Purpose: Creates the necessary tables in the database.
   - Tables:
     - **products**: Stores product details such as title, artist, price, image, year, genre, and stock.
     - **users**: Stores user information including name, username, email, password, and account creation timestamp.
     - **cart_items**: Tracks items added to user carts, including user ID, product ID, and quantity.
   - Usage: Run this script to initialize the database schema.

2. **deleteUser.js**
   - Purpose: Deletes a user from the database.
   - Usage: Use this script to remove a specific user.

3. **logTable.js**
   - Purpose: Logs database operations or events.
   - Usage: Run this script to log specific database activities.

4. **seedTable.js**
   - Purpose: Seeds the database with initial product data.
   - Usage: Use this script to populate the database with sample product data.

## Usage

To execute any of these scripts, use the following command:

```bash
node sql/<script_name>.js
```

Replace `<script_name>` with the name of the script you want to run.

## Notes

- Ensure the database connection is properly configured in `db/db.js` before running these scripts.
- These scripts are designed to work with the PostgreSQL database used in this project.

### Setting Up PostgreSQL

To set up PostgreSQL for this project, follow these steps:

1. **Install PostgreSQL**:
   - Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).
   - During installation, make note of the username (default: `postgres`) and password you set.

2. **Create the Database**:
   - Open the PostgreSQL shell or a database management tool like pgAdmin.
   - Run the following command to create a new database:
     ```sql
     CREATE DATABASE <db_name>;
     ```

3. **Set Up Environment Variables**:
   - Add the following environment variables to your `.env` file:
     ```env
     DATABASE_URL=postgres://username:password@localhost:5432/db_name
     ```

4. **Run SQL Scripts**:
   - Navigate to the `sql` directory in your terminal:
     ```bash
     cd sql
     ```
   - Execute the scripts in the following order to set up the database schema and seed data:
     ```bash
     psql -U your_username -d spiral_sounds -f createTable.js
     psql -U your_username -d spiral_sounds -f seedTable.js
     ```

5. **Verify the Setup**:
   - Ensure the tables are created and seeded correctly by querying the database:
     ```sql
     \c spiral_sounds
     \dt
     SELECT * FROM your_table_name;
     ```

6. **Start the Application**:
   - Run the application to ensure it connects to the database successfully:
     ```bash
     npm start
     ```