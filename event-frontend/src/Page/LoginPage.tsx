import "./styles/LoginPage.scss"
import { type FormEvent, useState } from "react";

export default function LoginPage() {
    
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    async function handleSubmit(e: FormEvent){
        e.preventDefault()
        console.log(username, password)
    }

    return(<form onSubmit={handleSubmit}>
        <input value={username} onChange={(e)=> setUsername(e.target.value)}></input>
        <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
        <button type="submit">Se connecter</button>   
    </form>)
}