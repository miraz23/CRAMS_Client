# CRAMS

## Overview

### CRAMS_Client

Frontend: https://crams-client.vercel.app/
Frontend Repository: https://github.com/miraz23/CRAMS_Client

The client is built with React, Vite, Tailwind CSS, React Router, and Axios. It provides UI flows for:

- Home, Login, Register
- Dashboard views for students, advisors, admins, and super admins
- Admin course management, section management, instructor assignment, and schedule setup
- Student course selection, schedule overview, and registration status
- Advisor approval workflows for course registrations and extra credit requests
- User management and system settings for admin roles
- Shared layout components such as header, footer, loader, notification modal

Key files:

- `src/main.jsx` - application entry point
- `src/App.jsx` - top-level router and layout
- `src/router/router.jsx` - route definitions
- `src/config/api.js` - API base URL for backend requests
- `src/hooks` - custom hooks such as authentication and secure Axios
- `src/pages` - page-level components for Home, Login, Register, Dashboard, roles, and utilities
- `src/pages/Dashboard/Admin/CourseManagement/CourseManagement.jsx` - course management UI with instructor assignment and section mapping
- `src/pages/Dashboard/Admin/SectionManagement/SectionManagement.jsx` - section management UI including advisor assignment, capacity, and scheduling inputs

### CRAMS_Server

The server is built with Express and MongoDB (Mongoose). It exposes API routes for admin, student, and teacher functionality.

Backend API: https://crams-server.vercel.app/
Backend Repository: https://github.com/miraz23/CRAMS_Server

Key files:

- `server.js` - app setup, middleware, routers, and error handling
- `config/db.js` - MongoDB connection helper
- `routes/` - `adminRouter.js`, `studentRouter.js`, `teacherRouter.js`
- `controllers/` - controller logic for admin, advisor, student, teacher, course registration, and extra credit requests
- `models/` - Mongoose schemas for users, courses, sections, registrations, and appointments
- `middleware/` - authentication, error handling, file upload, and async helpers
- `CRAMS_Server/10.Crams.postman_collection.json` - sample API request collection for course management, section management, and user workflows

## Features

The current CRAMS implementation includes:

- Role-based dashboards for students, advisors, admins, and super admins
- Secure login/logout and session handling with JWTs
- Admin course management with CRUD operations, instructor assignment, and section mapping
- Admin section management with section creation, advisor assignment, capacity control, and course schedule updates
- Student course selection and submission for advisor approval
- Advisor approval workflows for selected courses and extra credit requests
- User management and system settings for admin users

## Documentation and Project References

Additional documentation is available in the client and server repository:

### Server Documentation (`CRAMS_Server`)

- `CRAMS_Server/9.Test Cases & Testing_Report.pdf` - authentication, role flows, and feature test cases including student, advisor, admin, and super admin login tests
- `CRAMS_Server/10.Crams.postman_collection.json` - Postman collection containing API requests for backend endpoint testing and validation
- `CRAMS_Server/5. UML Diagram` - system design diagrams representing classes, interactions, and overall software structure
- `CRAMS_Server/6. ER Diagram` - database entity relationships, attributes, and data modeling structure
- `CRAMS_Server/7.Process Model Justification Report_ CRAMS.pdf` - development process justification, technical context, and project approach

### Client Documentation (`CRAMS_Client`)

- `CRAMS_Client/4.SRS_document_crams.pdf` - functional and non-functional requirements of the system
- `CRAMS_Client/8.Prototype_crams.pdf` - UI prototype and design reference
- `CRAMS_Client/7.Process Model Justification Report_ CRAMS.pdf` - project development process details and methodology
- `CRAMS_Client/12.Ethical Reflection and Quality Considerations Report_ CRAMS.pdf` - quality assurance practices, ethical considerations, and software quality evaluation

## Prerequisites

- Node.js installed
- npm installed
- MongoDB connection configured in `CRAMS_Server/.env`

## Setup

### 1. Backend

```bash
cd CRAMS_Server
npm install
```

Create or verify `CRAMS_Server/.env` has the required values:

```env
JWT_SECRET=crams@2025
JWT_EXPIRE=1d
COOKIE_EXPIRE=7
DB_URI=<your MongoDB connection string>
CLOUDINARY_CLOUD_NAME=<cloudinary name>
CLOUDINARY_API_KEY=<cloudinary api key>
CLOUDINARY_API_SECRET=<cloudinary api secret>
```

Start the backend server:

```bash
npm run dev
```

The backend listens on port `5000` by default.

### 2. Frontend

```bash
cd CRAMS_Client
npm install
```

Verify `CRAMS_Client/.env.development` or create one with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The React app typically runs on `http://localhost:5173`.

## API Endpoints

The backend exposes:

- `GET /` - health check
- `POST /api/student/...` - student routes
- `POST /api/teacher/...` - teacher/advisor routes
- `POST /api/admin/...` - admin routes

Refer to route files in `CRAMS_Server/routes/` for full details.

## Login Credentials

Use the following credentials to sign in to the application:

- Student: `C231197` / `crams@2025`
- Advisor: `jamil_cse@iiuc.ac.bd` / `crams@2025`
- Admin: `jamal_cse@iiuc.ac.bd` / `crams@2025`
- Super Admin: `superadmin@gmail.com` / `superadmin@2025`

## Notes

- The frontend depends on the backend API base URL configured in `CRAMS_Client/src/config/api.js`.
- The backend uses environment variables for authentication and database connection.
- If you deploy to production, update the CORS and environment settings appropriately.
