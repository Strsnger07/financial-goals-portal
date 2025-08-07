# Financial Goals Portal

A comprehensive financial goal tracking application with AI-powered smart recommendations, built with Next.js, Firebase, and Tailwind CSS.

## 🚀 Features

- **Smart Goal Recommendations**: AI-powered financial goal suggestions based on user profile
- **Dynamic Currency Support**: Switch between USD and INR with real-time conversion
- **Dark Mode Interface**: Modern, accessible dark theme throughout the application
- **User Authentication**: Secure Firebase authentication with Google Sign-in
- **Goal Tracking**: Create, track, and contribute to financial goals
- **Financial Insights**: Real-time analysis of savings rate, debt ratio, and emergency fund coverage
- **Goal Templates**: Pre-defined templates that adapt to user's financial situation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **State Management**: React Context API
- **Code Quality**: ESLint, TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Strsnger07/financial-goals-portal.git
   cd financial-goals-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google Sign-in)
   - Create a Firestore database
   - Get your Firebase config from Project Settings

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup Guide

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "Financial Goals Portal")
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
4. Copy the config object to your `.env.local` file

### 5. Create Test User (Optional)
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter email and password for testing

## 🎯 Usage

### Demo Account
For testing purposes, you can use the demo account:
- **Email**: `demo@example.com`
- **Password**: `demo123456`

### Key Features
- **Dashboard**: Overview of your financial goals and progress
- **Smart Recommendations**: AI-powered goal suggestions based on your profile
- **Goal Creation**: Create custom financial goals with target amounts
- **Contribution Tracking**: Add contributions to track progress
- **Profile Management**: Update your financial profile and preferences
- **Currency Switching**: Toggle between USD and INR throughout the app

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
Make sure to add these in your Vercel project settings:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── goals/            # Goals management page
│   └── profile/          # User profile page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility libraries
└── styles/               # Global styles
```

## 🔍 Troubleshooting

### Common Issues

1. **Firebase Authentication Error**
   - Ensure Firebase is properly configured
   - Check that Email/Password authentication is enabled
   - Verify environment variables are set correctly

2. **Build Errors**
   - Run `npm run lint` to check for code issues
   - Ensure all dependencies are installed
   - Check TypeScript types

3. **Environment Variables**
   - Make sure `.env.local` exists in the root directory
   - Verify all Firebase config values are correct
   - Restart the development server after changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify Firebase configuration
3. Ensure all environment variables are set
4. Check the browser console for errors

---

**Happy Financial Planning! 🎉** 