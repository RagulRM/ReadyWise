# Project Documentation

## Overview
This document provides detailed information about the Interactive Simulation Platform for Location-Based Disaster Response Training.

## Architecture

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │
└────────┬────────┘
         │
         │ MongoDB
         │
┌────────▼────────┐
│   Database      │
│   (MongoDB)     │
└─────────────────┘
```

## Location-to-Disaster Mapping Logic

### Geographic Risk Analysis

The platform uses the following logic to determine disaster risks:

1. **Coastal States** → Cyclone, Flood risks
2. **Himalayan States** → Earthquake, Landslide risks
3. **Metro Cities** → Fire, Stampede risks
4. **Central Plains** → Flood, Drought risks

### State-Wise Disaster Mapping

| Region | States | Primary Disasters |
|--------|--------|------------------|
| Coastal | TN, AP, Odisha, Kerala, Goa | Cyclone, Flood, Tsunami |
| Himalayan | J&K, HP, Uttarakhand, Sikkim | Earthquake, Landslide, Avalanche |
| Northern Plains | UP, Bihar, Punjab, Haryana | Flood, Earthquake |
| Metro | Delhi, Mumbai, Bangalore | Fire, Earthquake, Stampede |
| Central | MP, Chhattisgarh | Flood, Drought |

## Game Design

### Earthquake Drill Game

**Objective**: Teach "Drop, Cover, Hold On" technique

**Flow**:
1. Scene 1: Feeling the shake → Choose correct first action
2. Scene 2: Under desk → Protect head
3. Scene 3: After shaking → Calm evacuation

**Scoring**:
- Correct action: 100 points
- Partially correct: 20-50 points
- Wrong action: 0 points

**Time Limit**: 10 seconds per decision

### Fire Escape Maze

**Objective**: Teach fire evacuation procedures

**Flow**:
1. Scene 1: Detect smoke → Alert others
2. Scene 2: Smoke-filled corridor → Crawl low
3. Scene 3: Stairs vs Elevator → Choose stairs

**Learning Outcomes**:
- Alert response
- Smoke safety
- Exit selection

## Quiz Design

### Question Types

1. **Safety Action Questions**
   - "What should you do FIRST during earthquake?"
   - Options: Visual + Text
   - Immediate feedback

2. **Scenario-Based Questions**
   - Picture of situation
   - Multiple choice responses
   - Explanation after answer

3. **Do's & Don'ts Questions**
   - True/False format
   - Quick learning reinforcement

### Scoring System

- Each question: 10 points
- Passing: 70%
- Expert: 90%+

## Badge Award Criteria

| Badge | Criteria | Rarity |
|-------|----------|--------|
| Earthquake Expert | Complete all earthquake modules with 90%+ | Epic |
| Fire Safety Hero | Score 100% in fire quiz | Rare |
| Flood Wise | Complete flood modules | Rare |
| Safety Star | Complete first module | Common |
| Quiz Master | Score 100% in any quiz | Epic |
| Game Champion | Complete 5 games | Rare |

## Database Schema Details

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  age: Number,
  grade: String,
  school: String,
  location: {
    state: String,
    city: String,
    district: String,
    pincode: String
  },
  language: String,
  progress: {
    completedModules: Array,
    badges: Array,
    totalScore: Number,
    currentLevel: Number
  },
  createdAt: Date,
  lastLogin: Date
}
```

### Progress Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  moduleId: String,
  moduleType: String, // 'game', 'quiz', 'video', 'simulation'
  disasterType: String,
  score: Number,
  maxScore: Number,
  percentage: Number,
  completed: Boolean,
  timeTaken: Number,
  attempts: Number,
  answers: Array,
  timestamp: Date
}
```

### Badge Collection

```javascript
{
  _id: ObjectId,
  badgeId: String,
  name: String,
  description: String,
  icon: String,
  category: String,
  criteria: {
    type: String,
    requirement: Number,
    description: String
  },
  rarity: String,
  color: String
}
```

## API Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Security Considerations

### Current Implementation
- Input validation on all forms
- CORS enabled for frontend
- Environment variables for sensitive data

### Planned Security
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- XSS protection
- CSRF tokens

## Performance Optimization

### Frontend
- Lazy loading of routes
- Image optimization
- Code splitting
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Response compression
- Caching with Redis (planned)

## Testing Strategy

### Unit Tests
- Component testing (React Testing Library)
- API endpoint testing (Jest + Supertest)
- Utility function testing

### Integration Tests
- User flow testing
- API integration testing
- Database operations testing

### User Acceptance Testing
- Student testing sessions
- Teacher feedback collection
- Usability studies

## Deployment Guide

### Production Checklist

- [ ] Update environment variables
- [ ] Set up MongoDB Atlas
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up CDN for static assets
- [ ] Configure logging and monitoring
- [ ] Set up backup strategy
- [ ] Test disaster recovery

### Deployment Platforms

**Recommended:**
- Frontend: Vercel / Netlify
- Backend: Heroku / AWS / DigitalOcean
- Database: MongoDB Atlas

### Environment Variables (Production)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-secret-key>
FRONTEND_URL=<production-frontend-url>
```

## Maintenance

### Regular Tasks
- Database backup (daily)
- Log review (weekly)
- Performance monitoring (continuous)
- Content updates (monthly)
- Security patches (as needed)

### Analytics to Track
- User engagement metrics
- Module completion rates
- Quiz performance
- Badge distribution
- Geographic usage patterns

## Troubleshooting

### Common Issues

**Issue**: Backend not connecting to MongoDB
**Solution**: Check MONGODB_URI in .env file

**Issue**: Frontend API calls failing
**Solution**: Verify backend is running on correct port

**Issue**: Games not loading
**Solution**: Check browser console for errors, verify API endpoints

## Glossary

- **Module**: A learning unit (game, quiz, video)
- **Disaster Type**: Category of disaster (earthquake, flood, etc.)
- **Risk Profile**: Location-specific disaster risks
- **Badge**: Achievement earned by students
- **Progress**: Learning activity record

## References

- NDMA Guidelines (National Disaster Management Authority)
- Child Safety Education Best Practices
- Gamification in Education Research
- Location-Based Learning Studies

---

*Last Updated: November 2025*
