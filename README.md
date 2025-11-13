# Frontend-Backend Project 

A **full-stack project** built with **React.js** (frontend) and **Node.js + MongoDB Atlas** (backend).  
Includes user registration, login with Gmail validation, JWT authentication, and CRUD operations for items.

---

## Features 

- User Registration and Login
- Gmail validation for registration
- JWT-based authentication
- CRUD operations for items
- Responsive frontend design
- Local storage token management

---

## Technologies & Libraries 

### Frontend
- React.js
- Axios
- CSS (custom styling)

**Installed libraries**
npm install axios react react-dom
**Backend**
-Node.js (HTTP module)
-bcryptjs (password hashing)
-jsonwebtoken (JWT authentication)
-mongoose (MongoDB ORM)
-cors (cross-origin requests)

**Installed libraries:**
npm install bcryptjs jsonwebtoken mongoose cors

**Setup Instructions **
1. Clone the Repository
git clone https://github.com/NavyaKacharla/frontend-backend-project.git
cd frontend-backend-project
2. Frontend Setup
cd frontend
npm install        # Install dependencies
npm start          # Starts frontend at http://localhost:3000
3. Backend Setup
cd backend
npm install        # Install dependencies
node server.js     # Starts backend at http://localhost:5000
Backend API Endpoints 
Endpoint	Method	Description
/register	POST	Register a new user
/login	POST	Login user and get JWT token
/items	POST	Add a new item
/items	GET	Get all items
/items?id=<item_id>	PUT	Update an existing item
/items?id=<item_id>	DELETE	Delete an item

Usage:
Open frontend in browser: http://localhost:3000

Register a new Gmail user

Login using your Gmail credentials

Access the dashboard to add, update, or delete items

Notes:
Ensure MongoDB Atlas is running and the connection string in server.js is correct.

JWT token is stored in localStorage for authentication.

Frontend runs on localhost:3000, backend runs on localhost:5000.
