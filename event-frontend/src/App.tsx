import { useEffect, useState } from 'react';
import './App.css'
import type {User} from "./utils/types";
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { validateToken } from './API/auth-actions';

export default function App() {
  const[user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      return;
    }
    validateToken()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  return(
    <BrowserRouter>
      <AppRoutes
        user={user}
      /> 
    </BrowserRouter>
  );
}
