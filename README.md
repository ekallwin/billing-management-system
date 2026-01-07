# Billing Management System

A comprehensive web application designed for small businesses to manage billing, products, and transactions efficiently. Built with React, Node.js, and Firebase.

## 🚀 Features

- **Billing & Invoicing**: Create bills with automatic calculations for totals, discounts, and tax.
- **Product Management**: Add, edit, and manage your product inventory.
- **Transaction History**: View past bills, filter by date, and track sales.
- **Thermal Printer Support**: Specialized mode for printing receipts on thermal printers (80mm).
- **Settings Configuration**:
  - **Business Profile**: Manage business name, address, and contact details.
  - **UPI Settings**: Configure UPI ID for payments.
  - **Tax Settings**: Enable/Disable GST and set tax percentages.
  - **Print Settings**: Toggle between Standard and Thermal printer modes.
- **Authentication**:
  - Secure Login & Registration (Email/Password & Google Auth).
  - Forgot Password flow with OTP verification.
  - Account Deletion with security checks.
- **PDF Generation**: Download invoices as PDF.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React, FontAwesome, React Icons

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- Firebase Project set up

### 1. Client (Frontend)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `client/` and add:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # For Google Script (OTP Sender) - Optional/If configured
   VITE_GOOGLE_SCRIPT_URL=your_script_url
   
   # Backend URL (For Production)
   VITE_API_URL=https://your-backend-url.com/api
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

### 2. Server (Backend)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` and add:
   ```env
   PORT=5000
   ALLOWED_ORIGINS=http://localhost:5173,https://your-deployed-frontend.com
   
   # Firebase Service Account (JSON content one-line string or path)
   FIREBASE_SERVICE_ACCOUNT=...
   ```
4. Run the server:
   ```bash
   node index.js
   ```

## 📦 Deployment

### Frontend
Deploy the `client` folder to **Vercel**, **Netlify**, or similar platforms.
- Set Build Command: `npm run build`
- Set Output Directory: `dist`
- Add environment variables in the dashboard.

### Backend
Deploy the `server` folder to **Render**, **Railway**, or **Heroku**.
- Add environment variables in the dashboard.

## 🔒 Security
- **CORS**: Configurable allowed origins in `server/index.js`.
- **Auth**: Protected routes using Firebase token verification.
