import { SPFx } from "@pnp/sp";
import { Event } from "../types/Event";
import { useSharePoint } from "../hooks/useSharePoint";

export type EventSource = {
    name: string,
    title: string,
} & ({
    fn: (context: ReturnType<typeof useSharePoint>, query: { start: Date, end: Date }, properties: any) => Promise<Array<Event>>;
    isDefault: true;
} | {
    fn: (sp: Parameters<typeof SPFx>[0], query: { start: Date, end: Date }, properties: any) => Promise<Array<Event>>;
});
