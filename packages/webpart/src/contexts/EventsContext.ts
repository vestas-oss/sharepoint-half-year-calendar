import { createContext } from "react";
import { Event } from "../types/Event";

type EventsContext = {
    isFetched: boolean;
    events: Array<Event>;
    setFilter: (filter: string) => void,
};

export const EventsContext = createContext<EventsContext>({
    isFetched: false,
    events: [],
    setFilter: () => { },
});