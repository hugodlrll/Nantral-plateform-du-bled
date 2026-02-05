import "./styles/ConnectPage.scss";
import { Tabs } from "radix-ui";
import { login, signup, validateToken } from "../API/auth-actions";
import { type FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../utils/types";
import { toastLoginSuccess, toastSignupSuccess, toastLoginError, toastSignupError } from "../utils/toasts";
import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

interface ConnectPageProps {
    onLoginSuccess: (token: string, user: User) => void;
}

export default function ConnectPage({ onLoginSuccess }: ConnectPageProps) {
    const [identifier, setIdentifier]=useState("");
    const [username, setUsername]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    
    async function handleSubmitLogin(e: FormEvent){
        e.preventDefault()
        try {
            const token = await login(identifier, password);
            localStorage.setItem("token", token);
            const user = await validateToken();
            localStorage.setItem("userId", user.id.toString());
            onLoginSuccess(token, user);
            toastLoginSuccess(user.username);
            navigate("/home");
        } catch (error) {
            setErrorMessage("Identifiant ou mot de passe invalide.");
            toastLoginError();
            console.error("Login failed:", error);
        }
    }

    async function handleSubmitRegister(e: FormEvent){
        e.preventDefault()
        try {
            const token = await signup(username, email, password);
            localStorage.setItem("token", token);
            const user = await validateToken();
            localStorage.setItem("userId", user.id.toString());
            onLoginSuccess(token, user);
            toastSignupSuccess(user.username);
            navigate("/home");
        } catch (error) {
            setErrorMessage("Le compte existe déjà ou une erreur est survenue.");
            toastSignupError("Le compte existe déjà ou une erreur est survenue.");
            console.error("Registration failed:", error);
        }
    }

    return(
        <div 
            className="ConnectPage"
            style={{
                '--mouse-x': `${mousePosition.x}%`,
                '--mouse-y': `${mousePosition.y}%`,
            } as React.CSSProperties}
        >
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
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
                        <input placeholder="Username ou Email" value={identifier} onChange={(e)=> setIdentifier(e.target.value)}></input>
                        <input placeholder="Mot de passe" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
                        <button type="submit">Se connecter</button>   
                    </form>
                </div>
                 {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
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
                {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
            </Tabs.Content>
        </Tabs.Root>
        </div>
    );
}