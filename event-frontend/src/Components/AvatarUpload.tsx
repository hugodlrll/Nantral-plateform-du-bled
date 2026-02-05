import React, { useRef, useState } from 'react';
import './styles/AvatarUpload.scss';
import { toastError, toastSuccess } from '../utils/toasts';

interface AvatarUploadProps {
    onSuccess?: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ onSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toastError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toastError('File size must be less than 5 MB');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const token = localStorage.getItem('token');
            const response = await fetch('/api/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload avatar');
            }

            toastSuccess('Avatar updated successfully');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Avatar upload error:', error);
            toastError('Failed to upload avatar');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="avatar-upload">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isLoading}
                style={{ display: 'none' }}
            />
            <button 
                onClick={handleClick} 
                disabled={isLoading}
                className="avatar-button"
            >
                {isLoading ? 'Uploading...' : 'Upload Avatar'}
            </button>
        </div>
    );
};
