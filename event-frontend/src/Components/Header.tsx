import "./styles/Header.scss";
import { Avatar, Tooltip, Popover } from "radix-ui";
import { ExitIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../utils/types";
import { useTheme } from "../context/ThemeContext";
import { AvatarDisplay } from "./AvatarDisplay";

interface HeaderProps {
    onLogout: () => void;
    user: User | null;
    avatarRefreshKey?: number;
}

export default function Header({ onLogout, user, avatarRefreshKey = 0 }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isOnHomePage = location.pathname === "/home";
    const { theme, toggleTheme } = useTheme();

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
                        <button className="IconButton" aria-label="User menu">
                            <Tooltip.Root>
                                {user ? (
                                    <AvatarDisplay 
                                        userId={user.id} 
                                        username={user.username}
                                        hasAvatar={user.hasAvatar}
                                        size="small"
                                        refreshKey={avatarRefreshKey}
                                    />
                                ) : (
                                    <Avatar.Root className="AvatarRoot">
                                        <Avatar.Fallback className="AvatarFallback" delayMs={600}>U</Avatar.Fallback>
                                    </Avatar.Root>
                                )}
                            </Tooltip.Root>
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className="PopoverContent" sideOffset={5}>
                            <div className="PopoverContentInner">
                                <div className="user-info">
                                    <span className="username">{user?.username || "Utilisateur"}</span>
                                </div>
                                <button className="profile-button" onClick={() => navigate("/profile")}>
                                    <span>Mon profil</span>
                                </button>
                                <button className="theme-toggle-button" onClick={toggleTheme}>
                                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                                    <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
                                </button>
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