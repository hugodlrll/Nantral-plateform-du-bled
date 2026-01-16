import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./Page/LoginPage"
import SignUpPage from "./Page/SignUpPage"
import { useMemo } from "react";

export default function AppRoutes() {
    const token = localStorage.getItem("token");
    const isAuthentificated = useMemo(() => Boolean(token), [token]);
    
    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthentificated ? (
                        <Navigate to="/events" replace/>
                    ) : (
                        <LoginPage/>
                    )
                }
            />
            <Route
                path="/login"
                element={
                    isAuthentificated ? (
                        <Navigate to="/events" replace/>
                    ) : (
                        <LoginPage/>
                    )
                }
            />
        </Routes>
    );
}