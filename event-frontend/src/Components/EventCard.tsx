import "./styles/EventCard.scss";
import type { Event } from "../utils/types";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";

type Props = {
  event: Event;
  onDelete?: (eventId: number) => void;
  onEdit?: (event: Event) => void;
};

export default function EventCard({ event, onDelete, onEdit }: Props) {
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="event-card">
      <div className="content">
        <h3>{event.title}</h3>
        <p className="date">{formatDate(event.date)}</p>
        <p className="description">{event.description}</p>
      </div>
      <div className="manage">
        {onEdit && (
          <button className="edit" onClick={() => onEdit(event)} title="Modifier" aria-label="Modifier l'événement">
            <Pencil1Icon />
          </button>
        )}
        {onDelete && (
          <button className="delete" onClick={() => onDelete(event.id)} title="Supprimer" aria-label="Supprimer l'événement">
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
}
