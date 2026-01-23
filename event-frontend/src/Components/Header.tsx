import "./styles/Header.scss";
import { Avatar, Tooltip, Popover } from "radix-ui";
import { ExitIcon } from "@radix-ui/react-icons";

interface HeaderProps {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    return (
        <div className="Header">
            <h2>Nantral Plateform (du bled)</h2>
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