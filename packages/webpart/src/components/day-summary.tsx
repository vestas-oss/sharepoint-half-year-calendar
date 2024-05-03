import React, { useMemo } from "react";
import { useEvents } from "../hooks/useEvents";

type Props = {
    year: number;
    month: number;
    day: number;
    events: ReturnType<typeof useEvents>["events"];
};

export function DaySummary(props: Props) {
    const { year, month, day, events } = props;

    const date = new Date(year, month, day);
    const dayName = new Intl.DateTimeFormat("default", { weekday: "long" }).format(date);
    const monthName = new Intl.DateTimeFormat("default", { month: "long" }).format(date);

    const formatEvents = useMemo(() => {
        return (events ?? []).map(event => {
            return {
                start: event.start ?  new Intl.DateTimeFormat("default", { timeStyle: "short" } as any).format(event.start) : "",
                end: event.end ?  new Intl.DateTimeFormat("default", { timeStyle: "short" } as any).format(event.end) : "",
                title: event.title,
            }
        })
    }, [events]);

    return (
        <div>
            {dayName} {day} {monthName}, {year}
            {formatEvents.map((event, index) => (
                <div key={`event-${index}`}>
                    {event.start} {event.end} {event.title}
                </div>
            ))}
        </div>
    );
}
