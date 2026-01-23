import { Navigate, Route, Routes } from "react-router"
import ConnectPage from "./Page/ConnectPage"
import HomePage from "./Page/HomePage"
import { useEffect, useMemo } from "react";
import type { AppRouteProps } from "./utils/types";

export default function AppRoutes({user, token, onLoginSuccess, onLogout}: AppRouteProps) {
    const isAuthenticated = useMemo(()=> Boolean(token && user), [token, user]);
    
    return (
        <Routes>
            <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/home" replace/> : <ConnectPage onLoginSuccess={onLoginSuccess} />} />
            <Route 
                path="/home" 
                element={isAuthenticated ? <HomePage onLogout={onLogout} token={token} /> : <Navigate to="/" replace/>}
            />
        </Routes>
    );
}