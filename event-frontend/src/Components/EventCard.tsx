import "./styles/EventCard.scss";
import type { Event } from "../utils/types";
import { useState } from "react";

type Props = {
  event: Event;
  onRegister?: (eventId: number) => void;
  onUnregister?: (eventId: number) => void;
  onClick?: (event: Event) => void;
  registrants?: { id: number; username: string }[];
};

export default function EventCard({ event, onRegister, onUnregister, onClick }: Props) {

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

  return (
    <div className="event-card" onClick={() => onClick?.(event)}>
      <div className="card-content">
        <h3 className="title">{event.title}</h3>
        <p className="date">{formatDate(event.date)}</p>
        
        <div className="registrants">
          <span className="count">{event.registrants_count || 0} inscrit{(event.registrants_count || 0) > 1 ? 's' : ''}</span>
        </div>

        {!event.is_owner && (
          <button 
            className={`register-btn ${event.is_registered ? 'registered' : ''}`}
            onClick={handleRegisterClick}
          >
            {event.is_registered ? 'Se désinscrire' : "S'inscrire"}
          </button>
        )}
      </div>
    </div>
  );
}
