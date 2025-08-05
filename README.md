# Financial Goals & Job Portal

A comprehensive Next.js application for managing financial goals with smart AI-powered recommendations and dynamic currency support.

## 🚀 Features

### Core Features
- **Financial Goal Management**: Create, track, and manage your financial goals
- **Smart AI Recommendations**: AI-powered financial goal suggestions based on your profile
- **Dynamic Currency Support**: Switch between USD and INR with real-time conversion
- **User Profile Management**: Comprehensive financial profile setup
- **Goal Templates**: Pre-defined templates with dynamic amounts based on income
- **Financial Insights**: Real-time calculations for savings rate, debt-to-income ratio, and emergency fund coverage
- **Dark Mode**: Complete dark mode implementation for better user experience

### Smart Recommendations
- **Income-based Suggestions**: Tailored recommendations based on your salary
- **Life Stage Analysis**: Age-appropriate financial goals
- **Risk Tolerance Assessment**: Conservative to aggressive investment strategies
- **Debt Management**: Smart debt payoff strategies
- **Emergency Fund Planning**: Personalized emergency fund recommendations

### Technical Features
- **Next.js 14**: Latest App Router with TypeScript
- **Firebase Integration**: Authentication and Firestore database
- **Shadcn/ui Components**: Modern, accessible UI components
- **Tailwind CSS**: Utility-first styling with dark mode
- **Recharts**: Beautiful data visualization
- **Real-time Updates**: Live goal tracking and updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd financial-goals-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase config to `lib/firebase.ts`

4. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features Explained

### Smart Goal Recommendations
The application uses advanced algorithms to provide personalized financial recommendations:

- **Income Analysis**: Suggests goals based on your monthly income
- **Expense Tracking**: Considers your monthly expenses for realistic goal setting
- **Life Stage Planning**: Age-appropriate financial milestones
- **Risk Assessment**: Conservative to aggressive investment strategies
- **Debt Management**: Smart debt payoff strategies

### Dynamic Currency Support
- **Real-time Conversion**: Switch between USD and INR seamlessly
- **Global Context**: Currency preference stored in user profile
- **Consistent Display**: All amounts display in selected currency
- **Template Adaptation**: Goal templates adjust amounts based on currency

### Financial Insights
- **Savings Rate**: Calculated as (Monthly Income - Monthly Expenses) / Monthly Income
- **Debt-to-Income Ratio**: Total monthly debt payments / Monthly income
- **Emergency Fund Coverage**: Current savings / Monthly expenses

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── goals/             # Goals management
│   └── profile/           # User profile
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── smart-recommendations.tsx
│   ├── goal-templates.tsx
│   └── user-profile-setup.tsx
├── contexts/             # React Context providers
├── lib/                  # Utility functions and Firebase config
└── styles/               # Global styles
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Add your web app and copy the config
5. Update `lib/firebase.ts` with your config

### Customization
- **Currency**: Modify `contexts/currency-context.tsx` to add more currencies
- **Goal Templates**: Edit `components/goal-templates.tsx` to add new templates
- **Smart Recommendations**: Update `lib/smart-recommendations.ts` for custom algorithms

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Build command: `npm run build`, Publish directory: `out`
- **Firebase Hosting**: Use `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Firebase](https://firebase.google.com/) for backend services
- [Recharts](https://recharts.org/) for data visualization
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team. 