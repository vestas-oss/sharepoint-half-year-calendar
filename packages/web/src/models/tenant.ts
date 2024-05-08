import { Tenant } from "msw-sp";

const url = "https://half-year-calendar.sharepoint.com";
const now = new Date();
const year = now.getFullYear();

export const tenant: Tenant = {
    title: "Half Year Calendar",
    url,
    sites: {
        "/": {
            rootWeb: {
                title: "Half Year Calendar",
                serverRelativeUrl: "/",
                lists: [
                    {
                        id: "3ffb41a5-743c-4c8f-a379-9e8e6e94b936",
                        title: "Events",
                        baseTemplate: 106,
                        hidden: false,
                        url: "Lists/Events",
                        items: [
                            {
                                "FileSystemObjectType": 0,
                                "Id": 1,
                                "ContentTypeId": "0x0100EE277107DD3E9F4CBC7D33048BB8CB92",
                                "Title": "Event",
                                "Start": `${year}-04-22T06:00:00Z`,
                                "End": `${year}-04-22T14:00:00Z`,
                                "ID": 1,
                                "Modified": "2024-01-04T11:56:54Z",
                                "Created": "2023-10-10T06:01:48Z",
                                "AuthorId": 1073741822,
                                "EditorId": 1073741822,
                            },
                            {
                                "FileSystemObjectType": 0,
                                "Id": 2,
                                "ContentTypeId": "0x0100EE277107DD3E9F4CBC7D33048BB8CB92",
                                "Title": "A, Extra Very Long Event Title",
                                "Start": `${year}-05-01T06:00:00Z`,
                                "End": `${year}-05-01T14:00:00Z`,
                                "ID": 2,
                                "Modified": "2024-01-04T11:56:54Z",
                                "Created": "2023-10-10T06:01:48Z",
                                "AuthorId": 1073741822,
                                "EditorId": 1073741822,
                            },
                            {
                                "FileSystemObjectType": 0,
                                "Id": 3,
                                "ContentTypeId": "0x0100EE277107DD3E9F4CBC7D33048BB8CB92",
                                "Title": "B",
                                "Start": `${year}-05-01T05:00:00Z`,
                                "End": `${year}-05-01T14:00:00Z`,
                                "ID": 3,
                                "Modified": "2024-01-04T11:56:54Z",
                                "Created": "2023-10-10T06:01:48Z",
                                "AuthorId": 1073741822,
                                "EditorId": 1073741822,
                            },
                            {
                                "FileSystemObjectType": 0,
                                "Id": 4,
                                "ContentTypeId": "0x0100EE277107DD3E9F4CBC7D33048BB8CB92",
                                "Title": "C",
                                "Start": `${year}-05-01T06:00:00Z`,
                                "End": `${year}-05-01T14:00:00Z`,
                                "ID": 4,
                                "Modified": "2024-01-04T11:56:54Z",
                                "Created": "2023-10-10T06:01:48Z",
                                "AuthorId": 1073741822,
                                "EditorId": 1073741822,
                            },
                            {
                                "FileSystemObjectType": 0,
                                "Id": 5,
                                "ContentTypeId": "0x0100EE277107DD3E9F4CBC7D33048BB8CB92",
                                "Title": "Weekend",
                                "Start": `${year}-05-04T06:00:00Z`,
                                "End": `${year}-05-05T14:00:00Z`,
                                "ID": 5,
                                "Modified": "2024-01-04T11:56:54Z",
                                "Created": "2023-10-10T06:01:48Z",
                                "AuthorId": 1073741822,
                                "EditorId": 1073741822,
                            },
                            {
                                "FileSystemObjectType": 0,
                                "Id": 6,
                                "ContentTypeId": "0x0100EE277107DD3E9F4CBC7D33048BB8CB92",
                                "Title": "Summer",
                                "Start": `${year}-07-08T06:00:00Z`,
                                "End": `${year}-07-26T14:00:00Z`,
                                "ID": 6,
                                "Modified": "2024-01-04T11:56:54Z",
                                "Created": "2023-10-10T06:01:48Z",
                                "AuthorId": 1073741822,
                                "EditorId": 1073741822,
                            },
                        ]
                    },
                ],
            },
        },
    },
};
