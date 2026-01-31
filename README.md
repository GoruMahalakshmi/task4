# Industrial Automation Monitoring & Control Platform

A full-stack web application that simulates a smart factory environment with:

- Real-time monitoring of robots, conveyors, motors, and sensor devices
- Role-based machine control (Admin, Engineer, Viewer)
- Analytics and predictive maintenance style alerts
- Activity logging and audit trail

## Features

- **Real-Time Monitoring Dashboard**
  - Live cards for each machine (robots, conveyors, motors, sensor units)
  - Shows status (Active / Idle / Error), temperature, efficiency, cycle time
  - Displays operating mode (Auto / Manual), assigned job, last maintenance
  - Real-time updates over WebSockets from a sensor simulation engine
  - Live alert toasts for overheating, vibration anomalies, and low efficiency

- **Machine Control Interface**
  - Secure control panel for operators and admins
  - Start / Stop / Reset machine
  - Change operating mode (Auto / Manual)
  - Assign job/task to machine
  - Emergency shutdown (Admin only)
  - All control actions are logged in the database

- **Analytics & Predictive Alerts**
  - Production rate per hour (units per machine)
  - Temperature trend charts
  - Vibration analysis charts
  - Conveyor load charts
  - Robot arm movement charts (J1–J6)
  - Alerts generated for:
    - Overheating
    - Overload / high vibration
    - Low efficiency

- **Authentication & Authorization (RBAC)**
  - JWT-based login
  - Password hashing with bcrypt
  - Roles:
    - **Admin** – full access, manage machines, emergency shutdown
    - **Engineer** – can control machines and resolve alerts
    - **Viewer** – read-only dashboard and analytics
  - Protected APIs on the backend
  - Role-aware navigation and controls on the frontend
  - Activity logs stored in MongoDB

- **Backend API**
  - Built with Node.js, Express, MongoDB (Mongoose)
  - Real-time updates using Socket.io
  - 12+ REST endpoints for machines, control, alerts, analytics, logs, auth

- **Frontend UI/UX**
  - React-based SPA
  - Industrial-themed dashboard (dark mode, blue/grey/yellow accents)
  - Sidebar navigation and top navbar with role badge
  - Real-time status indicators and alert toasts
  - Logs table with pagination
  - Charts built using Chart.js via `react-chartjs-2`

---

## Tech Stack

- **Frontend**
  - React
  - React Router
  - Axios
  - Socket.io client
  - Chart.js + react-chartjs-2

- **Backend**
  - Node.js
  - Express
  - Socket.io
  - MongoDB (Atlas) + Mongoose
  - JWT (jsonwebtoken)
  - bcryptjs

---

## Project Structure

c:\industrial-monitoring
├─ backend
│  ├─ server.js
│  ├─ .env
│  └─ src
│     ├─ config
│     │  ├─ db.js
│     │  └─ createSuperAdmin.js
│     ├─ controllers
│     │  ├─ auth.controller.js
│     │  └─ machine.controller.js
│     ├─ middleware
│     │  ├─ auditMiddleware.js
│     │  ├─ authMiddleware.js
│     │  └─ roleMiddleware.js
│     ├─ models
│     │  ├─ ActivityLog.js
│     │  ├─ Alert.js
│     │  ├─ Machine.js
│     │  ├─ SensorReading.js
│     │  ├─ RobotMovement.js
│     │  └─ User.js
│     ├─ routes
│     │  ├─ alertRoutes.js
│     │  ├─ analyticsRoutes.js
│     │  ├─ authRoutes.js
│     │  ├─ controlRoutes.js
│     │  ├─ logRoutes.js
│     │  └─ machineRoutes.js
│     └─ simulator
│        └─ sensorSimulator.js
└─ frontend
   ├─ public
   └─ src
      ├─ api
      │  └─ api.js
      ├─ auth
      │  └─ ProtectedRoute.js
      ├─ components
      │  ├─ AlertToast.js
      │  ├─ MachineCard.js
      │  ├─ Navbar.js
      │  ├─ Sidebar.js
      │  └─ StatusBadge.js
      ├─ pages
      │  ├─ Analytics.js
      │  ├─ ControlPanel.js
      │  ├─ Dashboard.js
      │  ├─ Login.js
      │  ├─ Logs.js
      │  └─ Machines.js
      ├─ styles
      │  └─ theme.css
      ├─ App.js
      ├─ config.js
      └─ index.js

## Backend Setup

### 1. Prerequisites

- Node.js (LTS)
- MongoDB Atlas connection string

### 2. Environment Variables

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=supersecretkey


> In this project, `MONGO_URI` is already configured to point to an Atlas database.  
> Replace it with your own if needed.

### 3. Install Dependencies and Run

From `c:\industrial-monitoring\backend`:

```bash
npm install
npm start
```

Backend will start at `http://localhost:5000`.

Health check:

- `GET http://localhost:5000/` → `Industrial Automation Backend Running 🚀`

On startup:

- Connects to MongoDB.
- Automatically creates a super admin user if it does not exist.

---

## Frontend Setup

From `c:\industrial-monitoring\frontend`:

```bash
npm install
npm start
```

Frontend will run at:

- `http://localhost:3000`

The React app expects the backend at `http://localhost:5000/api` (`src/api/api.js`).

---

## Default Users / Roles

On first backend startup, a super admin is created:

- Email: `admin@factory.com`
- Password: `Admin@123`
- Role: `admin`

You can create additional users (engineer, viewer) directly via MongoDB:

- `role: "engineer"` – can control machines, resolve alerts.
- `role: "viewer"` – read-only dashboard and analytics.

---

## Feature Walkthrough

### 1. Login & RBAC

- Navigate to `http://localhost:3000/`.
- Log in using the admin credentials above.
- After login:
  - JWT is stored in `localStorage`.
  - The frontend attaches `Authorization: Bearer <token>` to all API calls.
  - The navbar shows your current role.
  - The sidebar hides certain links for `viewer` users.
 - Registration is available at `http://localhost:3000/register` (creates `viewer` role).
 - Admins can promote users at `http://localhost:3000/admin`.

### 2. Real-Time Dashboard

Route: `/dashboard`

- Shows a grid of cards, one per machine:
  - Name, type
  - Status: **Active / Idle / Error**
  - Temperature (live)
  - Efficiency (%)
  - Cycle time
  - Operating mode (Auto/Manual)
  - Assigned job
  - Last maintenance
- Data source:
  - REST: `/api/machines`
  - WebSockets:
    - `sensorUpdate` events from the backend simulator push live sensor values.
    - `machineControl` events push control status changes.
- Alerts:
  - Overheating, vibration anomaly, low efficiency
  - Rendered as colored toast notifications on the dashboard.

### 3. Control Panel

Route: `/control` (Admin/Engineer only)

- Select a machine from the dropdown.
- Actions:
  - Start machine
  - Stop machine
  - Reset machine (reset efficiency, cycle time, job)
  - Change mode (Auto/Manual)
  - Assign job/task
  - Emergency shutdown (Admin only)
- All actions call secure control endpoints with RBAC enforced.
- Every action is logged into `ActivityLog` and visible in the Logs page.

### 4. Analytics

Route: `/analytics`

Visualizations (Chart.js):

- **Temperature trend** – `/api/analytics/temperature`
- **Vibration analysis** – `/api/analytics/vibration`
- **Conveyor load** – `/api/analytics/conveyor-load`
- **Production rate per hour** – `/api/analytics/production`
- **Robot movement (J1–J6)** – `/api/analytics/robot-movement`

The page periodically refreshes analytics data to simulate live reporting.

### 5. Logs

Route: `/logs`

- Table listing activity logs:
  - Time
  - User ID
  - Action performed
  - Machine ID
- Pagination (client-side):
  - 10 logs per page
  - Previous / Next controls

---

## Backend API Overview

Base URL:

- `http://localhost:5000/api`

### Auth

- `POST /auth/login`  
  Request body:
  ```json
  { "email": "admin@factory.com", "password": "Admin@123" }
  ```

### Machines

- `GET /machines` – List all machines
- `GET /machines/:id` – Machine details
- `POST /machines` – Create machine (Admin only)
- `PUT /machines/:id` – Update machine

### Control

- `POST /control/:id/start`
- `POST /control/:id/stop`
- `POST /control/:id/reset`
- `POST /control/:id/mode` – body `{ "mode": "Auto" | "Manual" }`
- `POST /control/:id/job` – body `{ "job": "Job name" }`
- `POST /control/:id/emergency` – Admin only

### Alerts

- `GET /alerts` – Recent alerts (latest 50)
- `GET /alerts/unresolved` – Unresolved alerts
- `PATCH /alerts/:id/resolve` – Mark alert as resolved (Engineer+)

### Analytics

- `GET /analytics/temperature`
- `GET /analytics/vibration`
- `GET /analytics/conveyor-load`
- `GET /analytics/production`
- `GET /analytics/robot-movement`

### Logs

- `GET /logs` – Activity logs sorted by newest first

---

## Real-Time Simulation

- A simulator runs every 5 seconds and:
  - Generates randomized sensor readings per machine.
  - Writes `SensorReading` documents.
  - Updates machine status, efficiency, cycle time, temperature.
  - Creates alerts when thresholds are exceeded.
-  Emits:
    - `sensorUpdate` WebSocket events with live metrics.
    - `alert` events for new alerts.
    - `robotMovement` events for robot joints J1–J6 (robots only)

This simulates a real industrial environment with fluctuating loads and conditions.

---

## Postman Collection

Import the collection located at:

`c:\industrial-monitoring\docs\postman_collection.json`

After importing:
- Set `token` variable to the JWT returned by `POST /api/auth/login`.
- Set `machineId` to any ID from `GET /api/machines`.
- Run the requests to verify responses.

Included requests:
- Auth: Login, Register, Promote, Users
- Machines: List, By ID
- Control: Start, Emergency
- Alerts: List, Unresolved
- Logs: List
- Analytics: Temperature, Vibration, Conveyor Load, Production, Robot Movement

---

## Demo Video Suggestions

For the submission demo (3–5 minutes):

1. Show login and roles.
2. Demonstrate live dashboard with sensor updates and alerts.
3. Perform control actions and show logs updating.
4. Walk through analytics charts and explain how they simulate predictive maintenance.
5. Show RBAC by logging in as different roles (admin/engineer/viewer).
