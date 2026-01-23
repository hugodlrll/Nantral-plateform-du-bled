import "./styles/HomePage.scss";
import { useState, useEffect } from "react";
import { logout } from "../API/auth-actions";
import { createEvent, getUserEvents, deleteEvent, updateEvent } from "../API/event-actions";
import { useNavigate } from "react-router-dom";
import type { Event } from "../utils/types";
import Header from "../Components/Header";
import EventDialog from "../Components/EventDialog";
import EventList from "../Components/EventList";

interface HomePageProps {
    onLogout: () => void;
    token?: string;
}

export default function HomePage({ onLogout, token }: HomePageProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    // Charger les événements au montage
    useEffect(() => {
        if (token) {
            loadUserEvents();
        }
    }, [token]);

    const loadUserEvents = async () => {
        try {
            setLoading(true);
            if (!token) return;
            const data = await getUserEvents(token);
            setEvents(data);
        } catch (error) {
            console.error("Erreur lors du chargement des événements :", error);
        } finally {
            setLoading(false);
        }
    };

    const handle_disconnection = () => {
        logout();
        onLogout();
        navigate("/");
    };

    const addEvent = async () => {
        if (!token) {
            alert("Vous devez être connecté pour créer un événement");
            return;
        }

        if (!title || !date || !description) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        try {
            setLoading(true);
            
            if (editingEventId) {
                // Mode édition
                await updateEvent(token, editingEventId, { title, date, description });
            } else {
                // Mode création
                await createEvent(token, { title, date, description });
            }
            
            // Recharger les événements
            await loadUserEvents();
            // Réinitialiser le formulaire
            setTitle("");
            setDate("");
            setDescription("");
            setEditingEventId(null);
        } catch (error) {
            console.error("Erreur lors de la création/modification de l'événement :", error);
            alert("Erreur lors de la création/modification de l'événement");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (!token) return;

        if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            return;
        }

        try {
            setLoading(true);
            await deleteEvent(token, eventId);
            // Recharger les événements
            await loadUserEvents();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement :", error);
            alert("Erreur lors de la suppression de l'événement");
        } finally {
            setLoading(false);
        }
    };

    const handleEditEvent = (event: Event) => {
        // Pré-remplir le formulaire avec les données de l'événement
        setTitle(event.title);
        setDate(event.date);
        setDescription(event.description);
        setEditingEventId(event.id);
        setIsDialogOpen(true);
    };

    return (
        <div className="HomePage">
            <div className="header">
                <Header onLogout={handle_disconnection} />
            </div>
            <div className="body">
                <h3>Bienvenue sur Nantral Plateforme (du bled) !</h3>
                <div>
                    <h3>Mes événements</h3>
                    {loading ? <p>Chargement...</p> : <EventList events={events} onDelete={handleDeleteEvent} onEdit={handleEditEvent} />}
                </div>
            </div>
            <EventDialog
                title={title}
                date={date}
                description={description}
                onTitleChange={setTitle}
                onDateChange={setDate}
                onDescriptionChange={setDescription}
                onSubmit={addEvent}
                loading={loading}
                mode={editingEventId ? "edit" : "create"}
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        // Réinitialiser quand on ferme le dialogue
                        setTitle("");
                        setDate("");
                        setDescription("");
                        setEditingEventId(null);
                    }
                }}
            />
        </div>
    );
}