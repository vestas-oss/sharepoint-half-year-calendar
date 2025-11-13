import "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { useMemo } from "react";
import { EventsContext } from "../contexts/EventsContext";
import { useContext } from "react";
import { Event } from "../types/Event";

type IRange = {
    start: Date,
    end: Date,
}

// Returns boolean if range1 is included in range2
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

// Returns the intersection of two date ranges
function getRangeIntersection(
    range1: IRange,
    range2: IRange,
): number {
    const start1 = range1.start;
    const end1 = range1.end;
    const start2 = range2.start;
    const end2 = range2.end;

    // Check if ranges overlap
    if (start1 > end2 || start2 > end1) {
        return 0;
    }

    // Calculate intersection bounds
    const intersectionStart = new Date(Math.max(start1.getTime(), start2.getTime()));
    const intersectionEnd = new Date(Math.min(end1.getTime(), end2.getTime()));
    const durationMs = intersectionEnd.getTime() - intersectionStart.getTime();

    return durationMs;
}

export const useEvents = (year: number, month: number, day?: number): { isFetched: boolean, events?: Array<Event> } => {
    const { isFetched, events } = useContext(EventsContext);

    const dayEvents = useMemo(() => {
        if (!isFetched) {
            return [];
        }

        return events?.filter((event) => {
            if (!day) {
                return false;
            }

            const eventRange = {
                start: new Date(event.start),
                end: new Date(event.end)
            };

            if (event.isAllDay) {
                const dayRange = {
                    start: new Date(Date.UTC(year, month, day)),
                    end: new Date(Date.UTC(year, month, day, 23, 59, 59))
                };

                const overlap = isRangeOverlap(dayRange, eventRange);
                if (overlap) {
                    const intersection = getRangeIntersection(dayRange, eventRange);
                    // Note some all day events ends minute 59, other next day at 00
                    if (intersection === 0) {
                        return false;
                    }
                }
                return overlap;
            }

            const dayRange = {
                start: new Date(year, month, day),
                end: new Date(year, month, day, 23, 59, 59),
            };

            return isRangeOverlap(eventRange, dayRange);
        });
    }, [events, year, month, day, isFetched]);

    return {
        events: dayEvents,
        isFetched,
    };
};