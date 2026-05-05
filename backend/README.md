# Real-Time Chat Application Backend Documentation

## 1. Project Introduction

This backend is built for a Real-Time Chat Application, similar to a simple Slack clone.

The main idea is that users can create workspaces, create channels inside those workspaces, chat with teammates, send direct messages, share files, react to messages, edit messages, reply in threads, receive notifications, and use a unique priority/reminder feature for important messages.

We followed a simple blog-style backend structure:

- API files contain routes and logic together.
- No controllers folder.
- No services folder.
- Models are separate.
- Middleware is simple.
- Response format is consistent.
- Code is beginner-friendly and easy to explain.

## 2. Main Features

The backend supports:

- User authentication
- Workspaces
- Channels
- Direct messages
- File sharing
- Message reactions
- Message editing
- Thread replies
- Notifications
- Socket.io real-time updates
- Redis basic online-user structure
- Smart Priority + Reminder Messaging System

## 3. Unique Feature: Smart Priority + Reminder Messaging System

This is the special feature added to our chat app.

In normal chat apps, users can send messages. In our app, users can also mark messages as important using priority and reminder time.

Each message can have:

- `priority`: `LOW`, `MEDIUM`, or `HIGH`
- `reminderTime`: optional future date and time

Example:

```txt
Message: We must complete the frontend tomorrow.
Priority: HIGH
Reminder Time: 2026-05-06 10:00 AM
```

When this message is saved, the backend stores the priority and reminder time with the message.

If reminder time exists, the backend uses a simple `setTimeout`. When that time comes, it creates a reminder notification for the sender.

This means the user can say:

```txt
Remind me later about this important message.
```

This feature is simple, practical, and does not use any external scheduler library.

Important note:

Because this uses basic `setTimeout`, reminders work while the server is running. If the server restarts before the reminder time, the scheduled timeout is lost. This is acceptable for our beginner-friendly version.

## 4. Tech Stack

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- Redis
- JWT
- bcryptjs
- Multer
- Cloudinary
- dotenv
- cors
- cookie-parser

Frontend:

- React

The backend provides REST APIs and Socket.io events for the frontend.

## 5. Backend Folder Structure

```txt
backend/
  server.js
  package.json
  package-lock.json
  .env
  README.md

  APIs/
    CommonAPI.js
    WorkspaceAPI.js
    ChannelAPI.js
    DirectMessageAPI.js
    MessageAPI.js
    NotificationAPI.js

  models/
    UserModel.js
    WorkspaceModel.js
    ChannelModel.js
    MessageModel.js
    NotificationModel.js

  middlewares/
    VerifyToken.js

  config/
    cloudinary.js
    cloudinaryUpload.js
    multer.js
    redis.js

  sockets/
    socket.js
    socketEvents.js

  user-req.http
  workspace-req.http
  channel-req.http
  message-req.http
```

## 6. Architecture Style

This backend follows a simple Express style.

Each API file exports one router:

```js
export const messageApp = exp.Router();
```

Each API file contains:

- Route
- Validation/checks
- Database logic
- Response

We did not create controllers or services because we wanted to keep the structure consistent with the blog app backend.

## 7. Response Format

Success:

```json
{
  "message": "Success message",
  "payload": {}
}
```

Error:

```json
{
  "message": "Error message",
  "error": "Error details"
}
```

## 8. Environment Variables

The `.env` file stores private project configuration.

```env
PORT=5000
DB_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

REDIS_URL=redis://localhost:6379
```

Never share real `.env` values publicly.

## 9. server.js Explanation

`server.js` is the starting point of the backend.

It does:

1. Loads environment variables.
2. Creates Express app.
3. Creates HTTP server for Socket.io.
4. Applies CORS.
5. Applies JSON body parser.
6. Applies cookie parser.
7. Connects all API routers.
8. Connects MongoDB.
9. Connects Redis if enabled.
10. Initializes Socket.io.
11. Starts server.
12. Handles invalid paths.
13. Handles backend errors.

Path-level APIs:

```js
app.use("/auth", commonApp);
app.use("/workspace-api", workspaceApp);
app.use("/channel-api", channelApp);
app.use("/dm-api", directMessageApp);
app.use("/message-api", messageApp);
app.use("/notification-api", notificationApp);
```

Socket.io needs an HTTP server, so we use:

```js
const httpServer = createServer(app);
```

## 10. Models Explanation

### UserModel.js

Stores user information.

Main fields:

- `firstName`
- `lastName`
- `email`
- `password`
- `role`
- `profileImageUrl`
- `workspaces`
- `isUserActive`

Users can login, join workspaces, send messages, react, reply, and receive notifications.

### WorkspaceModel.js

Stores workspaces.

Main fields:

- `workspaceName`
- `description`
- `owner`
- `members`
- `isWorkspaceActive`

A workspace is like the main team/company space.

Each member has:

- `user`
- `role`
- `joinedAt`

Workspace roles:

- `OWNER`
- `ADMIN`
- `MEMBER`

### ChannelModel.js

Stores channels inside workspaces.

Main fields:

- `workspace`
- `channelName`
- `description`
- `channelType`
- `createdBy`
- `members`
- `isChannelActive`

Channel types:

- `PUBLIC`
- `PRIVATE`

### MessageModel.js

Stores all chat messages.

This model handles:

- Channel messages
- Direct messages
- File messages
- Reactions
- Thread replies
- Edited messages
- Priority messages
- Reminder messages

Main fields:

- `workspace`
- `channel`
- `sender`
- `receiver`
- `messageType`
- `content`
- `priority`
- `reminderTime`
- `file`
- `reactions`
- `threadReplies`
- `isEdited`
- `isMessageActive`

Message types:

- `CHANNEL`
- `DIRECT`

Priority values:

- `LOW`
- `MEDIUM`
- `HIGH`

The default priority is `LOW`.

### NotificationModel.js

Stores notifications.

Main fields:

- `user`
- `workspace`
- `channel`
- `message`
- `notificationType`
- `text`
- `isRead`

Notification types:

- `MESSAGE`
- `REACTION`
- `THREAD_REPLY`
- `REMINDER`

`REMINDER` is used by the new priority/reminder feature.

## 11. Middleware Explanation

### VerifyToken.js

This middleware protects private routes.

It does:

1. Reads token from cookie or Authorization header.
2. Verifies JWT token.
3. Finds user in MongoDB.
4. Checks if user is active.
5. Checks allowed roles.
6. Stores decoded user data in `req.user`.
7. Allows route to continue.

Authorization format:

```txt
Authorization: Bearer token_here
```

## 12. Config Folder Explanation

### cloudinary.js

Connects backend to Cloudinary.

### cloudinaryUpload.js

Uploads file buffer to Cloudinary and returns file URL.

### multer.js

Receives uploaded files from request.

### redis.js

Creates Redis client for online-user structure.

If Redis is not running, main backend can still work if Redis connection is safely handled.

## 13. API Files Explanation

### CommonAPI.js

Handles authentication.

Routes:

```txt
POST /auth/users
POST /auth/login
GET  /auth/logout
GET  /auth/check-auth
PUT  /auth/password
```

Purpose:

- Register user
- Login user
- Logout user
- Check logged-in user
- Change password

### WorkspaceAPI.js

Handles workspace operations.

Routes:

```txt
POST  /workspace-api/workspaces
GET   /workspace-api/workspaces
GET   /workspace-api/workspace/:id
PUT   /workspace-api/workspace/member
PATCH /workspace-api/workspace/status
```

Purpose:

- Create workspace
- Fetch user's workspaces
- Get one workspace
- Add member
- Soft delete or restore workspace

### ChannelAPI.js

Handles channels.

Routes:

```txt
POST  /channel-api/channels
GET   /channel-api/channels/:workspaceId
GET   /channel-api/channel/:id
PUT   /channel-api/channel/member
PATCH /channel-api/channel/leave
PATCH /channel-api/channel/status
```

Purpose:

- Create channel
- Get workspace channels
- Get one channel
- Add member to channel
- Leave channel
- Soft delete or restore channel

### DirectMessageAPI.js

Handles direct message fetching.

Routes:

```txt
GET /dm-api/users/:workspaceId
GET /dm-api/messages/:workspaceId/:receiverId
GET /dm-api/conversations/:workspaceId
```

Purpose:

- Get workspace users for direct message
- Get direct messages with one user
- Get recent direct message conversations

### MessageAPI.js

Handles main message features.

Routes:

```txt
POST  /message-api/channel-message
POST  /message-api/direct-message
POST  /message-api/file-message
GET   /message-api/channel-messages/:channelId
PUT   /message-api/message
PUT   /message-api/message/reaction
PATCH /message-api/message/reaction
PUT   /message-api/message/thread
GET   /message-api/message/thread/:messageId
PATCH /message-api/message/status
GET   /message-api/reminders
```

Purpose:

- Send channel message
- Send direct message
- Send file message
- Get channel messages
- Edit own message
- Add/update reaction
- Remove reaction
- Add thread reply
- Get thread replies
- Soft delete/restore message
- Get upcoming reminders

New reminder route:

```txt
GET /message-api/reminders
```

This fetches upcoming reminder messages for the logged-in user.

### NotificationAPI.js

Handles notifications.

Routes:

```txt
GET   /notification-api/notifications
PATCH /notification-api/notification/read
PATCH /notification-api/notifications/read
```

Purpose:

- Get notifications
- Mark one notification as read
- Mark all notifications as read

## 14. Socket.io Explanation

Socket files:

```txt
sockets/
  socket.js
  socketEvents.js
```

### socket.js

Initializes Socket.io and authenticates socket users.

It:

- Reads token
- Verifies user
- Joins user room
- Tracks online user if Redis is running
- Registers socket events

### socketEvents.js

Handles real-time events:

```txt
join-workspace
join-channel
join-direct-message
send-message
edit-message
add-reaction
remove-reaction
thread-reply
file-shared
```

Room examples:

```txt
user-userId
workspace-workspaceId
channel-channelId
dm-userId1-userId2
```

## 15. Main Project Flow

### Register Flow

User registers with name, email, password, role, and optional profile image.

Password is hashed before saving.

### Login Flow

User logs in with email and password.

Backend returns JWT token.

Frontend sends that token in protected requests.

### Workspace Flow

User creates workspace.

That user becomes owner.

Owner can add existing registered users.

### Channel Flow

Workspace members create channels.

Users chat inside public or private channels.

### Direct Message Flow

One workspace member can privately message another workspace member.

When direct message is sent, receiver gets a notification.

### File Sharing Flow

File is uploaded through Multer.

Cloudinary stores the actual file.

MongoDB stores the file URL and file details.

### Reaction Flow

User can react to a message.

If the same user reacts again, the old reaction is updated.

### Thread Reply Flow

Users can reply under a specific message.

Thread replies are stored inside the parent message.

### Priority + Reminder Flow

User sends a message with priority and optional reminder time.

Backend saves:

- Message content
- Priority
- Reminder time

If reminder time exists:

1. Backend calculates delay.
2. `setTimeout` waits until reminder time.
3. Backend creates notification for the message sender.
4. User can fetch notification from notifications API.

## 16. Testing Order

Use `.http` files in this order:

### user-req.http

Test:

- Register
- Login
- Check auth
- Change password
- Logout

### workspace-req.http

Test:

- Create workspace
- Get workspaces
- Add member

### channel-req.http

Test:

- Create channel
- Get channels
- Add channel member

### message-req.http

Test:

- Send channel message
- Send direct message
- Send file message
- Edit message
- Add reaction
- Add thread reply
- Send priority/reminder message
- Get upcoming reminders
- Get notifications

## 17. Testing Priority + Reminder Feature

Send a channel message with priority and reminder:

```http
### Send Channel Message With Priority And Reminder
POST http://localhost:5000/message-api/channel-message
Content-Type: application/json
Authorization: Bearer token_here

{
  "workspace": "workspace_id_here",
  "channel": "channel_id_here",
  "content": "We must complete the frontend tomorrow",
  "priority": "HIGH",
  "reminderTime": "2026-05-06T10:00:00.000Z"
}
```

Get upcoming reminders:

```http
### Get My Upcoming Reminders
GET http://localhost:5000/message-api/reminders
Authorization: Bearer token_here
```

After reminder time, check notifications:

```http
### Get Notifications
GET http://localhost:5000/notification-api/notifications
Authorization: Bearer token_here
```

Expected notification type:

```txt
REMINDER
```

## 18. Common Errors And Fixes

### Invalid email or password

Use correct latest password.

### Please login

Token is missing.

Add:

```txt
Authorization: Bearer token_here
```

### Invalid token

Token is expired or copied incorrectly.

Login again.

### User not found while adding member

That email is not registered.

Register user first.

### Workspace not found

Workspace ID may be wrong, inactive, or user is not a member.

Fetch workspaces again and copy correct ID.

### Unknown Cloudinary API key

Cloudinary `.env` values are wrong.

Use real Cloudinary credentials.

### Redis ECONNREFUSED

Redis is not running.

Backend can still work without Redis for now.

### Notifications empty

Logged-in user has no notifications.

For direct message notification, login as receiver.

For reminder notification, wait until reminder time and login as sender.

### Reminder not created

Possible reasons:

- `reminderTime` is missing.
- `reminderTime` is in the past.
- Server restarted before reminder time.
- Message was not saved properly.

## 19. Mentor Questions And Answers

### What is this project?

It is a real-time Slack-like chat backend where users can chat inside workspaces, channels, and direct messages.

### What is the unique feature?

The unique feature is Smart Priority + Reminder Messaging System. Users can mark messages as LOW, MEDIUM, or HIGH priority and set a reminder time.

### Why is this useful?

In real teams, some messages are more important than others. This feature helps users remember important tasks or deadlines from chat messages.

### How does reminder work?

When a message has `reminderTime`, the backend uses `setTimeout`. At that time, it creates a notification for the sender.

### Why did we use setTimeout?

Because this is a simple beginner-friendly implementation. We did not want to add complex scheduler libraries.

### What is the limitation of setTimeout?

If the server restarts before the reminder time, the scheduled reminder is lost.

### How can this be improved later?

Later we can use a proper job scheduler like cron jobs, BullMQ, Agenda, or Redis queues.

### Why did we use Socket.io?

Socket.io makes messages, reactions, edits, and replies appear instantly without refreshing the page.

### Why did we use MongoDB?

MongoDB stores users, workspaces, channels, messages, reactions, replies, reminders, and notifications as flexible documents.

### Why did we use Cloudinary?

Cloudinary stores uploaded files, while MongoDB stores only the file URL and file details.

### Why did we use JWT?

JWT proves which user is logged in and protects private routes.

### Why did we not use controllers/services?

We followed the blog-style backend structure where APIs contain both routes and logic.

## 20. Natural Project Explanation

We are building a real-time chat app like a small Slack clone.

Think of it like a company office.

A workspace is like the company building.

A channel is like a room inside that building.

A direct message is like two people talking privately.

A message can be text, file, reaction, edit, or thread reply.

Now we added one special feature: priority and reminders.

So if someone sends an important message like:

```txt
We must complete frontend tomorrow.
```

They can mark it as `HIGH` priority and set a reminder time.

When that time comes, the app creates a reminder notification.

This makes our chat app more useful because it does not only store conversations, it also helps users remember important tasks.

## 21. Simple Demo Story

Example demo:

1. `user1` registers and logs in.
2. `user1` creates a workspace called Team Workspace.
3. `user2` registers.
4. `user1` adds `user2` into the workspace.
5. `user1` creates a general channel.
6. Users send messages inside the channel.
7. Users react to messages.
8. Users reply in threads.
9. Users share files.
10. `user1` sends a direct message to `user2`.
11. `user2` receives a notification.
12. `user1` sends a HIGH priority message with reminder time.
13. At reminder time, `user1` receives a reminder notification.

## 22. Best One-Line Explanation

We built the backend brain of a Slack-like real-time chat app where users can work inside workspaces, chat in channels or direct messages, share files, react, edit messages, reply in threads, receive notifications, and set priority-based reminders for important messages.

## 23. Final Summary

This backend is clean, simple, and beginner-friendly.

It includes:

- Authentication
- Workspaces
- Channels
- Direct messages
- File sharing
- Reactions
- Message editing
- Thread replies
- Notifications
- Real-time Socket.io events
- Redis basic online tracking
- Smart Priority + Reminder Messaging

The backend follows the same style throughout:

- API files contain routes and logic.
- Models store database structure.
- Middleware protects routes.
- Config files handle external tools.
- Socket files handle real-time communication.

This makes the project easy to explain, easy to test, and easy to extend later.
