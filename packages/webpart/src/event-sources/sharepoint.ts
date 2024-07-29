import { IList } from "@pnp/sp/lists";
import "@pnp/sp/forms";
import { useSharePoint } from "../hooks/useSharePoint";
import { Event } from "../types/Event";

type Properties = {
    color?: string,
    list?: string,
}

export const sharepoint = {
    name: "sharepoint",
    title: "SharePoint List",
    isDefault: true as const,
    fn: async (context: ReturnType<typeof useSharePoint>, query: { start: Date, end: Date }, properties?: Properties): Promise<Array<Event>> => {
        const { sp } = context;

        const lists = sp.web.lists;
        let calendar: IList | undefined = undefined;
        if (properties?.list) {
            calendar = lists.getByTitle(properties.list);
        } else {
            // Calendar list and not hidden
            const listsFilter = "BaseTemplate eq 106 and Hidden eq false and ItemCount gt 0";
            const listInfos = await lists.filter(listsFilter).orderBy("ItemCount", false)();
            if (!listInfos || listInfos.length === 0) {
                return [];
            }
            calendar = lists.getById(listInfos[0].Id);
        }

        type SharePointEvent = {
            ID: number;
            Title: string;
            EventDate: string;
            EndDate: string;
        };

        let items = new Array<SharePointEvent>();
        const isoString = (date: Date) => date.toISOString().split(".").shift() + "Z";
        const dateFilter = (s: "Event" | "End") =>
            `${s}Date ge datetime'${isoString(query.start)}' and ` +
            `${s}Date le datetime'${isoString(query.end)}'`;
        // Filter: starts or ends within period
        const calendarFilter = `(${dateFilter("Event")}) or (${dateFilter("End")})`;
        const selects = ["ID", "Title", "EventDate", "EndDate"];
        for await (const page of calendar.items.filter(calendarFilter).select(...selects)) {
            items = items.concat(page);
        }

        const forms = await calendar.forms.filter("FormType eq 4")();
        const formUrl = forms[0]?.ServerRelativeUrl;

        const events = items
            .map((item) => {
                const start = item.EventDate;
                const end = item.EndDate;
                const link = formUrl ? `${formUrl}?ID=${item.ID}&Source=${encodeURI(window.location.href)}` : undefined;
                return {
                    title: item.Title,
                    start: new Date(start),
                    end: new Date(end),
                    color: properties?.color,
                    link,
                };
            });

        return events;
    },
}