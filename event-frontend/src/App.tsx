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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if(!storedToken) {
      return;
    } else {
      setToken(storedToken);
    }
    validateToken()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
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

  return(
    <ThemeProvider>
      <Toaster />
      <Tooltip.Provider>
        <BrowserRouter>
          <AppRoutes
            user={user}
            token={token}
            onLoginSuccess={handleLoginSucess}
            onLogout={handleLogout}
          /> 
        </BrowserRouter>
      </Tooltip.Provider>
    </ThemeProvider>
  );
}
