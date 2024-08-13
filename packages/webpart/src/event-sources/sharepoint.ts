import { IList } from "@pnp/sp/lists";
import "@pnp/sp/forms";
import "@pnp/sp/fields";
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

        const formsPromise = calendar.forms.filter("FormType eq 4")();
        const types = ["DateTime", "Note", "Text"];
        const typesFilter = types.map(t => `TypeAsString eq '${t}'`).join(" or ");
        const fieldsSelects = ["TypeAsString", "InternalName", "RichText", "RichTextMode"];
        const fieldsPromise = calendar.fields.filter(typesFilter).select(...fieldsSelects)();
        const [forms, fields] = await Promise.all([formsPromise, fieldsPromise]);

        type SharePointEvent = {
            ID: number;
            Title: string;
            EndDate: string;
            Description?: string;
            Comments?: string;
            EventDate?: string;
            StartDate?: string;
        };

        let items = new Array<SharePointEvent>();
        const isoString = (date: Date) => date.toISOString().split(".").shift() + "Z";
        const dateFilter = (s: "Event" | "Start" | "End") =>
            `${s}Date ge datetime'${isoString(query.start)}' and ` +
            `${s}Date le datetime'${isoString(query.end)}'`;
        // Filter: starts or ends within period
        const startFieldName = fields.find(f => f.InternalName === "StartDate") ? "Start" : "Event";
        const calendarFilter = `(${dateFilter(startFieldName)}) or (${dateFilter("End")})`;
        const selects = ["ID", "Title", `${startFieldName}Date`, "EndDate"];
        if (fields.find(f => f.InternalName === "Description")) {
            selects.push("Description");
        }
        if (fields.find(f => f.InternalName === "Comments")) {
            selects.push("Comments");
        }
        for await (const page of calendar.items.filter(calendarFilter).select(...selects)) {
            items = items.concat(page);
        }

        const formUrl = forms[0]?.ServerRelativeUrl;

        const htmlEncode = (input: string | undefined) => {
            if (!input) {
                return input;
            }
            return input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
        
        const encode = fields.find(f => (f.InternalName === "Description" || f.InternalName === "Comments") &&
            f.TypeAsString === "Text");

        const events = items
            .map((item) => {
                const start = item[`${startFieldName}Date`];
                const end = item.EndDate;
                const link = formUrl ? `${formUrl}?ID=${item.ID}&Source=${encodeURI(window.location.href)}` : undefined;
                const description = item.Description || item.Comments;
                return {
                    title: item.Title,
                    start: new Date(start!),
                    end: new Date(end),
                    color: properties?.color,
                    link,
                    description: encode ? htmlEncode(description) : description,
                };
            });

        return events;
    },
}