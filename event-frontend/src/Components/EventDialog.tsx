import { useState } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon, PlusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import EventForm from "./EventForm";
import type { Event } from "../utils/types";
import "./styles/EventDialog.scss";

interface EventDialogProps {
    title: string;
    date: string;
    description: string;
    seats: number;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSeatsChange: (value: number) => void;
    onSubmit: () => void;
    loading?: boolean;
    mode?: "create" | "edit" | "view";
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    viewEvent?: Event;
    registrants?: { id: number; username: string }[];
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    onRegisterClick?: () => void;
    onUnregisterClick?: () => void;
}

export default function EventDialog({
    title,
    date,
    description,
    seats,
    onTitleChange,
    onDateChange,
    onDescriptionChange,
    onSeatsChange,
    onSubmit,
    mode = "create",
    isOpen,
    onOpenChange,
    viewEvent,
    registrants = [],
    onEditClick,
    onDeleteClick,
    onRegisterClick,
    onUnregisterClick,
}: EventDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = isOpen !== undefined ? isOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const handleSubmit = () => {
        onSubmit();
        setOpen(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const dialogTitle = mode === "edit" ? "Modifier l'événement" : mode === "view" ? viewEvent?.title || "Détails de l'événement" : "Créer un nouvel événement";
    const dialogDescription = mode === "edit" 
        ? "Modifiez les informations de votre événement"
        : mode === "view"
        ? ""
        : "Remplissez le formulaire pour créer votre événement";

    const isFull = viewEvent?.seats !== undefined
        ? viewEvent.seats <= ((viewEvent.registrants_count || 0) + 1)
        : false;

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            {mode === "create" && (
                <Dialog.Trigger asChild>
                    <button className="fab-button" aria-label="Créer un événement" title="Créer un événement">
                        <PlusIcon />
                    </button>
                </Dialog.Trigger>
            )}
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                    <Dialog.Title className="dialog-title">{dialogTitle}</Dialog.Title>
                    {dialogDescription && (
                        <Dialog.Description className="dialog-description">
                            {dialogDescription}
                        </Dialog.Description>
                    )}

                    <div className="dialog-form">
                        {mode === "view" && viewEvent ? (
                            <div className="event-details">
                                <div className="detail-item">
                                    <label>Date:</label>
                                    <p>{formatDate(viewEvent.date)}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Description:</label>
                                    <p>{viewEvent.description}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Places:</label>
                                    <p>{viewEvent.seats ?? 0} (restantes: {viewEvent.remaining_seats ?? Math.max((viewEvent.seats ?? 0) - ((viewEvent.registrants_count || 0) + 1), 0)})</p>
                                </div>
                                <div className="detail-item">
                                    <label>Organisateur:</label>
                                    <p>{viewEvent.created_by_username}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Inscrits ({registrants.length}):</label>
                                    {registrants.length > 0 ? (
                                        <ul className="registrants-list">
                                            {registrants.map((registrant) => (
                                                <li key={registrant.id}>{registrant.username}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-registrants">Aucun inscrit pour le moment</p>
                                    )}
                                </div>

                                <div className="action-buttons">
                                    {viewEvent.is_owner ? (
                                        <>
                                            <button className="btn-edit" onClick={onEditClick}>
                                                <Pencil1Icon /> Modifier
                                            </button>
                                            <button className="btn-delete" onClick={onDeleteClick}>
                                                <TrashIcon /> Supprimer
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {viewEvent.is_registered ? (
                                                <button className="btn-unregister" onClick={onUnregisterClick}>
                                                    Se désinscrire
                                                </button>
                                            ) : (
                                                <button className="btn-register" onClick={onRegisterClick} disabled={isFull}>
                                                    S'inscrire
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <EventForm
                                title={title}
                                date={date}
                                description={description}
                                seats={seats}
                                onTitleChange={onTitleChange}
                                onDateChange={onDateChange}
                                onDescriptionChange={onDescriptionChange}
                                onSeatsChange={onSeatsChange}
                                onSubmit={handleSubmit}
                                buttonText={mode === "edit" ? "Modifier" : "Créer"}
                            />
                        )}
                    </div>

                    <Dialog.Close asChild>
                        <button className="dialog-close-button" aria-label="Fermer">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
