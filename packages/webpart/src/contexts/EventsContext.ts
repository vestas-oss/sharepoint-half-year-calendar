import { createContext } from "react";
import { Event } from "../types/Event";

type EventsContext = {
    isFetched: boolean;
    events: Array<Event>;
};

export const EventsContext = createContext<EventsContext>({ isFetched: false, events: [] });