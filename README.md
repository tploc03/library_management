# Library Management System

A full-stack web application for managing a library, including books, authors, genres, readers, and the complete borrowing/returning workflow. This project is built with a modern tech stack featuring FastAPI for the backend and Next.js for the frontend.

<!-- Add a screenshot of your application here -->

![Application Screenshot](image.png)

## ✨ Features

- **Comprehensive Management:** Full CRUD (Create, Read, Update, Delete) functionality for Books, Authors, Genres, and Readers.
- **User Authentication:** Secure user registration and login system using JWT.
- **Borrowing & Returning System:**
  - Create detailed borrow slips for readers.
  - Process book returns and update inventory automatically.
- **Advanced Database Integration:**
  - **MySQL Function:** To check real-time book availability.
  - **MySQL Trigger:** To automatically calculate late fees upon return.
  - **MySQL Stored Procedure:** To fetch a list of all unreturned borrow slips.
- **Reporting & Exporting:**
  - **Print to PDF:** Generate a printable PDF for any borrow slip.
  - **Export to CSV:** Export data for Books, Authors, Genres, and Readers for reporting and analysis.

## 🚀 Tech Stack

| Area         | Technology                                 |
| ------------ | ------------------------------------------ |
| **Backend**  | Python, FastAPI, SQLAlchemy, Pydantic, JWT |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS   |
| **Database** | MySQL                                      |

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Python](https://www.python.org/) (v3.10 or newer)
- A running [MySQL](https://www.mysql.com/) server

### 1. Database Setup

1.  Connect to your MySQL server using a client like DBeaver or MySQL Workbench.
2.  Create the database:
    ```sql
    CREATE DATABASE thu_vien_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
3.  Execute the following SQL files in order against the `thu_vien_db` database:
    1.  `schema.sql`
    2.  `functions.sql`
    3.  `procedures.sql`
    4.  `triggers.sql`

### 2. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
# On Windows
.\venv\Scripts\Activate
# On macOS/Linux
# source venv/bin/activate

# 3. Install the required packages
pip install -r requirements.txt

# 4. Create a .env file in the 'backend' directory
#    and add your database connection string and a secret key.
#    (See .env.example for a template)
#    Example .env file:
#    DATABASE_URL="mysql://user:password@localhost/thu_vien_db"
#    SECRET_KEY="your-super-secret-key"

# 5. Run the development server
uvicorn app.main:app --reload

The backend API will be available at http://127.0.0.1:8000.

3. Frontend Setup
# 1. Navigate to the frontend directory in a new terminal
cd frontend

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

The frontend application will be available at http://localhost:3000.

This project was developed as a comprehensive university assignment, demonstrating skills in full-stack development and advanced database features.
```
