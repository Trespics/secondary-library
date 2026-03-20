import { useAuth } from '../../context/AuthContext';

export default function WelcomeBanner() {
  const { user } = useAuth();
  
  return (
    <div className="welcome-banner glass-card border-none shadow-xl shadow-primary/10 overflow-hidden relative">
      <div className="banner-content relative z-10">
        <h1 className="banner-title text-3xl font-display font-bold text-white mb-2">
          Welcome back, {user?.first_name || 'Student'}! 👋
        </h1>
        <p className="banner-subtitle text-blue-100 text-lg opacity-90">
          Ready to continue your learning journey today?
        </p>
      </div>
      <div className="banner-decoration absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
}