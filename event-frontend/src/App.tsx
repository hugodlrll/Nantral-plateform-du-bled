import { useEffect, useState } from 'react';
import './App.css'
import type {User} from "./utils/types";
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { validateToken } from './API/auth-actions';
import { Tooltip } from 'radix-ui';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const[user, setUser] = useState<User | null>(null);
  const[token, setToken] = useState<string | null>(null);
  const[isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if(!storedToken) {
      setIsLoading(false);
      return;
    }
    
    setToken(storedToken);
    validateToken()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLoginSucess = (t:string, u:User) => {
    localStorage.setItem("token", t);
    localStorage.setItem("userId", u.id.toString());
    setToken(t);
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  }

  return(
    <ThemeProvider>
      <Toaster />
      <Tooltip.Provider>
        <BrowserRouter>
          {isLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Chargement...</div>
            </div>
          ) : (
            <AppRoutes
              user={user}
              token={token}
              onLoginSuccess={handleLoginSucess}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </BrowserRouter>
      </Tooltip.Provider>
    </ThemeProvider>
  );
}
