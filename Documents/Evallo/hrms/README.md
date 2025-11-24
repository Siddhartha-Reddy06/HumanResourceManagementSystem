# HRMS (Human Resource Management System)

A full-stack HRMS application built with React.js frontend and Node.js/Express.js backend.

## Features

- **Authentication**
  - User login/logout
  - Organization registration
  - JWT-based authentication

- **Employee Management**
  - Add/Edit/Delete employees
  - View employee details
  - Assign employees to teams

- **Team Management**
  - Create/Edit/Delete teams
  - Assign/Remove team members
  - View team details

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- PostgreSQL with Sequelize ORM
- JWT for authentication

## Project Structure

```
hrms/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── seed.js            # Database seeder
│   │   └── index.js           # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                  # Frontend React app
│   ├── public/                # Static files
│   └── src/
│       ├── components/        # Reusable components
│       ├── pages/             # Page components
│       │   ├── Login.jsx
│       │   ├── RegisterOrg.jsx
│       │   ├── Employees.jsx
│       │   └── Teams.jsx
│       ├── services/          # API services
│       ├── App.js             # Main App component
│       └── index.js           # Entry point
│
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_NAME=hrms_db
   JWT_SECRET=your_jwt_secret
   ```

4. Create the database:
   ```bash
   createdb hrms_db
   ```

5. Run migrations and seed the database:
   ```bash
   npx sequelize-cli db:migrate
   node src/seed.js
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Default Credentials

- **Admin User:**
  - Email: admin@acme.test
  - Password: Password123!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new organization
- `POST /api/auth/login` - User login

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create a new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:teamId/assign` - Assign employee to team
- `DELETE /api/teams/:teamId/unassign` - Remove employee from team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

API

- POST /api/auth/register { orgName, adminName, email, password }
- POST /api/auth/login { email, password }
- GET /api/employees (auth)
- GET /api/employees/:id (auth)
- POST /api/employees (auth)
- PUT /api/employees/:id (auth)
- DELETE /api/employees/:id (auth)
- GET /api/teams (auth)
- GET /api/teams/:id (auth)
- POST /api/teams (auth)
- PUT /api/teams/:id (auth)
- DELETE /api/teams/:id (auth)
- POST /api/teams/:teamId/assign { employeeId } or { employeeIds: [] } (auth)
- DELETE /api/teams/:teamId/unassign { employeeId } (auth)
- GET /api/logs (admin only)

Frontend

- Scaffold with create-react-app in hrms/frontend
- Use axios with Authorization header
