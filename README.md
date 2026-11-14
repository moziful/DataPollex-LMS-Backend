# DataPollex Academy — Backend REST API (Node.js + Express.js + MongoDB)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-sky?style=for-the-badge&logo=vercel)](https://datapollex-lms-seven.vercel.app/)
[![Backend Repo](https://img.shields.io/badge/Backend-GitHub-green?style=for-the-badge&logo=node.js)](https://github.com/moziful/DataPollex-LMS-Backend)
[![Frontend Repo](https://img.shields.io/badge/Frontend-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/moziful/DataPollex-LMS)

> **Recruitment Process Task**: DataPollex Ltd. — Industrial Training Recruitment Process  
> **Duration**: 2 Days (48 Hours)  
> **Architecture**: Model-View-Controller (MVC) Pattern  
> **Tech Stack**: Node.js (ESM), Express.js, MongoDB Atlas (Mongoose), JWT, Bcrypt.js

---

## 🔗 Quick Project Links

- 🌐 **Live Deployed Application**: [https://datapollex-lms-seven.vercel.app/](https://datapollex-lms-seven.vercel.app/)
- ⚙️ **Backend Source Code**: [https://github.com/moziful/DataPollex-LMS-Backend](https://github.com/moziful/DataPollex-LMS-Backend)
- 💻 **Frontend Source Code**: [https://github.com/moziful/DataPollex-LMS](https://github.com/moziful/DataPollex-LMS)

---

## 🏗️ MVC Architecture & Project Structure

The backend strictly adheres to standard MVC separation of concerns:

```
lms-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose connection to MongoDB Atlas
│   ├── controllers/
│   │   ├── authController.js     # Login, Register, Me, Profile update, Progress sync
│   │   ├── courseController.js   # Courses CRUD, lecture count aggregation, cascade delete
│   │   └── lectureController.js  # Lecture CRUD with course foreign-key association
│   ├── middlewares/
│   │   ├── authMiddleware.js     # Bearer JWT verification (protect) & Admin role guard
│   │   └── errorMiddleware.js    # Global centralized error handler
│   ├── models/
│   │   ├── Admin.js              # Admin schema (name, email, password, role, avatar)
│   │   ├── User.js               # Student schema with lastProgress & avatar
│   │   ├── Course.js             # Course schema (title, desc, price, thumbnailUrl)
│   │   └── Lecture.js            # Lecture schema (title, desc, videoUrl, courseId)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── courseRoutes.js       # /api/courses endpoints
│   │   └── lectureRoutes.js      # /api/lectures endpoints
│   └── seed/
│       └── seed.js               # Comprehensive database seeder script
├── .env.example                  # Environment variables template
├── package.json
└── server.js                     # Express server entry point (Port 5000)
```

---

## 📡 Complete REST API Reference

### 1. Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates admin or student, issues 7-day JWT token. |
| `POST` | `/api/auth/register` | Public | Registers a new student with bcrypt hashed password. |
| `GET` | `/api/auth/me` | Protected | Returns authenticated user profile and saved progress. |
| `PUT` | `/api/auth/profile` | Protected | Updates user's display name and avatar image. |
| `PUT` | `/api/auth/progress` | Protected | Updates student's active course, lecture ID, and index. |

### 2. Course Routes (`/api/courses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public | Returns all courses (sorted newest first) with lecture counts. |
| `GET` | `/api/courses/:id` | Public | Returns single course populated with lectures in natural order. |
| `POST` | `/api/courses` | Protected (Admin) | Creates a new course with title, description, price, thumbnail. |
| `PUT` | `/api/courses/:id` | Protected (Admin) | Updates existing course information. |
| `DELETE` | `/api/courses/:id` | Protected (Admin) | Deletes course and **cascades deletion to all its lectures**. |

### 3. Lecture Routes (`/api/lectures`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/lectures/course/:courseId` | Public | Retrieves all lectures associated with a specific course. |
| `POST` | `/api/lectures` | Protected (Admin) | Adds a lecture to a course via `courseId`. |
| `PUT` | `/api/lectures/:id` | Protected (Admin) | Updates lecture title, description, or video URL. |
| `DELETE` | `/api/lectures/:id` | Protected (Admin) | Deletes a lecture document from the database. |

---

## 🛠️ Installation & Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/moziful/DataPollex-LMS-Backend.git
cd DataPollex-LMS-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file (or copy `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/datapollex_lms
JWT_SECRET=Secret-key
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### 4. Seed the Database
Run the seeder script to populate initial courses, 18 sequentially ordered lectures, and the default admin user:
```bash
npm run seed
```

### 5. Run the Server
```bash
# Development mode with Nodemon auto-reload
npm run dev

# Or Production mode
npm start
```
The server will be running on `http://localhost:5000`.

---

## 🔒 Security & Data Integrity

1. **Stateless Authentication**: Uses `jsonwebtoken` (JWT) with Bearer token validation in `authMiddleware.js`.
2. **Password Hashing**: All passwords (admin and student) are salted and hashed using `bcryptjs` (cost factor 10).
3. **Role Authorization**: Management endpoints verify `req.user.role === 'admin'` before allowing write/delete actions.
4. **Cascade Deletes**: Deleting a course automatically triggers `Lecture.deleteMany({ courseId: course._id })` ensuring zero orphan records.
5. **Natural Numeric Sorting**: Lectures sort with `{ numeric: true }` sensitivity, ensuring natural serial numbers (`01`, `02`, ... `18`) display in accurate curriculum order.

---

## 🏢 Organization Details

**DataPollex Ltd.**  
House 6, Block A, Main Road, Mirpur 10, Mirpur, Dhaka, Bangladesh  
Phone: `01963-431045` | Email: `contact@datapollex.com`
