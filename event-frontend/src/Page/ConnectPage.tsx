import "./styles/ConnectPage.scss";
import { Tabs } from "radix-ui";
import { login, signup, validateToken } from "../API/auth-actions";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../utils/types";

interface ConnectPageProps {
    onLoginSuccess: (token: string, user: User) => void;
}

export default function ConnectPage({ onLoginSuccess }: ConnectPageProps) {
    const [username, setUsername]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const navigate = useNavigate();

    
    async function handleSubmitLogin(e: FormEvent){
        e.preventDefault()
        try {
            const token = await login(username, password);
            localStorage.setItem("token", token);
            const user = await validateToken();
            localStorage.setItem("userId", user.id.toString());
            onLoginSuccess(token, user);
            navigate("/home");
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    async function handleSubmitRegister(e: FormEvent){
        e.preventDefault()
        try {
            const token = await signup(username, password);
            localStorage.setItem("token", token);
            const user = await validateToken();
            localStorage.setItem("userId", user.id.toString());
            onLoginSuccess(token, user);
            navigate("/home");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }

    return(
        <Tabs.Root className="TabsRoot" defaultValue="LoginTab">
            <Tabs.List className="TabsList" aria-label="Manage your account">
                <Tabs.Trigger className="TabsTrigger" value="LoginTab">
                    Connexion
                </Tabs.Trigger>
                <Tabs.Trigger className="TabsTrigger" value="RegsitrationTab">
                    Inscription
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="LoginTab">
                <div>
                    <form onSubmit={handleSubmitLogin}>
                        <input placeholder="Identifiant" value={username} onChange={(e)=> setUsername(e.target.value)}></input>
                        <input placeholder="Mot de passe" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
                        <button type="submit">Se connecter</button>   
                    </form>
                </div>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="RegsitrationTab">
                <div>
                    <form onSubmit={handleSubmitRegister}>
                        <input placeholder="Identifiant" value={username} onChange={(e)=> setUsername(e.target.value)}></input>
                        <input placeholder="Email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)}></input>
                        <input placeholder="Mot de passe" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
                        <button type="submit">S'inscrire</button>   
                    </form>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    );
}