# Solvify

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.0-000000?style=flat&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

> **🌐 Live Demo:** [Visit](https://solvify-topaz.vercel.app/)

A modern, full-stack MERN application for managing client inquiries and project quotations. Solvify provides a seamless platform for users to submit project inquiries, and for businesses to manage and respond with professional quotations.

---

## ✨ Features

- 🔐 **Robust Authentication** - Email/password login, Google OAuth, JWT-based sessions with refresh token rotation
- 📋 **Inquiry Management** - Submit detailed project inquiries with auto-generated IDs (INQ-YYYY-XXXX)
- 💼 **Quotation System** - Generate and manage professional quotations linked to inquiries
- 📧 **Email Notifications** - Automated transactional emails via Mailtrap for signup, password reset, and inquiry submissions
- 🎨 **Modern UI** - Responsive design with dark/light mode support using shadcn/ui components
- ⚡ **Background Jobs** - Event-driven async task processing with Inngest
- 🔒 **Security First** - Argon2 password hashing, HttpOnly cookies, Helmet security headers
- 🌐 **Google Login** - One-click authentication with Google OAuth 2.0

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Redux Toolkit** - Global state management
- **React Query** - Server state & caching
- **React Router v6** - Client-side routing
- **shadcn/ui** - Radix-based accessible components
- **Axios** - HTTP client

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Token-based authentication
- **Argon2** - Password hashing
- **Passport.js** - Google OAuth strategy
- **Nodemailer + Mailtrap** - Email delivery
- **Inngest** - Background job processing
- **Helmet** - Security middleware

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/solvify.git
cd solvify
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/solvify

# JWT Secrets (use strong, random strings)
ACCESS_TOKEN_SECRET=your-access-token-secret-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here

# CORS & Frontend
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Email Configuration (Mailtrap)
EMAIL_FROM=noreply@solvify.com
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password-or-token

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
REDIRECT_URL=http://localhost:3000/api/auth/google

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key

# Session
COOKIE_KEY=your-cookie-encryption-key
```

### Frontend (.env)

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_BASE_URL=http://localhost:3000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Note:** Never commit `.env` files to version control. Use `.env.example` as a template.

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Server will start on `http://localhost:3000`

**Terminal 2 - Inngest Dev Server (for background jobs):**
```bash
cd server
npm run inngest-dev
```
Inngest dashboard available at `http://localhost:8288`

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will start on `http://localhost:5173`

#### Option 2: Production Build

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

---

## 📁 Project Structure

```
solvify/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── api.ts            # Axios instance & API utilities
│   │   ├── App.tsx           # Main app component with routes
│   │   ├── main.tsx          # App entry point
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # shadcn/ui primitives (49 components)
│   │   │   ├── home/         # Homepage sections
│   │   │   └── ...
│   │   ├── pages/            # Route-level page components
│   │   ├── store/            # Redux store & slices
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and helpers
│   │   └── theme/            # Theme provider
│   ├── tailwind.config.ts    # Tailwind configuration
│   ├── vite.config.ts        # Vite configuration
│   └── package.json
│
├── server/                   # Express backend API
│   ├── src/
│   │   ├── app.js           # Express app configuration
│   │   ├── server.js        # Server bootstrap
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── services/        # Business logic & external services
│   │   ├── inngest/         # Background job handlers
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Environment configuration
│   │   └── db/              # Database connection
│   ├── .env.example         # Environment template
│   └── package.json
│
└── README.md                # This file
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/logout` | Logout user |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password/:token` | Reset password with token |
| `GET` | `/api/auth/google` | Google OAuth login |
| `POST` | `/api/user/inquiry` | Create new inquiry |
| `GET` | `/health` | Health check endpoint |

For detailed API documentation, see:
- [Frontend Documentation](./client/FRONTEND_DOCUMENTATION.md)
- [Backend Documentation](./server/BACKEND_DOCUMENTATION.md)

---

## 🎯 Key Features in Detail

### Authentication Flow
- **Email/Password**: Traditional registration and login with Argon2 hashed passwords
- **Google OAuth**: One-click social login using Passport.js
- **JWT Tokens**: Access tokens (15min) + HttpOnly refresh tokens (7 days)
- **Password Recovery**: Secure token-based password reset via email

### Inquiry System
- Auto-generated inquiry IDs (format: `INQ-YYYY-XXXX`)
- Detailed project information capture
- Status tracking (pending, under review, quotation sent, etc.)
- Email notifications on submission

### Email System
- Welcome emails on user registration
- Password reset emails with secure tokens
- Inquiry submission confirmations
- Background processing via Inngest for reliability

### Theme Support
- Light/Dark mode toggle
- System preference detection
- Persistent user preference (localStorage)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify `MONGO_URI` in `.env`

**CORS Errors:**
- Check `CORS_ORIGIN` matches your frontend URL exactly
- Ensure `withCredentials: true` is set in frontend API calls

**Email Not Sending:**
- Verify Mailtrap credentials in `.env`
- Check SMTP port (587 for TLS, 465 for SSL)
- Review server logs for detailed error messages

**Google OAuth Not Working:**
- Verify redirect URI in Google Console matches `REDIRECT_URL`
- Ensure Google Client ID/Secret are correct
- Check that cookies are enabled

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Kumar Prakhar**
- GitHub: [@kumarprakhar14](https://github.com/kumarprakhar14)

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful React components
- [Inngest](https://www.inngest.com/) for reliable background jobs
- [Mailtrap](https://mailtrap.io/) for email testing and delivery

---

**Built with ❤️ using the MERN stack**
