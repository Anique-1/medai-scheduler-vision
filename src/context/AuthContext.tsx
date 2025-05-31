
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'created_at'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  const register = async (userData: Omit<User, 'id' | 'created_at'> & { password: string }): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (existingUsers.find((user: any) => user.email === userData.email)) {
        return false;
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        age: userData.age,
        medical_history: userData.medical_history,
        password: userData.password,
        created_at: new Date().toISOString(),
      };

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Log in the user
      const { password, ...userWithoutPassword } = newUser;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
      });
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
        });
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
