import { Period } from "../types/Period";
import { EventsContext } from "../contexts/EventsContext";
import React, { useMemo, useState } from "react";
import { useSharePoint } from "../hooks/useSharePoint";
import { tokens } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { Event } from "../types/Event";
import { sources as defaultSources } from "../event-sources/sources";
import { EventSource } from "../types/EventSource";
import { create, search, insertMultiple } from "@orama/orama";

type Props = React.PropsWithChildren<{
    period: Period;
}>;

export function EventsProvider(props: Props) {
    const context = useSharePoint();
    const { properties, spfx } = context;
    const { children, period } = props;
    const [filterText, setFilterText] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFacets, setSelectedFacets] = useState<Record<keyof Event, Array<string>>>();

    const { periodStart, periodEnd } = useMemo(() => {
        return {
            periodStart: new Date(period.year, period.half === "H1" ? 0 : 6, 1),
            periodEnd: new Date(
                period.year,
                period.half === "H1" ? 5 : 11,
                period.half === "H1" ? 30 : 31,
                23,
                59,
                59
            ),
        };
    }, [period]);

    const sort = (events: Array<Event>) => {
        events.sort((a, b) => {
            const diff = a.start.getTime() - b.start.getTime();
            if (diff !== 0) {
                return diff;
            }
            return (a.title ?? "").localeCompare(b.title ?? "");
        });
        return events;
    };

    const { data: periodEvents, isFetched: isPeriodFetched } = useQuery({
        queryKey: ["half-year-calendar-events", period.year, period.half],
        queryFn: async () => {
            let sources = new Array<EventSource>();
            // Load extensions
            const extensions = properties?.extensions?.filter((e) => e.enabled) ?? [];
            for (const extension of extensions) {
                // If extension is this manifest id
                if (extension.id === "81f8329d-67af-4b07-b59a-78e0120cd9ee") {
                    sources = sources.concat(...defaultSources);
                    continue;
                }
                if (spfx?.components) {
                    try {
                        const component = await spfx.components.loadComponentById(extension.id);
                        sources = sources.concat(component.sources);
                    } catch (e) {
                        console.log(
                            `half-year-calendar-webpart: failed to load component id '${extension.id}':`
                        );
                        console.error(e);
                    }
                } else {
                    console.warn("Skipped");
                }
            }

            let events = new Array<Event>();

            if (!properties.sources) {
                return events;
            }

            // Loop sources
            for (const source of properties.sources) {
                const sourceDefinition = sources.find((s) => s.name === source.name);
                if (!sourceDefinition) {
                    continue;
                }
                try {
                    const sourceEvents = await sourceDefinition.fn(
                        context,
                        { start: periodStart, end: periodEnd },
                        source.properties
                    );
                    sourceEvents.forEach((se) => {
                        se.source = source.title;
                    });
                    events = events.concat(...(sourceEvents ?? []));
                } catch (e) {
                    console.error(`Failed to get events from source '${source.name}'.`);
                    console.error(e);
                }
            }

            for (const event of events) {
                if (!event.color) {
                    event.color = tokens.colorBrandForegroundInvertedHover;
                }
            }

            sort(events);

            return events;
        },
    });

    const { data, isFetched: isDataFetched } = useQuery({
        queryKey: [
            "half-year-calendar-events",
            period.year,
            period.half,
            filterText,
            filterOpen,
            JSON.stringify(selectedFacets ?? {}),
        ],
        queryFn: async () => {
            if (!filterText && !filterOpen) {
                return {
                    events: periodEvents,
                    facets: {},
                };
            }

            const db = await create({
                schema: {
                    title: "string",
                    source: "string",
                } as const,
                components: {
                    tokenizer: {
                        stemming: true,
                        stemmerSkipProperties: ["source"],
                    },
                },
            });

            await insertMultiple(db, periodEvents ?? []);

            const result = await search<typeof db, Event>(db, {
                term: filterText,
                properties: ["title"],
                limit: 5000,
                facets: {
                    source: {
                        sort: "DESC",
                    },
                },
            });

            let events = result.hits.map((hit) => hit.document);

            // Apply selected facets
            Object.entries(selectedFacets ?? {}).forEach(([key, value]) => {
                if (!value || value.length === 0) {
                    return;
                }
                events = events.filter((event) => {
                    const include =
                        value.find((v) => v === event[key as keyof Event]) !== undefined;
                    return include;
                });
            });

            sort(events);

            return { events, facets: result.facets };
        },
        enabled: isPeriodFetched,
    });

    const defaultEvents = useMemo(() => {
        return [];
    }, []);

    const defaultFacets = useMemo(() => {
        return {};
    }, []);

    const isFetched = useMemo(() => {
        return isPeriodFetched && isDataFetched;
    }, [isPeriodFetched, isDataFetched]);

    return (
        <EventsContext.Provider
            value={{
                isFetched,
                events: data?.events ?? defaultEvents,
                facets: data?.facets ?? defaultFacets,
                period,
                setFilterText,
                setFilterOpen,
                setSelectedFacets,
            }}>
            {children}
        </EventsContext.Provider>
    );
}
