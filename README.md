# 🔐 Password Vault 

A full-stack password manager built with React, Node.js, and MySQL. This app allows users to securely store, view, delete, and decrypt passwords. Authentication is included.

## 🚀 Features
- User Registration & Login
- Authentication Verification
- Store Passwords with Encryption
- View & Decrypt Passwords
- Delete Passwords
- Password Hidden/Visible Toggle

## 🛠 Tech Stack
- **Frontend:** React, TailwindCSS, Axios, React Router
- **Backend:** Node.js, Express
- **Database:** MySQL

## 📂 Project Structure
```
root/
├── client/         # Frontend (React)
│   ├── public/
│   └── src/
├── server/         # Backend (Node.js)
│   └── index.js
└── README.md
```

## ⚙️ Setup Instructions
### Backend
1. Navigate to `server`
2. Run `npm install`
3. Setup MySQL database and update DB credentials in code
4. Run server: `node index.js`

### Frontend
1. Navigate to `client`
2. Run `npm install`
3. Start frontend: `npm run dev`

## 🔗 Connect Frontend & Backend
- Use proxy in `vite.config.js` to avoid hardcoding backend URLs.
- Example:
```js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

