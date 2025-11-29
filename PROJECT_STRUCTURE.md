# 📁 PROJECT STRUCTURE

## Complete Organized File Structure

```
disaster-response/
│
├── 📚 DOCUMENTATION/
│   ├── README.md                           # Main project documentation
│   ├── QUICKSTART.md                       # Quick setup guide
│   ├── INSTALL.md                          # Detailed installation
│   ├── DOCUMENTATION.md                    # Technical documentation
│   ├── FEATURES.md                         # Feature showcase
│   ├── PROJECT_SUMMARY.md                  # Project summary
│   ├── PROJECT_STRUCTURE.md                # This file
│   └── LICENSE                             # MIT License
│
├── 🖥️ BACKEND/ (Node.js + Express API)
│   ├── src/
│   │   │
│   │   ├── config/                         # Configuration files
│   │   │   ├── database.config.js          # MongoDB connection setup
│   │   │   └── app.config.js               # Application configuration
│   │   │
│   │   ├── constants/                      # Application constants
│   │   │   ├── disaster.constants.js       # Disaster type constants
│   │   │   └── response.constants.js       # Response message constants
│   │   │
│   │   ├── controllers/                    # Request handlers (Business Logic)
│   │   │   ├── location.controller.js      # Location-based logic
│   │   │   ├── disaster.controller.js      # Disaster information logic
│   │   │   ├── user.controller.js          # User management logic [TO BE IMPLEMENTED]
│   │   │   ├── progress.controller.js      # Progress tracking logic [TO BE IMPLEMENTED]
│   │   │   ├── quiz.controller.js          # Quiz logic [TO BE IMPLEMENTED]
│   │   │   ├── game.controller.js          # Game logic [TO BE IMPLEMENTED]
│   │   │   └── badge.controller.js         # Badge logic [TO BE IMPLEMENTED]
│   │   │
│   │   ├── middleware/                     # Express middleware
│   │   │   ├── error.middleware.js         # Error handling middleware
│   │   │   ├── logger.middleware.js        # Request logging middleware
│   │   │   └── auth.middleware.js          # Authentication middleware [TO BE IMPLEMENTED]
│   │   │
│   │   ├── models/                         # Database schemas (Mongoose)
│   │   │   ├── User.model.js               # User schema with methods
│   │   │   ├── Progress.model.js           # Progress tracking schema
│   │   │   └── Badge.model.js              # Badge schema
│   │   │
│   │   ├── routes/                         # API route definitions
│   │   │   ├── location.routes.js          # Location endpoints
│   │   │   ├── disaster.routes.js          # Disaster endpoints
│   │   │   ├── user.routes.js              # User endpoints
│   │   │   ├── progress.routes.js          # Progress endpoints
│   │   │   ├── quiz.routes.js              # Quiz endpoints
│   │   │   ├── game.routes.js              # Game endpoints
│   │   │   └── badge.routes.js             # Badge endpoints
│   │   │
│   │   ├── services/                       # Business logic & data services
│   │   │   ├── disaster.service.js         # Disaster data service
│   │   │   ├── location.service.js         # Location mapping service
│   │   │   ├── user.service.js             # User service [TO BE IMPLEMENTED]
│   │   │   ├── progress.service.js         # Progress service [TO BE IMPLEMENTED]
│   │   │   ├── quiz.service.js             # Quiz service [TO BE IMPLEMENTED]
│   │   │   ├── game.service.js             # Game service [TO BE IMPLEMENTED]
│   │   │   └── badge.service.js            # Badge service [TO BE IMPLEMENTED]
│   │   │
│   │   ├── utils/                          # Utility functions
│   │   │   ├── response.util.js            # API response helpers
│   │   │   └── validation.util.js          # Validation helpers
│   │   │
│   │   ├── validators/                     # Input validators
│   │   │   └── [validation schemas]        # [TO BE IMPLEMENTED]
│   │   │
│   │   └── app.js                          # Main application entry point
│   │
│   ├── .env.example                        # Environment variables template
│   ├── package.json                        # Backend dependencies & scripts
│   └── package-lock.json                   # Lock file
│
├── 🎨 FRONTEND/ (React + Vite)
│   ├── public/                             # Static assets
│   │   └── [images, icons, etc.]
│   │
│   ├── src/
│   │   │
│   │   ├── assets/                         # Application assets
│   │   │   └── images/                     # Image files
│   │   │
│   │   ├── components/                     # Reusable React components
│   │   │   ├── common/                     # Common UI components
│   │   │   │   ├── Button.jsx              # [TO BE CREATED]
│   │   │   │   ├── Card.jsx                # [TO BE CREATED]
│   │   │   │   ├── Modal.jsx               # [TO BE CREATED]
│   │   │   │   └── Loading.jsx             # [TO BE CREATED]
│   │   │   │
│   │   │   └── layout/                     # Layout components
│   │   │       ├── Header.jsx              # [TO BE CREATED]
│   │   │       ├── Footer.jsx              # [TO BE CREATED]
│   │   │       └── Sidebar.jsx             # [TO BE CREATED]
│   │   │
│   │   ├── config/                         # Frontend configuration
│   │   │   └── api.config.js               # API configuration ✅
│   │   │
│   │   ├── constants/                      # Frontend constants
│   │   │   └── app.constants.js            # Application constants ✅
│   │   │
│   │   ├── contexts/                       # React Context providers
│   │   │   ├── UserContext.jsx             # [TO BE CREATED]
│   │   │   └── LocationContext.jsx         # [TO BE CREATED]
│   │   │
│   │   ├── hooks/                          # Custom React hooks
│   │   │   ├── useLocalStorage.js          # [TO BE CREATED]
│   │   │   ├── useApi.js                   # [TO BE CREATED]
│   │   │   └── useTimer.js                 # [TO BE CREATED]
│   │   │
│   │   ├── pages/                          # Page components
│   │   │   ├── HomePage.jsx                # Landing page
│   │   │   ├── HomePage.css
│   │   │   ├── LocationSetup.jsx           # Location setup
│   │   │   ├── LocationSetup.css
│   │   │   ├── Dashboard.jsx               # Main dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── GamePage.jsx                # Game interface
│   │   │   ├── GamePage.css
│   │   │   ├── QuizPage.jsx                # Quiz interface
│   │   │   ├── QuizPage.css
│   │   │   ├── DisasterInfoPage.jsx        # Disaster info
│   │   │   ├── DisasterInfoPage.css
│   │   │   ├── ProgressPage.jsx            # Progress tracking
│   │   │   └── ProgressPage.css
│   │   │
│   │   ├── services/                       # API service layer
│   │   │   └── api.js                      # API calls
│   │   │
│   │   ├── styles/                         # Global styles
│   │   │   └── [global styles]             # [TO BE ORGANIZED]
│   │   │
│   │   ├── utils/                          # Utility functions
│   │   │   ├── storage.util.js             # LocalStorage helpers ✅
│   │   │   └── format.util.js              # Formatting helpers ✅
│   │   │
│   │   ├── App.jsx                         # Main app component
│   │   ├── main.jsx                        # Application entry
│   │   └── index.css                       # Global CSS
│   │
│   ├── index.html                          # HTML template
│   ├── vite.config.js                      # Vite configuration
│   ├── package.json                        # Frontend dependencies
│   └── package-lock.json                   # Lock file
│
└── .gitignore                              # Git ignore rules
```

---

## 📋 Folder Organization Principles

### Backend Structure

#### **config/**
- **Purpose**: Centralized configuration management
- **Contents**: Database connections, app settings, environment configs
- **Naming**: `[feature].config.js`

#### **constants/**
- **Purpose**: Application-wide constants and enums
- **Contents**: Disaster types, status codes, message templates
- **Naming**: `[domain].constants.js`

#### **controllers/**
- **Purpose**: Request handling and business logic orchestration
- **Contents**: HTTP request/response handling, validation, service calls
- **Naming**: `[resource].controller.js`
- **Pattern**: One controller per resource (location, disaster, user, etc.)

#### **middleware/**
- **Purpose**: Express middleware functions
- **Contents**: Error handling, logging, authentication, validation
- **Naming**: `[function].middleware.js`

#### **models/**
- **Purpose**: Database schema definitions
- **Contents**: Mongoose schemas with methods and statics
- **Naming**: `[Resource].model.js` (PascalCase)

#### **routes/**
- **Purpose**: API endpoint definitions
- **Contents**: Route definitions mapped to controllers
- **Naming**: `[resource].routes.js`
- **Pattern**: One route file per resource

#### **services/**
- **Purpose**: Business logic and data operations
- **Contents**: Complex logic, data transformations, external API calls
- **Naming**: `[domain].service.js`
- **Pattern**: Pure functions when possible

#### **utils/**
- **Purpose**: Reusable utility functions
- **Contents**: Helpers for validation, formatting, responses
- **Naming**: `[function].util.js`

#### **validators/**
- **Purpose**: Input validation schemas
- **Contents**: Request validation rules
- **Naming**: `[resource].validator.js`

---

### Frontend Structure

#### **assets/**
- **Purpose**: Static files (images, fonts, icons)
- **Organization**: By type (images/, fonts/, icons/)

#### **components/**
- **Purpose**: Reusable React components
- **Organization**:
  - `common/`: Generic UI components (Button, Card, Modal)
  - `layout/`: Layout components (Header, Footer, Sidebar)
- **Naming**: `[ComponentName].jsx` (PascalCase)

#### **config/**
- **Purpose**: Frontend configuration
- **Contents**: API URLs, app settings
- **Naming**: `[feature].config.js`

#### **constants/**
- **Purpose**: Application constants
- **Contents**: Routes, storage keys, enums
- **Naming**: `app.constants.js`

#### **contexts/**
- **Purpose**: React Context providers
- **Contents**: Global state management
- **Naming**: `[Feature]Context.jsx`

#### **hooks/**
- **Purpose**: Custom React hooks
- **Contents**: Reusable stateful logic
- **Naming**: `use[HookName].js`

#### **pages/**
- **Purpose**: Page-level components
- **Contents**: Route components, one per page
- **Naming**: `[PageName].jsx` + `[PageName].css`

#### **services/**
- **Purpose**: API communication layer
- **Contents**: HTTP requests, API calls
- **Naming**: `[domain].service.js` or `api.js`

#### **styles/**
- **Purpose**: Global styles and themes
- **Contents**: CSS variables, global styles
- **Naming**: By purpose

#### **utils/**
- **Purpose**: Utility helper functions
- **Contents**: Formatting, validation, storage helpers
- **Naming**: `[function].util.js`

---

## 🎯 Naming Conventions

### Files
- **Backend**:
  - Config: `[feature].config.js`
  - Controllers: `[resource].controller.js`
  - Models: `[Resource].model.js` (PascalCase)
  - Routes: `[resource].routes.js`
  - Services: `[domain].service.js`
  - Utils: `[function].util.js`

- **Frontend**:
  - Components: `[ComponentName].jsx` (PascalCase)
  - Pages: `[PageName].jsx` + `[PageName].css`
  - Hooks: `use[HookName].js`
  - Utils: `[function].util.js`

### Variables & Functions
- **camelCase**: Variables, functions
- **PascalCase**: Classes, React components, Models
- **UPPER_SNAKE_CASE**: Constants, enums
- **kebab-case**: CSS classes, file names (when appropriate)

---

## 🔄 Import Path Examples

### Backend Imports
```javascript
// From a controller
const { getDisastersByLocation } = require('../services/location.service');
const { sendSuccess, sendError } = require('../utils/response.util');
const { RISK_LEVELS } = require('../constants/disaster.constants');

// From a route
const { getLocationDisasters } = require('../controllers/location.controller');

// From app.js
const locationRoutes = require('./routes/location.routes');
const connectDatabase = require('./config/database.config');
```

### Frontend Imports
```javascript
// From a component
import { DISASTER_ICONS } = from '../../constants/app.constants';
import { formatDate } = from '../../utils/format.util';
import API_BASE_URL from '../../config/api.config';

// From a page
import Button from '../../components/common/Button';
import Header from '../../components/layout/Header';
```

---

## ✅ Implementation Status

### Completed ✅
- Backend folder structure
- Config files (database, app)
- Constants (disasters, responses)
- Models (User, Progress, Badge)
- Middleware (error, logger)
- Controllers (location, disaster)
- Routes (all 7 routes)
- Services (disaster, location)
- Utils (response, validation)
- Frontend folder structure
- Frontend utils (storage, format)
- Frontend constants

### In Progress 🔄
- Implementing remaining controllers
- Implementing remaining services
- Frontend component organization
- Moving existing pages to new structure

### To Do 📝
- Complete all controller implementations
- Create frontend reusable components
- Create React custom hooks
- Implement auth middleware
- Create validators
- Update all import paths
- Update documentation

---

## 📖 Benefits of This Structure

### 1. **Separation of Concerns**
- Each folder has a single, clear purpose
- Easy to locate specific functionality

### 2. **Scalability**
- Easy to add new features
- Clear pattern to follow

### 3. **Maintainability**
- Organized, predictable structure
- Easy for new developers to understand

### 4. **Testability**
- Services and utils are pure functions
- Easy to unit test

### 5. **Reusability**
- Utils and services are modular
- Components are isolated

### 6. **Best Practices**
- Industry-standard MVC-like pattern
- Clean architecture principles

---

## 🚀 Next Steps

1. **Migrate existing code** to new structure
2. **Update all import paths** throughout the project
3. **Implement remaining controllers** and services
4. **Create reusable components** in frontend
5. **Update documentation** to reflect new structure
6. **Add comprehensive tests**

---

*This structure follows industry best practices for MERN stack applications and ensures maximum organization, scalability, and maintainability.*
