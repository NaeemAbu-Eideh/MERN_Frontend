# La3eeb — Tournament Organizer (Frontend)

Frontend for **La3eeb** Tournament Organizer built with **React + Vite**.
Includes authentication (user/admin), tournaments browsing/details, stadiums, user dashboard, admin dashboard, and real-time join request confirmation (Socket.io).

---

## Features
- **Auth UI**: Login / Register (User & Admin)
- **Tournaments**
  - Listing + filters + sorting
  - Tournament details page + AI insights section (optional)
- **Stadiums**
  - Listing + filters (location/status/capacity/facilities)
  - Details view
- **User Dashboard**
  - Stats (pending/approved/rejected/total)
  - Join requests list + statuses + actions
- **Admin Dashboard**
  - Metrics overview
  - Manage: tournaments, matches, stadiums, join requests
- **Real-time**
  - Join request confirmation prompt (Yes/No) via Socket.io (optional)

---

## Tech Stack
- React (Vite)
- React Router DOM
- Axios
- TailwindCSS
- Socket.io-client (optional)

---

## Node Modules Installation (Frontend)

```bash
cd ..

======================Frontend===================

npm create vite@latest
clientside
cd clientside

npm i
npm install axios
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite

will cover later on ->>>
npm install socket.io-client
