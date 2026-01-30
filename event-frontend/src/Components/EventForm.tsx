import "./styles/EventForm.scss"
import type { EventFormProps } from "../utils/types";

export default function EventForm({
    title,
    date,
    description,
    onTitleChange,
    onDateChange,
    onDescriptionChange,
    onSubmit,
    buttonText = "Créer",
}: EventFormProps) {

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        // Si c'est déjà au format YYYY-MM-DD, retourner tel quel
        if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString.split('T')[0];
        // Si c'est au format DD/MM/YYYY
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateString;
    };

    return (
        <div className="form">
            <input
                placeholder="Titre"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
            />
            <input
                type="date"
                value={formatDateForInput(date)}
                onChange={(e) => onDateChange(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <button onClick={onSubmit}>{buttonText}</button>
        </div>
    );
}