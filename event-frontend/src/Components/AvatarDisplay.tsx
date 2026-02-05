import React, { useState } from 'react';
import './styles/AvatarDisplay.scss';

interface AvatarDisplayProps {
    userId: string;
    username: string;
    hasAvatar?: boolean;
    size?: 'small' | 'medium' | 'large';
    refreshKey?: number | string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
    userId, 
    username, 
    hasAvatar = false, 
    size = 'medium',
    refreshKey = ''
}) => {
    const [error, setError] = useState(false);

    const imageSrc = hasAvatar && !error ? `/api/avatar/${userId}?v=${refreshKey}` : null;

    const handleImageError = () => {
        setError(true);
    };

    const getInitials = () => {
        return username
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`avatar-display avatar-${size}`}>
            {imageSrc ? (
                <img 
                    src={imageSrc} 
                    alt={username}
                    onError={handleImageError}
                    className="avatar-image"
                />
            ) : (
                <div className="avatar-initials">
                    {getInitials()}
                </div>
            )}
        </div>
    );
};
