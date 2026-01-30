import "./styles/MyEventsPage.scss";
import { useState, useEffect } from "react";
import { getUserEvents, deleteEvent, updateEvent, createEvent, getEventRegistrants, registerForEvent, unregisterFromEvent } from "../API/event-actions";
import type { Event, User } from "../utils/types";
import Header from "../Components/Header";
import EventSlider from "../Components/EventSlider";
import EventDialog from "../Components/EventDialog";
import { useNavigate } from "react-router-dom";
import { logout } from "../API/auth-actions";
import { PlusIcon } from "@radix-ui/react-icons";

interface MyEventsPageProps {
    onLogout: () => void;
    token?: string;
    user: User | null;
}

export default function MyEventsPage({ onLogout, token, user }: MyEventsPageProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [seats, setSeats] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [registrants, setRegistrants] = useState<{ id: number; username: string }[]>([]);
    const [registrantsByEvent, setRegistrantsByEvent] = useState<Map<number, { id: number; username: string }[]>>(new Map());
    const navigate = useNavigate();

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
            
            // Charger les registrants pour chaque événement
            const registrantsMap = new Map<number, { id: number; username: string }[]>();
            for (const event of data) {
                try {
                    const eventRegistrants = await getEventRegistrants(token, event.id);
                    registrantsMap.set(event.id, eventRegistrants.registrants || []);
                } catch (error) {
                    console.error(`Erreur lors du chargement des inscrits pour l'événement ${event.id}:`, error);
                }
            }
            setRegistrantsByEvent(registrantsMap);
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

        if (!title || !date || !description || seats < 1) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        try {
            setLoading(true);
            
            if (editingEventId) {
                await updateEvent(token, editingEventId, { title, date, description, seats });
            } else {
                await createEvent(token, { title, date, description, seats });
            }
            
            await loadUserEvents();
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
            await loadUserEvents();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement :", error);
            alert("Erreur lors de la suppression de l'événement");
        } finally {
            setLoading(false);
        }
    };

    const handleEditEvent = (event: Event) => {
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
            setSelectedEvent(event);
            const eventRegistrants = await getEventRegistrants(token, event.id);
            setRegistrants(eventRegistrants);
            setDialogMode("view");
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Erreur lors de l'ouverture de l'événement :", error);
            alert("Erreur lors du chargement des inscrits");
        }
    };

    const handleCreateNew = () => {
        setTitle("");
        setDate("");
        setDescription("");
        setSeats(1);
        setEditingEventId(null);
        setSelectedEvent(null);
        setRegistrants([]);
        setDialogMode("create");
        setIsDialogOpen(true);
    };

    const handleRegisterEvent = async (eventId: number) => {
        if (!token) return;
        try {
            await registerForEvent(token, eventId);
            await loadUserEvents();
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    const handleUnregisterEvent = async (eventId: number) => {
        if (!token) return;
        try {
            await unregisterFromEvent(token, eventId);
            await loadUserEvents();
        } catch (error) {
            console.error("Erreur lors de la désinscription :", error);
        }
    };

    return (
        <div className="MyEventsPage">
            <div className="header">
                <Header onLogout={handle_disconnection} user={user} />
            </div>
            <div className="body">
                <h3>Mes événements</h3>
                <div>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : events.length === 0 ? (
                        <p className="no-events">Aucun événement pour le moment</p>
                    ) : (
                        <EventSlider 
                            events={events}
                            onRegister={handleRegisterEvent}
                            onUnregister={handleUnregisterEvent}
                            onEventClick={handleOpenEventView}
                            registrantsByEvent={registrantsByEvent}
                        />
                    )}
                </div>
                <button className="fab-button" onClick={handleCreateNew} aria-label="Créer un événement">
                    <PlusIcon />
                </button>
            </div>
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
                loading={loading}
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
                }}
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
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
    );
}
