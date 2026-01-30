import "./styles/HomePage.scss";
import { useState, useEffect, useCallback } from "react";
import { logout } from "../API/auth-actions";
import { createEvent, getAllEvents, deleteEvent, updateEvent, registerForEvent, unregisterFromEvent, getEventRegistrants } from "../API/event-actions";
import { useNavigate } from "react-router-dom";
import type { Event, User } from "../utils/types";
import Header from "../Components/Header";
import EventDialog from "../Components/EventDialog";
import EventSlider from "../Components/EventSlider";

interface HomePageProps {
    onLogout: () => void;
    token?: string;
    user: User | null;
}

export default function HomePage({ onLogout, token, user }: HomePageProps) {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [seats, setSeats] = useState(1);
    const [loadingAllEvents, setLoadingAllEvents] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [registrants, setRegistrants] = useState<{ id: number; username: string }[]>([]);
    const [registrantsByEvent, setRegistrantsByEvent] = useState<Map<number, { id: number; username: string }[]>>(new Map());
    const navigate = useNavigate();

    const loadAllEvents = useCallback(async () => {
        try {
            setLoadingAllEvents(true);
            if (!token) return;
            const data = await getAllEvents(token);
            setAllEvents(data);
            
            // Charger les inscrits pour chaque événement
            const registrantsMap = new Map();
            for (const event of data) {
                try {
                    const result = await getEventRegistrants(token, event.id);
                    registrantsMap.set(event.id, result.registrants || []);
                } catch (error) {
                    console.error(`Erreur lors du chargement des inscrits pour l'événement ${event.id}:`, error);
                    registrantsMap.set(event.id, []);
                }
            }
            setRegistrantsByEvent(registrantsMap);
        } catch (error) {
            console.error("Erreur lors du chargement de tous les événements :", error);
        } finally {
            setLoadingAllEvents(false);
        }
    }, [token]);

    // Charger les événements au montage
    useEffect(() => {
        if (token) {
            loadAllEvents();
        }
    }, [token, loadAllEvents]);

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

        if (!title || !date || !description || seats < 1) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        try {
            setActionLoading(true);
            
            if (editingEventId) {
                // Mode édition
                await updateEvent(token, editingEventId, { title, date, description, seats });
            } else {
                // Mode création
                await createEvent(token, { title, date, description, seats });
            }
            
            // Recharger les événements
            await loadAllEvents();
            // Réinitialiser le formulaire
            setTitle("");
            setDate("");
            setDescription("");
            setSeats(1);
            setEditingEventId(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de la création/modification de l'événement :", error);
            alert("Erreur lors de la création/modification de l'événement");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (!token) return;

        if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            return;
        }

        try {
            setActionLoading(true);
            await deleteEvent(token, eventId);
            // Recharger les événements
            await loadAllEvents();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement :", error);
            alert("Erreur lors de la suppression de l'événement");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegisterEvent = async (eventId: number) => {
        if (!token) return;
        
        try {
            setActionLoading(true);
            await registerForEvent(token, eventId);
            await loadAllEvents();
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert("Erreur lors de l'inscription");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnregisterEvent = async (eventId: number) => {
        if (!token) return;
        
        try {
            setActionLoading(true);
            await unregisterFromEvent(token, eventId);
            await loadAllEvents();
        } catch (error) {
            console.error("Erreur lors de la désinscription :", error);
            alert("Erreur lors de la désinscription");
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditEvent = (event: Event) => {
        // Pré-remplir le formulaire avec les données de l'événement
        setTitle(event.title);
        setDate(event.date);
        setDescription(event.description);
        setSeats(event.seats ?? 1);
        setEditingEventId(event.id);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleOpenEventView = async (event: Event) => {
        if (!token) return;
        try {
            setActionLoading(true);
            setSelectedEvent(event);
            const data = await getEventRegistrants(token, event.id);
            setRegistrants(data.registrants || []);
            setDialogMode("view");
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Erreur lors de l'ouverture de l'événement :", error);
            alert("Erreur lors du chargement des inscrits");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="HomePage">
            <div className="header">
                <Header onLogout={handle_disconnection} user={user} />
            </div>
            <div className="body">
                {loadingAllEvents ? <p>Chargement...</p> : (
                    <EventSlider 
                        events={allEvents} 
                        onRegister={handleRegisterEvent} 
                        onUnregister={handleUnregisterEvent} 
                        onEventClick={handleOpenEventView}
                        registrantsByEvent={registrantsByEvent}
                    />
                )}
                <EventDialog
                title={title}
                date={date}
                description={description}
                seats={seats}
                onTitleChange={setTitle}
                onDateChange={setDate}
                onDescriptionChange={setDescription}
                onSeatsChange={setSeats}
                onSubmit={addEvent}
                loading={actionLoading}
                mode={dialogMode}
                viewEvent={selectedEvent || undefined}
                registrants={registrants}
                onEditClick={() => {
                    if (!selectedEvent) return;
                    handleEditEvent(selectedEvent);
                }}
                onDeleteClick={() => {
                    if (!selectedEvent) return;
                    handleDeleteEvent(selectedEvent.id);
                    setIsDialogOpen(false);
                }}
                onRegisterClick={() => {
                    if (!selectedEvent || !token) return;
                    handleRegisterEvent(selectedEvent.id);
                    setIsDialogOpen(false);
                }}
                onUnregisterClick={() => {
                    if (!selectedEvent || !token) return;
                    handleUnregisterEvent(selectedEvent.id);
                    setIsDialogOpen(false);
                }}
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        // Réinitialiser quand on ferme le dialogue
                        setTitle("");
                        setDate("");
                        setDescription("");
                        setSeats(1);
                        setEditingEventId(null);
                        setSelectedEvent(null);
                        setRegistrants([]);
                        setDialogMode("create");
                    }
                }}
            />
            </div>
        </div>
    );
}