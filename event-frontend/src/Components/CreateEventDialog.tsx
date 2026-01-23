import { useState } from "react";
import { Dialog } from "radix-ui";
import { PlusIcon } from "@radix-ui/react-icons";
import EventForm from "./EventForm";
import "./styles/CreateEventDialog.scss";

interface CreateEventDialogProps {
    title: string;
    date: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
}

export default function CreateEventDialog({
    title,
    date,
    description,
    onTitleChange,
    onDateChange,
    onDescriptionChange,
    onSubmit,
    loading = false,
}: CreateEventDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        onSubmit();
        setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="fab-button" aria-label="Créer un événement" title="Créer un événement">
                    <PlusIcon />
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                    <Dialog.Title className="dialog-title">Créer un nouvel événement</Dialog.Title>
                    <Dialog.Description className="dialog-description">
                        Remplissez le formulaire pour créer votre événement
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
                        />
                    </div>

                    <Dialog.Close asChild>
                        <button className="dialog-close-button" aria-label="Fermer">
                            ✕
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
