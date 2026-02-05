import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AvatarDisplay } from '../Components/AvatarDisplay';
import { AvatarUpload } from '../Components/AvatarUpload';
import { updateUsername, updateEmail, updatePassword } from '../API/auth-actions';
import { toastSuccess, toastError } from '../utils/toasts';
import type { User } from '../utils/types';
import './styles/ProfilePage.scss';

interface ProfilePageProps {
    user: User | null;
    token: string | null;
    onUserUpdate: (updatedUser: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, token, onUserUpdate }) => {
    const navigate = useNavigate();
    const [avatarUpdated, setAvatarUpdated] = useState(false);
    const [editingField, setEditingField] = useState<'username' | 'email' | 'password' | null>(null);
    const [formValues, setFormValues] = useState({ username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/connect');
        }
        if (user) {
            setFormValues(prev => ({ ...prev, username: user.username, email: user.email || '' }));
        }
    }, [token, navigate, user]);

    const handleAvatarUploadSuccess = () => {
        setAvatarUpdated(prev => !prev);
        if (user) {
            onUserUpdate({ ...user, hasAvatar: true });
        }
    };

    if (!user) {
        return null;
    }

    const handleInputChange = (field: string, value: string) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateUsername = async () => {
        if (!formValues.username.trim()) {
            toastError('Le nom d\'utilisateur ne peut pas être vide');
            return;
        }
        
        setIsLoading(true);
        try {
            const updatedUser = await updateUsername(formValues.username);
            onUserUpdate(updatedUser);
            setEditingField(null);
            toastSuccess('Nom d\'utilisateur mis à jour');
        } catch (error) {
            toastError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!formValues.email.trim()) {
            toastError('L\'email ne peut pas être vide');
            return;
        }
        
        setIsLoading(true);
        try {
            const updatedUser = await updateEmail(formValues.email);
            onUserUpdate(updatedUser);
            setEditingField(null);
            toastSuccess('Email mis à jour');
        } catch (error) {
            toastError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!formValues.currentPassword || !formValues.newPassword) {
            toastError('Tous les champs de mot de passe sont requis');
            return;
        }
        
        if (formValues.newPassword.length < 6) {
            toastError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (formValues.newPassword !== formValues.confirmPassword) {
            toastError('Les mots de passe ne correspondent pas');
            return;
        }
        
        setIsLoading(true);
        try {
            await updatePassword(formValues.currentPassword, formValues.newPassword);
            setEditingField(null);
            setFormValues(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            toastSuccess('Mot de passe mis à jour');
        } catch (error) {
            toastError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Mon Profil</h1>
                    <button onClick={() => navigate('/home')} className="back-button">
                        ← Retour
                    </button>
                </div>

                <div className="profile-content">
                    <div className="avatar-section">
                        <AvatarDisplay 
                            userId={user.id}
                            username={user.username}
                            hasAvatar={user.hasAvatar || avatarUpdated}
                            size="large"
                            refreshKey={avatarUpdated ? new Date().getTime() : ''}
                        />
                        <AvatarUpload onSuccess={handleAvatarUploadSuccess} />
                    </div>

                    <div className="user-info-section">
                        <div className="info-group">
                            <label>Nom d'utilisateur</label>
                            {editingField === 'username' ? (
                                <div className="edit-field">
                                    <input
                                        type="text"
                                        value={formValues.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <div className="button-group">
                                        <button onClick={handleUpdateUsername} disabled={isLoading} className="save-btn">
                                            {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
                                        </button>
                                        <button onClick={() => setEditingField(null)} disabled={isLoading} className="cancel-btn">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="display-field">
                                    <p>{user.username}</p>
                                    <button onClick={() => setEditingField('username')} className="edit-btn">Modifier</button>
                                </div>
                            )}
                        </div>

                        <div className="info-group">
                            <label>Email</label>
                            {editingField === 'email' ? (
                                <div className="edit-field">
                                    <input
                                        type="email"
                                        value={formValues.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <div className="button-group">
                                        <button onClick={handleUpdateEmail} disabled={isLoading} className="save-btn">
                                            {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
                                        </button>
                                        <button onClick={() => setEditingField(null)} disabled={isLoading} className="cancel-btn">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="display-field">
                                    <p>{user.email || 'Non défini'}</p>
                                    <button onClick={() => setEditingField('email')} className="edit-btn">Modifier</button>
                                </div>
                            )}
                        </div>

                        <div className="info-group">
                            <label>Mot de passe</label>
                            {editingField === 'password' ? (
                                <div className="edit-field">
                                    <input
                                        type="password"
                                        placeholder="Mot de passe actuel"
                                        value={formValues.currentPassword}
                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Nouveau mot de passe"
                                        value={formValues.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirmer le mot de passe"
                                        value={formValues.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <div className="button-group">
                                        <button onClick={handleUpdatePassword} disabled={isLoading} className="save-btn">
                                            {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
                                        </button>
                                        <button onClick={() => setEditingField(null)} disabled={isLoading} className="cancel-btn">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="display-field">
                                    <p>••••••••</p>
                                    <button onClick={() => setEditingField('password')} className="edit-btn">Modifier</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
