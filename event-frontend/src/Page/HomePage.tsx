import "./styles/HomePage.scss";
import { logout } from "../API/auth-actions";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
    onLogout: () => void;
}

export default function HomePage({ onLogout }: HomePageProps) {

    const navigate = useNavigate();

    const handle_disconnection = () => {
        logout();
        onLogout();
        navigate("/");
    };

    return(
        <div>
            <h1>Home page</h1>
            <button onClick={handle_disconnection}>Se déconnecter</button>
        </div>
    );
}