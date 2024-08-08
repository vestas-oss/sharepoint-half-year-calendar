export type Extension = {
    title: string;

    /**
     * The manifest GUID
     */
    id: string;

    enabled: boolean;
}

export type EventSource = {
    id: string;
    title: string;
    name: string;
    properties?: any;
}

export type Facet = {
    property: string;
    title: string;
}

export type Properties = Partial<{
    sources: Array<EventSource>;
    extensions: Array<Extension>;
    facets: Array<string | Facet>;
}>;