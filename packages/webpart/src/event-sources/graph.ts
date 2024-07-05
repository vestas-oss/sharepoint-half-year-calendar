import { useSharePoint } from "../hooks/useSharePoint";
import { Event } from "../types/Event";

// https://learn.microsoft.com/en-us/graph/api/calendar-list-events?view=graph-rest-1.0&tabs=http
type Properties = {
    color: string,
    // user?: string;
    // calendar?: string;
    // group?: string;
}

type GraphEvent = {
    start: {
        dateTime: "string",
        timeZone: "string",
    },
    end: {
        dateTime: "string",
        timeZone: "string",
    },
    webLink: string,
    subject: string,
}

export const graph = {
    name: "graph",
    title: "Graph Calendar",
    isDefault: true as const,
    fn: async (context: ReturnType<typeof useSharePoint>, query: { start: Date, end: Date }, properties?: Properties): Promise<Array<Event>> => {
        const { spfx } = context;

        if (!spfx?.graph) {
            console.log(`${graph.name}: warning graph client not set`);
            return [];
        }

        const client = await spfx.graph.getClient("3");

        const dateFilter = (s: "start" | "end") =>
            `${s}/dateTime ge '${query.start.toISOString()}' and ${s}/dateTime le '${query.end.toISOString()}'`;

        const filter = `(${dateFilter("start")}) or (${dateFilter("end")})`;
        const events: { value: Array<GraphEvent> } = await client.api("/me/calendar/events").filter(filter).version("v1.0").get();

        return events.value.map((e) => {
            return {
                title: e.subject,
                start: new Date(e.start.dateTime + "Z"),
                end: new Date(e.end.dateTime + "Z"),
                color: properties?.color,
            };
        });
    }
};