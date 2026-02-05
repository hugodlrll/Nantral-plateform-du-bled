import { Navigate, Route, Routes } from "react-router"
import ConnectPage from "./Page/ConnectPage"
import HomePage from "./Page/HomePage"
import MyEventsPage from "./Page/MyEventsPage"
import { ProfilePage } from "./Page/ProfilePage"
import { useEffect, useMemo } from "react";
import type { AppRouteProps, User } from "./utils/types";

interface AppRoutesProps extends AppRouteProps {
    onUserUpdate: (updatedUser: User) => void;
}

export default function AppRoutes({user, token, onLoginSuccess, onLogout, onUserUpdate}: AppRoutesProps) {
    const isAuthenticated = useMemo(()=> Boolean(token && user), [token, user]);
    
    return (
        <Routes>
            <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/home" replace/> : <ConnectPage onLoginSuccess={onLoginSuccess} />} />
            <Route 
                path="/home" 
                element={isAuthenticated ? <HomePage onLogout={onLogout} token={token} user={user} /> : <Navigate to="/" replace/>}
            />
            <Route 
                path="/my-events" 
                element={isAuthenticated ? <MyEventsPage onLogout={onLogout} token={token} user={user} /> : <Navigate to="/" replace/>}
            />
            <Route 
                path="/profile" 
                element={isAuthenticated ? <ProfilePage user={user} token={token} onUserUpdate={onUserUpdate} /> : <Navigate to="/" replace/>}
            />
        </Routes>
    );
}