# 🗺️ PROJECT ARCHITECTURE DIAGRAM

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DISASTER RESPONSE PLATFORM                   │
│              Location-Aware Training for Students                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                  │
        ┌───────▼────────┐                ┌───────▼────────┐
        │   FRONTEND     │                │    BACKEND     │
        │  React + Vite  │◄──────────────►│ Node + Express │
        │  Port: 3000    │    REST API    │   Port: 5000   │
        └────────────────┘                └────────┬───────┘
                                                   │
                                          ┌────────▼────────┐
                                          │    MONGODB      │
                                          │    Database     │
                                          └─────────────────┘
```

---

## Backend Architecture (MVC-like Pattern)

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

HTTP Request
     │
     ▼
┌─────────────────┐
│   app.js        │  Entry Point
│  (Main Server)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Middleware    │  Logger, Error Handler, CORS, Body Parser
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Routes      │  location.routes, disaster.routes, etc.
│  (URL Mapping)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controllers   │  location.controller, disaster.controller
│ (Request Logic) │  - Validate input
└────────┬────────┘  - Call services
         │           - Send response
         ▼
┌─────────────────┐
│    Services     │  disaster.service, location.service
│ (Business Logic)│  - Data processing
└────────┬────────┘  - Complex operations
         │
         ▼
┌─────────────────┐
│     Models      │  User.model, Progress.model, Badge.model
│ (Data Schemas)  │  - Database structure
└────────┬────────┘  - Validations
         │
         ▼
┌─────────────────┐
│    MongoDB      │  Actual Database
│   (Database)    │
└─────────────────┘
         │
         ▼
HTTP Response (JSON)
```

---

## Backend Folder Flow

```
src/
│
├── app.js ──────────────────────► Main entry point
│                                  - Initialize Express
│                                  - Setup middleware
│                                  - Register routes
│                                  - Start server
│
├── config/ ─────────────────────► Configuration
│   ├── database.config.js        - MongoDB connection
│   └── app.config.js             - App settings
│
├── constants/ ──────────────────► Fixed Values
│   ├── disaster.constants.js     - Disaster types, risk levels
│   └── response.constants.js     - HTTP codes, messages
│
├── middleware/ ─────────────────► Request Processing
│   ├── error.middleware.js       - Error handling
│   └── logger.middleware.js      - Request logging
│
├── routes/ ─────────────────────► URL Endpoints
│   ├── location.routes.js        - POST /api/location/disasters
│   ├── disaster.routes.js        - GET /api/disasters
│   └── [other routes]            - More endpoints
│
├── controllers/ ────────────────► Request Handlers
│   ├── location.controller.js    - Handle location requests
│   ├── disaster.controller.js    - Handle disaster requests
│   └── [other controllers]       - More handlers
│
├── services/ ───────────────────► Business Logic
│   ├── location.service.js       - Location mapping logic
│   ├── disaster.service.js       - Disaster data operations
│   └── [other services]          - More logic
│
├── models/ ─────────────────────► Data Structure
│   ├── User.model.js             - User schema
│   ├── Progress.model.js         - Progress schema
│   └── Badge.model.js            - Badge schema
│
├── utils/ ──────────────────────► Helper Functions
│   ├── response.util.js          - Response formatting
│   └── validation.util.js        - Input validation
│
└── validators/ ─────────────────► Input Validation
    └── [validation schemas]      - Request validators
```

---

## Request Flow Example

### GET /api/disasters/:id

```
1. Client Request
   │
   └──► http://localhost:5000/api/disasters/earthquake
          │
          ▼
2. app.js (Express)
   │
   ├──► Middleware Chain
   │    ├── CORS middleware
   │    ├── Body parser
   │    └── Request logger
   │
   └──► Route Matching
          │
          ▼
3. routes/disaster.routes.js
   │
   └──► Maps /api/disasters/:id to controller
          │
          ▼
4. controllers/disaster.controller.js
   │
   ├──► Validate :id parameter
   │
   ├──► Call service
   │    │
   │    └──► services/disaster.service.js
   │          │
   │          └──► getDisasterById(id)
   │                - Fetch data from disasterData
   │                - Return disaster object
   │
   └──► Format response
        │
        └──► utils/response.util.js
              - sendSuccess(res, data, message)
          │
          ▼
5. Send JSON Response
   │
   └──► {
          success: true,
          message: "Disaster retrieved",
          data: { id: "earthquake", name: "Earthquake", ... }
        }
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

User Interaction
     │
     ▼
┌─────────────────┐
│     Pages       │  HomePage, Dashboard, GamePage, etc.
│  (UI Screens)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Components    │  Buttons, Cards, Modals
│  (Reusable UI)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Hooks       │  useLocalStorage, useApi, useTimer
│ (Custom Logic)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  api.js - HTTP requests
│  (API Calls)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │  REST endpoints
└─────────────────┘
```

---

## Frontend Folder Flow

```
src/
│
├── main.jsx ────────────────────► Application Entry
│                                  - Render App component
│
├── App.jsx ─────────────────────► Main Component
│                                  - React Router setup
│                                  - Route definitions
│
├── pages/ ──────────────────────► Page Components
│   ├── HomePage.jsx              - Landing page
│   ├── Dashboard.jsx             - Main dashboard
│   ├── GamePage.jsx              - Game interface
│   └── [other pages]             - More pages
│
├── components/ ─────────────────► Reusable Components
│   ├── common/                   - Buttons, Cards, Modals
│   └── layout/                   - Header, Footer, Sidebar
│
├── services/ ───────────────────► API Integration
│   └── api.js                    - HTTP requests to backend
│
├── contexts/ ───────────────────► Global State
│   ├── UserContext.jsx           - User state
│   └── LocationContext.jsx       - Location state
│
├── hooks/ ──────────────────────► Custom Hooks
│   ├── useLocalStorage.js        - LocalStorage hook
│   └── useApi.js                 - API call hook
│
├── utils/ ──────────────────────► Utilities
│   ├── storage.util.js           - Storage helpers
│   └── format.util.js            - Formatting helpers
│
├── constants/ ──────────────────► Constants
│   └── app.constants.js          - App-wide constants
│
├── config/ ─────────────────────► Configuration
│   └── api.config.js             - API base URL
│
└── styles/ ─────────────────────► Global Styles
    └── [global CSS files]        - Themes, variables
```

---

## Data Flow: User Registration Example

```
┌────────────┐
│   FRONTEND │
└─────┬──────┘
      │
      │ 1. User fills form
      │    - Name: "Ravi"
      │    - Age: 10
      │    - Grade: "5th Grade"
      │
      ▼
┌─────────────────┐
│ HomePage.jsx    │ 2. handleSubmit()
└────────┬────────┘    - Validate input
         │              - Call API service
         │
         ▼
┌─────────────────┐
│  api.js         │ 3. registerUser(userData)
│  (Service)      │    - POST to /api/users/register
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐
│    BACKEND      │
│  Port: 5000     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ user.routes.js  │ 4. Route: POST /api/users/register
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ user.controller  │ 5. registerUser(req, res)
│    .js           │    - Validate input
└────────┬─────────┘    - Call service
         │
         ▼
┌──────────────────┐
│ user.service.js  │ 6. createUser(userData)
└────────┬─────────┘    - Business logic
         │               - Create user
         │
         ▼
┌──────────────────┐
│  User.model.js   │ 7. Save to database
└────────┬─────────┘    - Mongoose schema
         │               - Validation
         │
         ▼
┌──────────────────┐
│    MongoDB       │ 8. Store user data
└────────┬─────────┘
         │
         │ Response
         ▼
┌──────────────────┐
│ response.util.js │ 9. sendSuccess(res, user)
└────────┬─────────┘
         │
         │ HTTP Response
         ▼
┌─────────────────┐
│   FRONTEND      │ 10. Handle response
│  api.js         │     - Update UI
└────────┬────────┘     - Navigate to /setup
         │
         ▼
┌─────────────────┐
│ LocationSetup   │ 11. Next screen
│     .jsx        │
└─────────────────┘
```

---

## Database Schema Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                      DATABASE STRUCTURE                       │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│       User          │
│  (User.model.js)    │
├─────────────────────┤
│ _id                 │◄────────────┐
│ name                │             │
│ age                 │             │
│ grade               │             │
│ location {          │             │
│   state             │             │
│   city              │             │ References
│ }                   │             │
│ progress {          │             │
│   completedModules  │             │
│   badges []         │             │
│   totalScore        │             │
│ }                   │             │
└─────────────────────┘             │
                                    │
┌─────────────────────┐             │
│     Progress        │             │
│ (Progress.model.js) │             │
├─────────────────────┤             │
│ _id                 │             │
│ userId ─────────────┼─────────────┘
│ moduleId            │
│ moduleType          │
│ disasterType        │
│ score               │
│ percentage          │
│ completed           │
│ answers []          │
└─────────────────────┘

┌─────────────────────┐
│       Badge         │
│  (Badge.model.js)   │
├─────────────────────┤
│ _id                 │
│ badgeId (unique)    │
│ name                │
│ description         │
│ icon                │
│ category            │
│ criteria {}         │
│ rarity              │
└─────────────────────┘
```

---

## Configuration Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   CONFIGURATION HIERARCHY                     │
└──────────────────────────────────────────────────────────────┘

1. Environment Variables (.env)
   │
   │  PORT=5000
   │  MONGODB_URI=mongodb://...
   │  JWT_SECRET=...
   │
   ▼
2. Configuration Files (config/)
   │
   ├──► app.config.js
   │    - Read from .env
   │    - Set defaults
   │    - Export config object
   │
   └──► database.config.js
        - Read MONGODB_URI
        - Connect to database
        - Handle errors
   │
   ▼
3. Application (app.js)
   │
   └──► Uses config values
        - Server port
        - CORS settings
        - Database connection
```

---

## Error Handling Flow

```
Error Occurs Anywhere
   │
   ▼
┌─────────────────────┐
│  Try-Catch Block    │
│  (in controller)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Error Middleware    │
│ (error.middleware)  │
├─────────────────────┤
│ - Check error type  │
│ - Format message    │
│ - Set status code   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  response.util.js   │
│  sendError()        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   JSON Response     │
│  {                  │
│    success: false,  │
│    message: "...",  │
│    errors: [...]    │
│  }                  │
└─────────────────────┘
```

---

## Summary

This architecture provides:

✅ **Clear Separation** - Each layer has a specific purpose  
✅ **Scalability** - Easy to add new features  
✅ **Maintainability** - Easy to find and fix issues  
✅ **Testability** - Each component can be tested independently  
✅ **Professional** - Industry-standard patterns

---

*Diagram represents the complete organized structure of the Disaster Response Training Platform*
