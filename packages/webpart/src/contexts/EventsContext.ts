import { createContext } from "react";
import { Event } from "../types/Event";
import { FacetResult } from "@orama/orama";

type EventsContext = {
    isFetched: boolean;
    events: Array<Event>;
    facets: FacetResult;
    setFilterText: (filterText: string) => void;
    setFilterOpen: (open: boolean) => void;
    setSelectedFacets: (facets: Record<string, Array<string>>) => void
};

export const EventsContext = createContext<EventsContext>({
    isFetched: false,
    events: [],
    facets: {},
    setFilterText: () => { },
    setFilterOpen: () => { },
    setSelectedFacets: () => { },
});