import { createContext } from "react";
import { Event } from "../types/Event";
import { FacetResult } from "@orama/orama";

type EventsContext = {
    isFetched: boolean;
    events: Array<Event>;
    facets: FacetResult;
    setFilterText: (filterText: string) => void,
    setFilter: (filter: boolean) => void,
};

export const EventsContext = createContext<EventsContext>({
    isFetched: false,
    events: [],
    setFilterText: () => { },
    setFilter: () => { },
    facets: {}
});