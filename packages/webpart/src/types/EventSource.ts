import { useSharePoint } from "../hooks/useSharePoint";
import { Event } from "../types/Event";

export type EventSource = {
    name: string,
    title: string,
    fn: (context: ReturnType<typeof useSharePoint>, query: { start: Date, end: Date }, properties: any) => Promise<Array<Event>>;
};
