import "./styles/EventCard.scss";
import type { Event } from "../utils/types";

type Props = {
  event: Event;
  onRegister?: (eventId: number) => void;
  onUnregister?: (eventId: number) => void;
  onClick?: (event: Event) => void;
  registrants?: { id: number; username: string }[];
};

export default function EventCard({ event, onRegister, onUnregister, onClick, registrants }: Props) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.is_registered && onUnregister) {
      onUnregister(event.id);
    } else if (!event.is_registered && onRegister) {
      onRegister(event.id);
    }
  };

  const registrantsCount = registrants ? registrants.length : (event.registrants_count || 0);

  const isFull = event.seats !== undefined
    ? event.seats <= (registrantsCount + 1)
    : false;

  const remainingSeats = event.remaining_seats !== undefined
    ? event.remaining_seats
    : Math.max((event.seats ?? 0) - (registrantsCount + 1), 0);

  return (
    <div className="event-card" onClick={() => onClick?.(event)}>
      <div className="card-content">
        <h3 className="title">{event.title}</h3>
        <p className="date">{formatDate(event.date)}</p>
        
        <div className="registrants">
          <span className="count">{registrantsCount} inscrit{registrantsCount > 1 ? 's' : ''}</span>
          {event.seats !== undefined && (
            <span className="count"> · {remainingSeats} place{remainingSeats > 1 ? 's' : ''} restante{remainingSeats > 1 ? 's' : ''}</span>
          )}
        </div>

        {!event.is_owner && (
          <button 
            className={`register-btn ${event.is_registered ? 'registered' : ''}`}
            onClick={handleRegisterClick}
            disabled={isFull && !event.is_registered}
          >
            {event.is_registered ? 'Se désinscrire' : "S'inscrire"}
          </button>
        )}
      </div>
    </div>
  );
}
