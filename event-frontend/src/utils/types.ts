export interface LoginResponse {
    token: string;
}

export interface User {
    id: string;
    username: string;
}

export interface AppRouteProps { 
    user : User | null
    token : string | null
    onLoginSuccess: (token: string, user: User) => void
    onLogout: () => void
}