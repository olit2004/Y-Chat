# Y-Chat 💬 

Y-Chat is a modern, real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It features a sleek UI with support for both light and dark modes, real-time delivery status, and group messaging capabilities.

## Features

- **Real-time Messaging**: Powered by Socket.io for instant message delivery.
- **Authentication**: Secure user registration and login using JWT and Bcrypt.
- **Dual Theme Support**: Beautifully crafted Light and Dark modes.
- **Group Chats**: Create and manage group conversations.
- **Message Status**: Real-time "seen" status and unread message counts.
- **Image Uploads**: Share images with your contacts (powered by Multer).
- **Responsive Design**: Built with Tailwind CSS 4.0 for a seamless experience across devices.
- **Message Pagination**: Efficient loading of chat history.

---

##  Screenshots

<div align="center">
  <h3>Light Mode</h3>
  <img src="./Ychat_light mode screen shoot.png" alt="Y-Chat Light Mode" width="800">
  <br>
  <h3>Dark Mode</h3>
  <img src="./ychat dartmode screen shoot .png" alt="Y-Chat Dark Mode" width="800">
</div>

---

##  Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4.0
- **State/Routing**: React Router 7
- **Real-time**: Socket.io-client
- **Icons**: React Icons

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Auth**: JWT & Cookie-parser
- **File Handling**: Multer

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Y-Chat
   ```

2. **Setup Backend**:
   ```bash
   cd Server
   npm install
   ```
   Create a `.env` file in the `Server` directory:
   ```env
   PORT=5000
   DB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```

3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the Server**:
   ```bash
   cd Server
   node app.js
   ```

2. **Start the Client**:
   ```bash
   cd client
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝License
This project is licensed under the ISC License.
