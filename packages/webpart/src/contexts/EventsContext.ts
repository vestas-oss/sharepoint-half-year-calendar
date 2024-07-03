import { createContext } from "react";
import { Event } from "../types/Event";
import { FacetResult } from "@orama/orama";
import { Period } from "../types/Period";

type EventsContext = {
    isFetched: boolean;
    events: Array<Event>;
    facets: FacetResult;
    period: Period;
    setFilterText: (filterText: string) => void;
    setFilterOpen: (open: boolean) => void;
    setSelectedFacets: (facets: Record<string, Array<string>>) => void
};

export const EventsContext = createContext<EventsContext>({
    isFetched: false,
    events: [],
    facets: {},
    period: { year: 2024, half: "H1" },
    setFilterText: () => { },
    setFilterOpen: () => { },
    setSelectedFacets: () => { },
});