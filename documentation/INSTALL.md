# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas account (cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- A code editor like **VS Code** - [Download](https://code.visualstudio.com/)

### Verify Installation

Open your terminal/command prompt and verify:

```bash
node --version
# Should show v16.x or higher

npm --version
# Should show 7.x or higher

mongod --version
# Should show MongoDB version (if using local MongoDB)
```

---

## Step-by-Step Installation

### 1. Clone or Download the Project

If using Git:
```bash
git clone <repository-url>
cd "Disaster Response"
```

Or download the ZIP file and extract it.

---

### 2. Backend Setup

#### Navigate to backend folder:
```bash
cd backend
```

#### Install dependencies:
```bash
npm install
```

This will install:
- express
- cors
- body-parser
- dotenv
- mongoose
- bcryptjs
- jsonwebtoken
- uuid
- multer

#### Create environment file:

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**On Mac/Linux:**
```bash
cp .env.example .env
```

#### Configure .env file:

Open `.env` file in a text editor and update:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Choose one option:

# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/disaster_response

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/disaster_response

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Session Secret
SESSION_SECRET=your_session_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Start MongoDB (if using local):

**On Windows:**
```powershell
# Open a new terminal
mongod
```

**On Mac:**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

#### Test Backend:
```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
📍 Location-aware disaster response training platform
```

Keep this terminal running.

---

### 3. Frontend Setup

#### Open a NEW terminal and navigate to frontend:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- framer-motion
- @mui/material
- vite

#### Start Frontend:
```bash
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

### 4. Access the Application

Open your web browser and go to:
```
http://localhost:3000
```

You should see the homepage with "Stay Safe, Learn Smart!" 🌟

---

## Verification Steps

### ✅ Check Backend is Running

Visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "Disaster Response Platform API is running"
}
```

### ✅ Check Frontend is Running

Visit: `http://localhost:3000`

You should see the colorful homepage with:
- Registration form
- Cartoon characters (Ravi & Meera)
- Feature cards

### ✅ Test Database Connection

In the backend terminal, you should NOT see any MongoDB connection errors.

If using MongoDB Atlas, ensure:
- Your IP is whitelisted
- Username and password are correct
- Connection string is properly formatted

---

## Common Installation Issues

### Issue 1: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Option 1: Kill the process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Option 2: Change port in .env
PORT=5001
```

### Issue 2: MongoDB Connection Failed

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
1. Ensure MongoDB is running:
   ```bash
   mongod
   ```

2. Check MongoDB status:
   ```bash
   # Windows
   sc query MongoDB
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mongod
   ```

3. Use MongoDB Atlas instead of local MongoDB

### Issue 3: Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or
npm ci
```

### Issue 4: Permission Denied

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# On Mac/Linux, use sudo
sudo npm install

# Or fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

### Issue 5: React App Not Loading

**Error**: Blank page or continuous loading

**Solutions**:
1. Clear browser cache
2. Check browser console for errors (F12)
3. Ensure backend is running
4. Check CORS settings in backend

---

## Development Mode

Both servers are now running in development mode with:

- **Auto-reload**: Changes automatically refresh
- **Hot Module Replacement**: React updates without full refresh
- **Detailed error messages**: Better debugging

---

## Building for Production

### Backend:
```bash
cd backend
npm start
```

### Frontend:
```bash
cd frontend
npm run build
npm run preview
```

This creates an optimized production build in `frontend/dist/`

---

## Docker Setup (Optional)

If you prefer using Docker:

```bash
# Coming soon - Docker Compose configuration
docker-compose up
```

---

## Next Steps

After successful installation:

1. ✅ Register a test student
2. ✅ Set up location (e.g., Tamil Nadu → Chennai)
3. ✅ Explore disaster modules
4. ✅ Play a game
5. ✅ Take a quiz
6. ✅ Check progress page

---

## Getting Help

If you encounter issues:

1. Check this guide again
2. Review error messages carefully
3. Check the DOCUMENTATION.md file
4. Search for similar issues online
5. Contact the development team

---

## System Requirements

### Minimum:
- 4GB RAM
- 2-core processor
- 1GB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Recommended:
- 8GB RAM
- 4-core processor
- 5GB free disk space
- Latest browser version

---

**Happy Learning! 🎓**

*"The best time to prepare for a disaster is before it happens"*
