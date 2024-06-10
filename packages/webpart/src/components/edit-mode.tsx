import {
    Divider,
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    TabValue,
} from "@fluentui/react-components";
import { useSharePoint } from "../hooks/useSharePoint";
import { DisplayMode } from "../types/DisplayMode";
import React, { useCallback } from "react";
import { Sources } from "./edit-mode/sources";
import { Extensibility } from "./edit-mode/extensibility";

export const EditMode = () => {
    const { displayMode } = useSharePoint();

    const [selectedTab, setSelectedTab] = React.useState<TabValue>("sources");

    const onTabSelect = useCallback(
        (event: SelectTabEvent, data: SelectTabData) => {
            setSelectedTab(data.value);
        },
        [setSelectedTab]
    );

    if (displayMode !== DisplayMode.Edit) {
        return null;
    }

    return (
        <>
            <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} appearance="subtle">
                <Tab value="sources">Sources</Tab>
                <Tab value="extensibility">Extensibility</Tab>
            </TabList>
            <div className="pt-4">
                {selectedTab === "sources" && <Sources />}
                {selectedTab === "extensibility" && <Extensibility />}
            </div>
            <Divider className="py-4" appearance="brand" />
        </>
    );
};
