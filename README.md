# Office Plus React

A React-based office space rental platform with an integrated chatbot.

## Deployment Guide

### Backend Deployment (Render)

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `node index.js`
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   DASHSCOPE_API_KEY=your_dashscope_api_key
   FRONTEND_URL=https://your-app.netlify.app
   ```
5. Deploy the service
6. Note down your Render service URL (e.g., https://your-app.onrender.com)

### Frontend Deployment (Netlify)

1. Create a new site in Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `build`
4. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-app.onrender.com
   REACT_APP_CHAT_API_URL=https://your-app.onrender.com/api/chat
   ```
5. Deploy the site

### Chatbot Configuration

The chatbot uses DashScope's API for AI text generation. Make sure to:
1. Obtain a DashScope API key
2. Set the API key in your Render environment variables
3. Update the frontend URL in your Render environment variables to allow CORS

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
3. Create `.env` files:
   - Copy `server/.env.example` to `server/.env` and fill in your values
   - Create `.env` in root with:
     ```
     REACT_APP_API_URL=http://localhost:5000
     REACT_APP_CHAT_API_URL=http://localhost:5000/api/chat
     ```
4. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd server && npm start

   # Terminal 2 - Frontend
   npm start
   ```

## Environment Variables

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_CHAT_API_URL`: Chat API endpoint

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT authentication
- `DASHSCOPE_API_KEY`: DashScope API key for chatbot
- `FRONTEND_URL`: Frontend application URL for CORS
