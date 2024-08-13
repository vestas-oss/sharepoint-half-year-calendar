import { DisplayMode } from "../types/DisplayMode";
import { SPFI, SPFx, spfi } from "@pnp/sp";
import { createContext } from "react";
import { Properties } from "../types/Properties";
import type { GraphRequest, Client } from '@microsoft/microsoft-graph-client';

type SharePointContext = {
    sp: SPFI;
    displayMode: DisplayMode;
    properties: Properties;
    spfx?: {
        components?: {
            loadComponentById: (id: string) => Promise<any>;
        },
        graph?: {
            getClient: (version: '3') => Promise<{
                api(path: string): GraphRequest;
                get client(): Client;
            }>
        }
    },
    context: Parameters<typeof SPFx>[0],
};

export const SharePointContext = createContext<SharePointContext>({
    sp: spfi().using(),
    displayMode: DisplayMode.Read,
    properties: {},
    context: {
        pageContext: {
            web: {
                absoluteUrl: ""
            },
            legacyPageContext: {
                formDigestTimeoutSeconds: 0,
                formDigestValue: ""
            }
        }
    },
});