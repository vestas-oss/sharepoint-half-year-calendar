import { Period } from "../types/Period";
import { EventsContext } from "../contexts/EventsContext";
import React, { useMemo } from "react";
import { useSharePoint } from "../hooks/useSharePoint";
import { tokens } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";

type Props = React.PropsWithChildren<{
    period: Period;
}>;

export function EventsProvider(props: Props) {
    const { sp } = useSharePoint();
    const { children, period } = props;

    const { periodStart, periodEnd } = useMemo(() => {
        return {
            periodStart: new Date(period.year, period.half === "H1" ? 0 : 6, 31),
            periodEnd: new Date(period.year, period.half === "H1" ? 6 : 12, 31, 23, 59, 59),
        };
    }, [period]);

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

            type SharePointEvent = {
                Title: string;
                EventDate?: string;
                EndDate?: string;
            };

            let items = new Array<SharePointEvent>();
            for await (const page of calendar.items) {
                items = items.concat(page);
            }

            const events = items
                .map((item) => {
                    const start = item.EventDate ?? new Date().toISOString();
                    const end = item.EndDate ?? new Date().toISOString();
                    return {
                        title: item.Title,
                        start: new Date(start),
                        end: new Date(end),
                        color: tokens.colorBrandForegroundInvertedHover,
                    };
                })
                .filter((event) => event.start >= periodStart && event.end <= periodEnd)
                .sort((a, b) => a.start.getTime() - b.start.getTime());

            return events;
        },
    });

    return (
        <EventsContext.Provider value={{ isFetched, events: events ?? [] }}>{children}</EventsContext.Provider>
    );
}
