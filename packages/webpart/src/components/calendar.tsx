import React from "react";
import { SharePointContext } from "../contexts/SharePointContext";
import { SPFx, spfi } from "@pnp/sp";
import { DisplayMode } from "../types/DisplayMode";
import { Properties } from "../types/Properties";
import { HalfYearCalendar } from "./half-year-calendar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { QueryParamProvider } from "use-query-params";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { EditMode } from "./edit-mode";

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
    spfx?: React.ComponentProps<typeof SharePointContext.Provider>["value"]["spfx"];
};

export function Calendar(props: Props) {
    const { displayMode, properties, spfx } = props;

    return (
        <FluentProvider theme={webLightTheme}>
            <QueryClientProvider client={queryClient}>
                <SharePointContext.Provider
                    value={{
                        sp: spfi().using(SPFx(props.context)),
                        displayMode,
                        properties,
                        spfx,
                    }}>
                    <EditMode />
                    <HashRouter basename="/">
                        <QueryParamProvider adapter={ReactRouter6Adapter}>
                            <Routes>
                                <Route path="/" element={<HalfYearCalendar />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </QueryParamProvider>
                    </HashRouter>
                </SharePointContext.Provider>
            </QueryClientProvider>
        </FluentProvider>
    );
}
