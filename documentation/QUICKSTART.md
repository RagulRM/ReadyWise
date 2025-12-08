# 🚀 Quick Start Guide

Get your Disaster Response Training Platform up and running in 5 minutes!

## ⚡ Super Quick Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment (1 minute)

```bash
# In backend folder
cd backend
copy .env.example .env   # Windows
# OR
cp .env.example .env     # Mac/Linux
```

**Edit `.env`:**
- If you have MongoDB installed locally, keep default settings
- If using MongoDB Atlas, update `MONGODB_URI` with your connection string

### Step 3: Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Open Browser (30 seconds)

```
http://localhost:3000
```

**That's it! 🎉**

---

## 📋 What You'll See

### 1. **Homepage** (http://localhost:3000)
- Welcome screen with Ravi & Meera characters
- Student registration form
- Feature showcase

### 2. **Location Setup** (/setup)
- Select your state from dropdown
- Enter city (optional)
- System identifies your disaster risks

### 3. **Dashboard** (/dashboard)
- Your personalized disaster list
- Interactive games to play
- Quizzes to take
- Progress tracking

### 4. **Games** (/game/earthquake-drill)
- Earthquake Drill Game
- Fire Escape Maze
- Flood Safety Decisions

### 5. **Quizzes** (/quiz/earthquake)
- Multiple choice questions
- Instant feedback
- Badge rewards

### 6. **Progress** (/progress)
- Your scores and achievements
- Earned badges
- Learning statistics

---

## 🎮 Try These First

1. **Register as a student**
   - Name: Ravi
   - Age: 10
   - Grade: Class 5
   - School: Test School

2. **Set Location**
   - State: Tamil Nadu
   - City: Chennai
   
   → You'll see: Cyclone, Flood, Earthquake modules

3. **Play Earthquake Game**
   - Click "Play Now" on Earthquake Drill
   - Make decisions in 3 scenarios
   - Earn points and badges!

4. **Take a Quiz**
   - Click any disaster quiz
   - Answer 3-5 questions
   - Get instant results

---

## 🔍 Verify Installation

### ✅ Backend Health Check
Visit: http://localhost:5000/api/health

Should show:
```json
{
  "status": "OK",
  "message": "Disaster Response Platform API is running"
}
```

### ✅ Get States List
Visit: http://localhost:5000/api/states

Should return list of Indian states.

---

## 🆘 Quick Troubleshooting

### Problem: Backend won't start
**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas in .env
```

### Problem: Frontend shows errors
**Solution:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Problem: Port already in use
**Solution:**
```bash
# Change port in backend/.env
PORT=5001
```

---

## 📚 Key Features to Explore

### 🎯 Location-Based Learning
- Different states → Different disasters
- Chennai students learn about Cyclones
- Delhi students learn about Earthquakes

### 🎮 Interactive Games
- Real-time decision making
- Time-limited scenarios
- Score-based learning

### 🏆 Gamification
- Earn badges for achievements
- Track progress
- Unlock new content

### 📊 Progress Tracking
- See what you've learned
- View your scores
- Check earned badges

---

## 🎓 Sample Test Journey

1. **Start:** Register → Location Setup
2. **Learn:** Read about Earthquake safety
3. **Practice:** Play Earthquake Drill game
4. **Test:** Take Earthquake quiz
5. **Achieve:** Earn "Earthquake Expert" badge
6. **Repeat:** Try Fire, Flood modules

---

## 📁 Project Structure (Quick Reference)

```
backend/
  ├── server.js          # API entry point
  ├── routes/            # API endpoints
  └── data/              # Disaster content

frontend/
  ├── src/
  │   ├── pages/        # React pages
  │   └── services/     # API calls
  └── index.html

database/
  └── models/           # Data schemas
```

---

## 🌐 API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/location/disasters` | POST | Get disasters by location |
| `/api/disasters` | GET | List all disasters |
| `/api/games` | GET | List all games |
| `/api/quiz/:type` | GET | Get quiz questions |
| `/api/users/register` | POST | Register student |

---

## 🎨 Tech Stack

- **Frontend:** React + Vite + Material-UI
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Styling:** CSS3 with gradients & animations

---

## 📱 Browser Support

✅ Chrome (Recommended)
✅ Firefox
✅ Safari
✅ Edge

❌ Internet Explorer (not supported)

---

## 🔗 Useful Links

- Full Documentation: `DOCUMENTATION.md`
- Installation Guide: `INSTALL.md`
- Main README: `README.md`

---

## 💡 Tips

1. **Use Chrome DevTools** (F12) to see API calls
2. **Check both terminals** for error messages
3. **Restart servers** if you change .env
4. **Clear browser cache** if CSS doesn't update

---

## 🎯 Next Steps

After setup:
1. ✅ Explore all disaster types
2. ✅ Complete 3 games
3. ✅ Take 3 quizzes
4. ✅ Earn 5 badges
5. ✅ Customize for your region

---

## 🤝 Need Help?

- Check `INSTALL.md` for detailed setup
- Review `DOCUMENTATION.md` for architecture
- See `README.md` for full project info

---

**🌟 Ready to Learn! Let's make disaster preparedness fun and effective! 🌟**

*"Stay Safe, Learn Smart!"*

Database User(MongoDB):
username: disaster-admin
Pass: DI0LmSRFfhWH0NoB