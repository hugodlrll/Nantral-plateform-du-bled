const API_BASE_URL = "http://localhost:5000/api";

// Créer un événement
export const createEvent = async (token: string, eventData: { title: string; date: string; description: string; seats: number }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la création de l'événement");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur createEvent:", error);
        throw error;
    }
};

// Récupérer tous les événements
export const getAllEvents = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des événements");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur getAllEvents:", error);
        throw error;
    }
};

// Récupérer les événements de l'utilisateur
export const getUserEvents = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/my-events`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération de vos événements");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur getUserEvents:", error);
        throw error;
    }
};

// Supprimer un événement
export const deleteEvent = async (token: string, eventId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'événement");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur deleteEvent:", error);
        throw error;
    }
};

// Mettre à jour un événement
export const updateEvent = async (token: string, eventId: number, eventData: { title: string; date: string; description: string; seats: number }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour de l'événement");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur updateEvent:", error);
        throw error;
    }
};

// S'inscrire à un événement
export const registerForEvent = async (token: string, eventId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'inscription");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur registerForEvent:", error);
        throw error;
    }
};

// Se désinscrire d'un événement
export const unregisterFromEvent = async (token: string, eventId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la désinscription");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur unregisterFromEvent:", error);
        throw error;
    }
};

// Récupérer la liste des inscrits
export const getEventRegistrants = async (token: string, eventId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}/registrants`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des inscrits");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur getEventRegistrants:", error);
        throw error;
    }
};
