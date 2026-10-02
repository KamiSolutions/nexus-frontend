### 🏢 Nexus Portal — Enterprise Management Platform

A cross-platform internal management portal built for a multi-subsidiary organisation.  
It centralises core business operations into one unified system including:

- Financial requisitions & approvals
- HR leave management
- Vehicle tracking & fleet oversight
- Lease management
- Policy handling & claims processing
- Role-based access control (RBAC)

Built as a single scalable codebase running across **Android, iOS, and Web** using Expo.

---

## 🧪 Prototype Status

This project is currently a frontend prototype using mock data.

The goal of this version is to demonstrate:

- UI/UX flows
- Enterprise dashboard structure
- Role-based navigation
- Cross-platform architecture
- Internal management workflows

No live backend connection is required to explore the current prototype.

Future versions may integrate with a real API backend.

---

## ⚙️ Tech Stack

TypeScript · React Native · Expo (Web + Mobile) · Expo Router · React 19 ·  
REST API Integration · Role-Based Access Control (RBAC)

---

## 🚀 Getting Started (Local Setup)

If you're cloning this project, follow these steps to get it running locally.

### 1. Clone the repo

```bash
git clone https://github.com/KamiSolutions/nexus-frontend.git
cd nexus-frontend
2. Install dependencies
npm install

or

yarn install
3. Set up environment variables

Create a .env file in the root:

cp .env.example .env

Then update it:

EXPO_PUBLIC_API_URL=https://your-backend-url.com

⚠️ This project requires a running backend API (Django or equivalent).
Make sure the API is accessible before running the app.

4. Start the development server
Web
npm run web
Mobile (Expo Go)
npm start

Then scan the QR code using Expo Go.

5. Build for production (Web)
npm run build

Output will be generated in:

dist/

This is what gets deployed to platforms like Vercel.

🌐 API Setup

This frontend expects a REST API backend.

Make sure:

Authentication endpoints are available
JWT token-based auth is enabled
CORS is configured for your frontend domain

📁 Project Structure (Simplified)
nexus-frontend/
├── app/                # Routes (Expo Router)
├── components/        # Reusable UI components
├── lib/               # API + utilities
├── providers/         # Auth & theme providers
├── constants/         # Theme tokens & config
├── services/          # API service layer
├── assets/            # Images & fonts
└── dist/              # Production web build

🔐 Key Features
Role-based access control (Admin, Manager, Staff)
Secure authentication with JWT
Cross-platform UI (Web + Mobile)
Modular service-based architecture
Theme system (light/dark mode support)
Production-ready API integration layer

🧠 Notes for Developers
All API calls are environment-driven via EXPO_PUBLIC_API_URL
Do NOT hardcode backend URLs
Web deployment uses SPA routing (refresh-safe)
Backend must be running separately

🏗 Build & Deployment
Web (Vercel-ready)
npm run build

Deploy the dist/ folder.

🔒 Disclaimer

This project was originally built for an enterprise client and has been sanitised for portfolio use.
Some business-specific logic and integrations have been abstracted or removed.
```
