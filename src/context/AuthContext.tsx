import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'superadmin';
  first_name?: string;
  last_name?: string;
  school_id?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('library_token');
    const savedUser = localStorage.getItem('library_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('library_token');
        localStorage.removeItem('library_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Inactivity timeout (1 hour)
  useEffect(() => {
    if (!token) return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("Inactivity timeout reached. Logging out...");
        logout();
      }, 3600000); // 1 hour
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('library_token', newToken);
    localStorage.setItem('library_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('library_token');
    localStorage.removeItem('library_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
