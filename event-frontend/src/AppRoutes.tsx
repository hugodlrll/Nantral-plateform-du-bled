import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./Page/LoginPage"
import SignUpPage from "./Page/SignUpPage"
import type { User } from "./utils/types";

interface AppRoutesProps {
    user: User | null;
}

export default function AppRoutes({ user }: AppRoutesProps) {
    const isAuthenticated = user !== null;
    
    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/events" replace/>
                    ) : (
                        <SignUpPage/>
                    )
                }
            />
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/events" replace/>
                    ) : (
                        <LoginPage/>
                    )
                }
            />
        </Routes>
    );
}