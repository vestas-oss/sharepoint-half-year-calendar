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
            periodStart: new Date(period.year, period.half === "H1" ? 0 : 5, 1),
            periodEnd: new Date(period.year, period.half === "H1" ? 5 : 11, 31, 23, 59, 59),
        };
    }, [period]);

    const { data: events, isFetched } = useQuery({
        queryKey: ["half-year-calendar-events", period.year, period.half],
        queryFn: async () => {
            const lists = sp.web.lists;
            // Calendar list and not hidden
            const listsFilter = "BaseTemplate eq 106 and Hidden eq false and ItemCount gt 0";
            const listInfos = await lists.filter(listsFilter)();
            if (!listInfos || listInfos.length === 0) {
                return [];
            }
            const calendar = lists.getById(listInfos[0].Id);

            type SharePointEvent = {
                Title: string;
                EventDate: string;
                EndDate: string;
            };

            let items = new Array<SharePointEvent>();
            const isoString = (date: Date) => date.toISOString().split(".").shift() + "Z";
            const filter = (s: "Event" | "End") =>
                `${s}Date ge datetime'${isoString(periodStart)}' and ` +
                `${s}Date le datetime'${isoString(periodEnd)}'`;
            // Filter: starts or ends within period
            const calendarFilter = `(${filter("Event")}) or (${filter("End")})`;
            const selects = ["Title", "EventDate", "EndDate"];
            for await (const page of calendar.items.filter(calendarFilter).select(...selects)) {
                items = items.concat(page);
            }

            const events = items
                .map((item) => {
                    const start = item.EventDate;
                    const end = item.EndDate;
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
        <EventsContext.Provider value={{ isFetched, events: events ?? [] }}>
            {children}
        </EventsContext.Provider>
    );
}
