import toast from 'react-hot-toast';

// Toast de succès pour la connexion
export const toastLoginSuccess = (username: string) => {
  toast.success(`Bienvenue ${username} !`, {
    duration: 3000,
    position: 'top-right',
  });
};

// Toast de succès pour l'inscription
export const toastSignupSuccess = (username: string) => {
  toast.success(`Compte créé ! Bienvenue ${username} !`, {
    duration: 3000,
    position: 'top-right',
  });
};

// Toast de succès pour la déconnexion
export const toastLogoutSuccess = () => {
  toast.success('Déconnexion réussie', {
    duration: 2000,
    position: 'top-right',
  });
};

// Toast de succès pour création d'événement
export const toastEventCreated = () => {
  toast.success('Événement créé avec succès !', {
    duration: 3000,
    position: 'top-right',
  });
};

// Toast de succès pour modification d'événement
export const toastEventUpdated = () => {
  toast.success('Événement modifié avec succès !', {
    duration: 3000,
    position: 'top-right',
  });
};

// Toast de succès pour suppression d'événement
export const toastEventDeleted = () => {
  toast.success('Événement supprimé', {
    duration: 2500,
    position: 'top-right',
  });
};

// Toast de succès pour inscription à un événement
export const toastRegisteredToEvent = (eventTitle: string) => {
  toast.success(`Inscrit à "${eventTitle}" !`, {
    duration: 3000,
    position: 'top-right',
  });
};

// Toast de succès pour désinscription d'un événement
export const toastUnregisteredFromEvent = (eventTitle: string) => {
  toast.success(`Désinscrit de "${eventTitle}"`, {
    duration: 2500,
    position: 'top-right',
  });
};

// Toast d'erreur générique
export const toastError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  });
};

// Toast d'erreur pour connexion
export const toastLoginError = () => {
  toast.error('Identifiant ou mot de passe invalide', {
    duration: 4000,
    position: 'top-right',
  });
};

// Toast d'erreur pour inscription
export const toastSignupError = (message?: string) => {
  toast.error(message || 'Une erreur est survenue lors de l\'inscription', {
    duration: 4000,
    position: 'top-right',
  });
};

// Toast d'information
export const toastInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
  });
};

// Toast de chargement
export const toastLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

// Fermer un toast spécifique
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
