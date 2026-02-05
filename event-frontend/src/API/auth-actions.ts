import type { LoginResponse, User } from "../utils/types";

export async function login(identifier:string, password:string):Promise<string>{
    const res = await fetch(`/api/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({identifier, password}),
    })

    if(!res.ok){
        throw new Error("Invalid credentials");
    }
    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);

    return data.token;
}

export async function signup(username:string, email:string, password:string):Promise<string> {
    const res = await fetch(`/api/signup`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username, email, password}),
    })

    if(!res.ok){
        const error = await res.json();
        throw new Error(error.error || "Signup failed");
    }

    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);

    return data.token;
}

export async function validateToken():Promise<User> {
    const token = localStorage.getItem("token");
    
    if(!token){
        throw new Error("no token");
    }
    const res = await fetch(`/api/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if(!res.ok) {
        throw new Error("Invalid token");
    }
    const data = await res.json();
    return data.user;
}

export function logout(): void {
    const token = localStorage.getItem("token");
    
    if(!token){
        throw new Error("no token");
    } else {
        localStorage.removeItem("token");
    }  
}

export async function updateUsername(newUsername: string): Promise<User> {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("no token");
    }

    const res = await fetch("/api/username", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update username");
    }

    const data = await res.json();
    return data.user;
}

export async function updateEmail(newEmail: string): Promise<User> {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("no token");
    }

    const res = await fetch("/api/email", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update email");
    }

    const data = await res.json();
    return data.user;
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("no token");
    }

    const res = await fetch("/api/password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update password");
    }
}