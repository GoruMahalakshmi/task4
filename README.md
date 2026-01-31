Industrial Automation Monitoring & Control Platform

A full-stack web application that simulates a smart factory environment with:

Real-time monitoring of robots, conveyors, motors, and sensor devices

Role-based machine control (Admin, Engineer, Viewer)

Analytics and predictive maintenance style alerts

Activity logging and audit trail

Features

Real-Time Monitoring Dashboard

Live cards for each machine (robots, conveyors, motors, sensor units)

Shows status (Active / Idle / Error), temperature, efficiency, cycle time

Displays operating mode (Auto / Manual), assigned job, last maintenance

Real-time updates over WebSockets from a sensor simulation engine

Live alert toasts for overheating, vibration anomalies, and low efficiency

Machine Control Interface

Secure control panel for operators and admins

Start / Stop / Reset machine

Change operating mode (Auto / Manual)

Assign job/task to machine

Emergency shutdown (Admin only)

All control actions are logged in the database

Analytics & Predictive Alerts

Production rate per hour (units per machine)

Temperature trend charts

Vibration analysis charts

Conveyor load charts

Robot arm movement charts (J1–J6)

Alerts generated for:

Overheating

Overload / high vibration

Low efficiency

Authentication & Authorization (RBAC)

JWT-based login

Password hashing with bcrypt

Roles:

Admin – full access, manage machines, emergency shutdown

Engineer – can control machines and resolve alerts

Viewer – read-only dashboard and analytics

Protected APIs on the backend

Role-aware navigation and controls on the frontend

Activity logs stored in MongoDB

Backend API

Built with Node.js, Express, MongoDB (Mongoose)

Real-time updates using Socket.io

12+ REST endpoints for machines, control, alerts, analytics, logs, auth

Frontend UI/UX

React-based SPA

Industrial-themed dashboard (dark mode, blue/grey/yellow accents)

Sidebar navigation and top navbar with role badge

Real-time status indicators and alert toasts

Logs table with pagination

Charts built using Chart.js via react-chartjs-2

Tech Stack

Frontend:

React, React Router, Axios

Socket.io client

Chart.js + react-chartjs-2

Backend:

Node.js, Express, Socket.io

MongoDB (Atlas) + Mongoose

JWT (jsonwebtoken)

bcryptjs

Project Structure
c:\industrial-monitoring
├─ backend
│  ├─ server.js
│  ├─ .env
│  └─ src
│     ├─ config
│     ├─ controllers
│     ├─ middleware
│     ├─ models
│     ├─ routes
│     └─ simulator
└─ frontend
   ├─ public
   └─ src
      ├─ api
      ├─ auth
      ├─ components
      ├─ pages
      ├─ styles
      ├─ App.js
      └─ index.js

Backend Setup
1. Prerequisites

Node.js (LTS)

MongoDB Atlas connection string

2. Environment Variables

Create backend/.env:

PORT=5000
MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
JWT_SECRET=<YOUR_JWT_SECRET>


⚠️ Never commit .env to Git. Always use secure secrets.

3. Install Dependencies & Run
cd c:\industrial-monitoring\backend
npm install
npm start


Backend runs at http://localhost:5000

Health check: GET / → Industrial Automation Backend Running 🚀

Automatically creates a super admin account if none exists (password not exposed).

Frontend Setup
cd c:\industrial-monitoring\frontend
npm install
npm start


Frontend runs at http://localhost:3000

Expects backend at http://localhost:5000/api

Default Users / Roles (Secured)

On first startup, a super admin is created. The password is never stored in the README. Set it securely via environment variables or MongoDB directly.

Email: admin@factory.com

Password: <SET_YOUR_OWN_SECURE_PASSWORD>

Role: admin

Other roles:

engineer – can control machines, resolve alerts

viewer – read-only dashboard

Feature Walkthrough

Login & RBAC

Login at http://localhost:3000/

JWT stored in localStorage; attached to API requests.

Sidebar and controls adapt based on role.

Real-Time Dashboard (/dashboard)

Shows live machine data.

WebSocket events for sensorUpdate and machineControl.

Live alert toasts for anomalies.

Control Panel (/control) – Admin/Engineer only

Start, stop, reset, assign jobs, change mode, emergency shutdown.

Actions logged in ActivityLog.

Analytics (/analytics)

Temperature, vibration, conveyor load, production rate, robot joint movement charts.

Logs (/logs)

Shows activity logs: time, user, action, machine

Pagination supported.

Backend API Overview

Base URL: http://localhost:5000/api

Auth:

POST /auth/login

{
  "email": "admin@factory.com",
  "password": "<YOUR_PASSWORD>"
}


Machines, Control, Alerts, Analytics, Logs
All endpoints are role-protected. See the project documentation or Postman collection for details.

Real-Time Simulation

Simulator runs every 5 seconds

Generates randomized sensor readings

Updates machine status, efficiency, cycle time, temperature

Emits alerts for thresholds exceeded

Emits WebSocket events:

sensorUpdate, alert, robotMovement

Postman Collection

Path: docs/postman_collection.json

Use environment variables for token and machineId to avoid exposing credentials.

