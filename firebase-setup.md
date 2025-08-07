# Firebase Setup Guide

## 🔥 Quick Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "Financial Goals Portal"
4. Follow the setup wizard

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password"
3. Enable "Google" (optional but recommended)
4. Add your domain to authorized domains

### 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### 4. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Copy the config object

### 5. Create .env.local File
Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 6. Create Test User (Optional)
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter email: `demo@example.com`
4. Enter password: `demo123456`

### 7. Restart Development Server
```bash
npm run dev
```

## 🎯 Demo Account
For testing, you can use:
- **Email**: `demo@example.com`
- **Password**: `demo123456`

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**
   - Check that `.env.local` file exists
   - Verify all environment variables are set
   - Restart the development server

2. **"auth/invalid-credential" error**
   - Ensure Email/Password authentication is enabled in Firebase
   - Check that you're using correct credentials
   - Try the demo account first

3. **"auth/user-not-found" error**
   - Create a user account first via signup
   - Or use the demo account for testing

4. **Google Sign-in not working**
   - Enable Google authentication in Firebase Console
   - Add your domain to authorized domains
   - Allow popups in your browser

## 📞 Need Help?
1. Check the browser console for detailed error messages
2. Verify Firebase configuration in the console
3. Ensure all environment variables are correctly set
4. Try the demo account to test functionality
