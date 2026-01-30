import "./styles/Header.scss";
import { Avatar, Tooltip, Popover } from "radix-ui";
import { ExitIcon } from "@radix-ui/react-icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../utils/types";

interface HeaderProps {
    onLogout: () => void;
    user: User | null;
}

export default function Header({ onLogout, user }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isOnHomePage = location.pathname === "/home";

    return (
        <div className="Header">
            <h2 onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>Nantral Plateform (du bled)</h2>
            <div className="nav-buttons">
                <button 
                    className={`nav-btn ${isOnHomePage ? 'active' : ''}`}
                    onClick={() => navigate("/home")}
                >
                    Tous les événements
                </button>
                <button 
                    className={`nav-btn ${!isOnHomePage ? 'active' : ''}`}
                    onClick={() => navigate("/my-events")}
                >
                    Mes événements
                </button>
            </div>
            <div className="Profile">
                <Popover.Root>
                    <Popover.Trigger asChild>
                        <button className="IconButton" aria-label="Update dimensions">
                            <Tooltip.Root>
                                <Avatar.Root className="AvatarRoot">
                                    <Avatar.Image className="AvatarImage" src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" alt="User Avatar" />
                                    <Avatar.Fallback className="AvatarFallback" delayMs={600}>U</Avatar.Fallback>
                                </Avatar.Root>
                            </Tooltip.Root>
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className="PopoverContent" sideOffset={5}>
                            <div className="PopoverContentInner">
                                <div className="user-info">
                                    <span className="username">{user?.username || "Utilisateur"}</span>
                                </div>
                                <button className="disconnection-button" onClick={onLogout}>
                                    <ExitIcon className="disconnection-icon" />
                                </button>
                            </div>
                            <Popover.Arrow className="PopoverArrow" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
        </div>
    );
}