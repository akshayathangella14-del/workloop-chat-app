# 🚀 WorkLoop — Real-Time Team Collaboration Platform

<div align="center">

### Modern Real-Time Team Collaboration Platform

A professional Slack-inspired realtime collaboration platform built using the **MERN Stack**, **Socket.IO**, **MongoDB Atlas**, **Cloudinary**, and **Redis**.

## ✨ Core Features

| Feature | Description |
|---|---|
| 🏢 Workspaces | Create and manage collaborative team spaces |
| 📢 Channels | Organize conversations by topic |
| 💬 Direct Messages | Private one-to-one communication |
| 🧵 Threads | Keep discussions organized |
| 🔔 Notifications | Realtime alerts and updates |
| 📂 File Sharing | Share files and media instantly |
| ⚡ Realtime Messaging | Instant communication using Socket.IO |
| ⏰ Smart Reminders | Priority-based reminder messaging |

---

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-darkgreen?style=for-the-badge&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?style=for-the-badge&logo=socketdotio)
![Cloudinary](https://img.shields.io/badge/Cloudinary-File%20Storage-blue?style=for-the-badge)

</div>

---

# 🌐 Live Deployment

## Frontend (Vercel)

```txt
https://workloop-realtime-chat.vercel.app
```

## Backend (Render)

```txt
https://workloop-realtime-chat.onrender.com
```

---

# 📖 Project Overview

WorkLoop is a full-stack realtime team collaboration platform inspired by applications like:

- Slack
- Microsoft Teams
- Discord

The application enables users to:

- Create workspaces
- Create channels
- Send realtime messages
- Share files instantly
- Reply in threads
- Receive notifications
- Track online users
- Chat through direct messages
- Set reminder messages with priorities

The entire application is built with scalable architecture and modern realtime communication patterns.

---

# ✨ Core Features

---

# 🔐 Authentication System

### Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Persistent Login
- Logout Functionality
- Role-based Authorization

### Technologies Used

- JWT
- bcryptjs
- Cookies
- Express Middleware

---

# 👥 Workspace System

### Features

- Create Workspaces
- Join Workspaces
- Add Members
- Workspace Roles
- Workspace Sidebar Navigation

### Realtime Support

- Workspace updates
- Member updates

---

# 📢 Channel Messaging

### Features

- Public Channels
- Private Channels
- Realtime Channel Messaging
- Message Notifications
- File Sharing
- Message Reactions

### Realtime Events

```txt
new-channel-message
channel-message-deleted
channel-message-updated
```

---

# 💬 Direct Messaging

### Features

- One-to-one private messaging
- Realtime direct messages
- Presence tracking
- Instant message synchronization

### Realtime Events

```txt
new-direct-message
direct-message-read
```

---

# 🧵 Thread Reply System

### Features

- Reply to specific messages
- Dedicated thread panel
- Nested realtime discussions
- Thread notifications

### Realtime Events

```txt
new-thread-reply
thread-reply-added
```

---

# 📂 File Sharing System

### Features

- Upload Images
- Upload PDFs
- Upload Documents
- Cloudinary Storage
- Realtime File Delivery

### Technologies Used

- Multer
- Cloudinary

---

# 🔔 Notifications System

### Features

- Unread notifications
- Message alerts
- Thread reply alerts
- Reminder alerts
- Realtime notification updates

---

# ⏰ Smart Reminder Messaging (Unique Feature)

One of the unique features of WorkLoop is the:

# ⭐ Priority + Reminder Messaging System

Users can send messages with:

- LOW Priority
- MEDIUM Priority
- HIGH Priority

Users can also schedule reminders.

### Example

```txt
Complete backend deployment before 10 PM.
Priority: HIGH
Reminder Time: 10:00 PM
```

When the reminder time arrives:

✅ Notification is generated  
✅ Reminder appears instantly  
✅ User receives alert

This makes WorkLoop productivity-oriented and useful for teams.

---

# ⚡ Realtime Features

WorkLoop uses **Socket.IO** for realtime communication.

### Implemented realtime systems:

- Channel messages
- Direct messages
- Thread replies
- Notifications
- Reactions
- Online/offline status
- Instant file message delivery

---

# 🟢 Online User Presence System

The application tracks:

- User online status
- Multiple device sessions
- Instant presence updates

Implemented using:

```js
Map<userId, Set<socketIds>>
```

This ensures accurate online/offline handling.

---

# 🛠️ Tech Stack

# Frontend

| Technology | Purpose |
|---|---|
| React | UI Library |
| React Router DOM | Routing |
| Axios | API Calls |
| Socket.IO Client | Realtime Communication |
| Vite | Frontend Build Tool |

---

# Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Socket.IO | Realtime Communication |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Upload |
| Cloudinary | File Storage |
| Redis | Caching / PubSub |

---

# 📁 Project Folder Structure

```txt
WorkLoop/
│
├── backend/
│   ├── APIs/
│   │   ├── AdminAPI.js
│   │   ├── ChannelAPI.js
│   │   ├── CommonAPI.js
│   │   ├── DirectMessageAPI.js
│   │   ├── MessageAPI.js
│   │   ├── NotificationAPI.js
│   │   └── WorkspaceAPI.js
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── cloudinaryUpload.js
│   │   ├── multer.js
│   │   └── redis.js
│   │
│   ├── middlewares/
│   │   └── VerifyToken.js
│   │
│   ├── models/
│   │
│   ├── sockets/
│   │   ├── socket.js
│   │   └── socketEvents.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🧠 Realtime Architecture

### Socket Rooms Used

```txt
channel-channelId
workspace-workspaceId
user-userId
dm-user1-user2
```

### Benefits

- Fast updates
- Scalable communication
- Instant synchronization
- No page refresh required

---

# 🔥 Major Challenges Solved

### Instant Message Rendering

Initially messages appeared only after reopening chats.

✅ Solved using:

- Proper socket listeners
- Global realtime state updates
- Redux Toolkit synchronization

---

### Accurate Online/Offline Status

Initially users appeared offline incorrectly.

✅ Solved using:

```js
Map<userId, Set<socketIds>>
```

This supports multiple active sessions.

---

### Instant File Message Delivery

Initially file messages were delayed.

✅ Solved using realtime socket events after file upload completion.

---

### Realtime Thread Replies

Initially thread replies updated only after reopening threads.

✅ Solved by emitting realtime thread events.

---

# 🗄️ Database Models

Main MongoDB collections:

- users
- workspaces
- channels
- messages
- notifications

Stored data includes:

- User details
- Messages
- Thread replies
- File URLs
- Reactions
- Notifications
- Reminder metadata

---

# ⚙️ Environment Variables

# Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

# Backend `.env`

```env
PORT=5000

DB_URL=your_mongodb_connection_string

SECRET_KEY=your_secret_key

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=your_redis_url
```

---

# 🚀 Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/WorkLoop-Developers/workloop-realtime-chat.git
```

---

# 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 3️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# ☁️ Deployment

# Frontend Deployment

### Platform

- Vercel

### Commands

```bash
npm run build
```

---

# Backend Deployment

### Platform

- Render

### Start Command

```bash
npm start
```

---

# Database

### Platform

- MongoDB Atlas

---

# File Storage

### Platform

- Cloudinary

---

# 📚 What We Learned

Through this project we learned:

- Full-stack development
- Realtime architecture
- Socket.IO communication
- State management
- Authentication systems
- Database design
- File upload systems
- Deployment process
- Team collaboration

---

# 🚀 Future Improvements

Future enhancements planned:

- Voice messages
- Video calling
- Screen sharing
- Typing indicators
- Dark mode
- AI assistant integration
- Message search
- Push notifications

---

# 🎯 Final Conclusion

WorkLoop is a modern realtime collaboration platform that combines:

✅ Realtime messaging  
✅ Thread conversations  
✅ Direct messaging  
✅ Notifications  
✅ File sharing  
✅ Reminder messaging  
✅ Workspace management

The application is designed with scalable architecture and realtime synchronization similar to professional communication platforms like Slack and Discord.

---

<div align="center">

# ⭐ WorkLoop

### Connect • Collaborate • Communicate

</div>
