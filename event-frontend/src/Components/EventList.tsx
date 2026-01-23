import "./styles/EventList.scss"
import type { Event } from "../utils/types";
import EventCard from "./EventCard";

interface EventListProps {
    events: Event[];
    onDelete?: (eventId: number) => void;
    onEdit?: (event: Event) => void;
}

export default function EventList({ events, onDelete, onEdit }: EventListProps) {
    return (
        <div className="events-container">
            {events.map((event) => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}