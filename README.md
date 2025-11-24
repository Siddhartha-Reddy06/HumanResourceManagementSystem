HRMS

Backend

- Node.js + Express + Sequelize + PostgreSQL
- JWT auth with bcrypt

Setup

1. Create database:
   createdb hrms_db

2. Configure backend/.env:
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=youruser
   DB_PASS=yourpass
   DB_NAME=hrms_db
   JWT_SECRET=replace_with_a_long_random_secret

3. Install dependencies:
   cd hrms/backend
   npm install

4. Run dev server:
   npm run dev

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
