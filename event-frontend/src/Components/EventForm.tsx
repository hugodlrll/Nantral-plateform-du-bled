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
}: EventFormProps) {
    return (
        <div className="form">
            <input
                placeholder="Titre"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <button onClick={onSubmit}>Créer</button>
        </div>
    );
}