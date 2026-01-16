import { signup } from "../API/auth-actions";
import "./styles/SignUpPage.scss";
import { type FormEvent, useState} from "react";

export default function SignUpPage() {
    
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [email, setEmail]=useState("");

    async function handleSubmit(e: FormEvent){
        e.preventDefault()
        try {
            await signup(username, password);
        } catch (error) {
            console.error("Signup failed:", error);
        }
    }

    return(
    <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <input placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)}></input>
            <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
            <button type="submit">S'inscrire</button>   
        </form>
    </div>
    )
}