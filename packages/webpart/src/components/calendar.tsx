import React from "react";
import { SharePointContext } from "../contexts/SharePointContext";
import { SPFx, spfi } from "@pnp/sp";
import { DisplayMode } from "../types/DisplayMode";
import { Properties } from "../types/Properties";
import { HalfYearCalendar } from "./half-year-calendar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            useErrorBoundary: true,
            retry: (failureCount, error) => {
                if (failureCount >= 3) {
                    return false;
                }
                if (
                    error &&
                    typeof error === "object" &&
                    "status" in error &&
                    (error as any).status === 404
                ) {
                    // Do not retry on 404
                    return false;
                }
                if (error) {
                    return true;
                }
                return false;
            },
        },
    },
});

type Props = {
    context: Parameters<typeof SPFx>[0];
    displayMode: DisplayMode;
    properties: Properties;
};

export function Calendar(props: Props) {
    return (
        <FluentProvider theme={webLightTheme}>
            <QueryClientProvider client={queryClient}>
                <SharePointContext.Provider
                    value={{
                        sp: spfi().using(SPFx(props.context)),
                        displayMode: props.displayMode,
                    }}>
                    <HalfYearCalendar />
                </SharePointContext.Provider>
            </QueryClientProvider>
        </FluentProvider>
    );
}
