import "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { useMemo } from "react";
import { EventsContext } from "../contexts/EventsContext";
import { useContext } from "react";
import { Event } from "../types/Event";

type IRange = {
    start: number | Date
    end: number | Date
}

function isRangeOverlap(
    range1: IRange,
    range2: IRange,
): boolean {
    const x1 = range1.start;
    const x2 = range1.end;
    const y1 = range2.start;
    const y2 = range2.end;

    return x1 <= y2 && y1 <= x2
}

export const useEvents = (year: number, month: number, day?: number): { isFetched: boolean, events?: Array<Event> } => {
    const { isFetched, events } = useContext(EventsContext);

    const dayEvents = useMemo(() => {
        if (!isFetched) {
            return [];
        }
        return events?.filter((event) => {
            const eventRange = {
                start: new Date(event.start),
                end: new Date(event.end)
            };
            const dayRange = {
                start: new Date(year, month, day),
                end: new Date(year, month, day, 23, 59, 59)
            }
            return isRangeOverlap(eventRange, dayRange);
        });
    }, [events, year, month, day, isFetched]);

    return {
        events: dayEvents,
        isFetched,
    };
};