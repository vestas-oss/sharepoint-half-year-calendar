import { DisplayMode } from "../types/DisplayMode";
import { SPFI, spfi } from "@pnp/sp";
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
    }
};

export const SharePointContext = createContext<SharePointContext>({
    sp: spfi().using(),
    displayMode: DisplayMode.Read,
    properties: {},
});