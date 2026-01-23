import "./styles/EventCard.scss";
import type { Event } from "../utils/types";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.date}</p>
      <p>{event.description}</p>
    </div>
  );
}
