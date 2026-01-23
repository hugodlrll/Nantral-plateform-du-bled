import { useState, useEffect } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import EventForm from "./EventForm";
import "./styles/EventDialog.scss";

interface EventDialogProps {
    title: string;
    date: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    mode?: "create" | "edit";
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function EventDialog({
    title,
    date,
    description,
    onTitleChange,
    onDateChange,
    onDescriptionChange,
    onSubmit,
    loading = false,
    mode = "create",
    isOpen,
    onOpenChange,
}: EventDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Utiliser isOpen si fourni, sinon utiliser l'état interne
    const open = isOpen !== undefined ? isOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const handleSubmit = () => {
        onSubmit();
        setOpen(false);
    };

    const dialogTitle = mode === "edit" ? "Modifier l'événement" : "Créer un nouvel événement";
    const dialogDescription = mode === "edit" 
        ? "Modifiez les informations de votre événement"
        : "Remplissez le formulaire pour créer votre événement";

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
                    <Dialog.Description className="dialog-description">
                        {dialogDescription}
                    </Dialog.Description>

                    <div className="dialog-form">
                        <EventForm
                            title={title}
                            date={date}
                            description={description}
                            onTitleChange={onTitleChange}
                            onDateChange={onDateChange}
                            onDescriptionChange={onDescriptionChange}
                            onSubmit={handleSubmit}
                            buttonText={mode === "edit" ? "Modifier" : "Créer"}
                        />
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
