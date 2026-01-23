import "./styles/EventList.scss"
import type { Event } from "../utils/types";
import EventCard from "./EventCard";

interface EventListProps {
    events: Event[];
}

export default function EventList({ events }: EventListProps) {
    return (
        <div className="events-container">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}