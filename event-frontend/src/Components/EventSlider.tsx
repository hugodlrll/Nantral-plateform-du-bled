import "./styles/EventSlider.scss";
import { useState, useEffect } from "react";
import type { Event } from "../utils/types";
import EventCard from "./EventCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

type Props = {
  events: Event[];
  onRegister: (eventId: number) => void;
  onUnregister: (eventId: number) => void;
  onEventClick: (event: Event) => void;
  registrantsByEvent: Map<number, { id: number; username: string }[]>;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

const EVENTS_PER_PAGE = 6;

export default function EventSlider({ events, onRegister, onUnregister, onEventClick, registrantsByEvent, currentPage: externalPage, onPageChange }: Props) {
  const [internalPage, setInternalPage] = useState(0);
  const currentPage = externalPage !== undefined ? externalPage : internalPage;
  const setCurrentPage = onPageChange || setInternalPage;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = currentPage * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isMobile) {
    return (
      <div className="event-slider mobile">
        <div className="events-grid-mobile">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={onRegister}
              onUnregister={onUnregister}
              onClick={onEventClick}
              registrants={registrantsByEvent.get(event.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="event-slider desktop">
      <button 
        className="slider-arrow left" 
        onClick={goToPrevPage}
        disabled={currentPage === 0}
        aria-label="Page précédente"
      >
        <ChevronLeftIcon />
      </button>

      <div className="events-grid">
        {currentEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegister}
            onUnregister={onUnregister}
            onClick={onEventClick}
            registrants={registrantsByEvent.get(event.id)}
          />
        ))}
      </div>

      <button 
        className="slider-arrow right" 
        onClick={goToNextPage}
        disabled={currentPage === totalPages - 1}
        aria-label="Page suivante"
      >
        <ChevronRightIcon />
      </button>

      <div className="pagination-dots">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`dot ${i === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
