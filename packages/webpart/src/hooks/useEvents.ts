import { useQuery } from "@tanstack/react-query";
import { useSharePoint } from "./useSharePoint";
import "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { useMemo } from "react";


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

type Event = {
    title: string;
    start?: Date;
    end?: Date;
    color?: string;
}

export const useEvents = (year: number, month: number, day?: number): { isPending: boolean, events?: Array<Event> } => {
    const { sp } = useSharePoint();

    const { data: events, isFetched } = useQuery({
        queryKey: ["half-year-calendar-events"],
        queryFn: async () => {
            const lists = sp.web.lists;
            // Calendar list and not hidden
            const filter = "BaseTemplate eq 106 and Hidden eq false and ItemCount gt 0";
            const listInfos = await lists.filter(filter)();
            if (!listInfos || listInfos.length === 0) {
                return [];
            }
            const calendar = lists.getById(listInfos[0].Id);

            type SharePointEvent = { Title: string, Start?: string, EventDate?: string, End?: string, EndDate?: string };
            const items = await calendar.items.getAll<SharePointEvent>();
            return items.map((item) => {
                const start = item.Start ?? item.EventDate ?? new Date().toISOString();
                const end = item.End ?? item.EndDate ?? new Date().toISOString();
                return {
                    title: item.Title,
                    start: new Date(start),
                    end: new Date(end),
                };
            });
        },
    });

    const dayEvents = useMemo(() => {
        if (!isFetched) {
            return [];
        }
        return events?.filter((event) => {
            const range1 = { start: new Date(event.start), end: new Date(event.end) };
            const range2 = { start: new Date(year, month, day), end: new Date(year, month, day, 23, 59, 59) }
            return isRangeOverlap(range1, range2);
        });
    }, [events, year, month, day, isFetched]);

    return {
        events: dayEvents,
        isPending: !isFetched,
    };
};