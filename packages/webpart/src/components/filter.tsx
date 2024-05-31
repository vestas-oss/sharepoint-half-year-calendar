import React, { useCallback, useEffect, useContext } from "react";
import { Input, Button } from "@fluentui/react-components";
import { Dismiss24Regular, FilterRegular } from "@fluentui/react-icons";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { EventsContext } from "../contexts/EventsContext";
import { useDebounce } from "../hooks/useDebounce";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function Filter(props: Props) {
    const { open, onClose } = props;
    const [filter, setFilter] = useQueryParam("filter", withDefault(StringParam, ""), {
        removeDefaultsFromUrl: true,
    });
    const { setFilter: setContextFilter } = useContext(EventsContext);

    const onChange = (_: unknown, data: { value: string }) => {
        setFilter(data.value);
    };

    const onCloseCallback = useCallback(() => {
        setFilter("");
        onClose();
    }, [onClose]);

    const debouncedFilter = useDebounce(filter, 500);

    useEffect(() => {
        setContextFilter(debouncedFilter);
    }, [debouncedFilter]);

    if (!open) {
        return null;
    }

    return (
        <div className="flex flex-row justify-between p-2 rounded my-2 bg-gray-100 print:hidden">
            <Input
                contentBefore={<FilterRegular />}
                className="w-80"
                placeholder="Filter by title"
                appearance="underline"
                value={filter}
                onChange={onChange}
            />
            <div>
                {/* WIP
                <Button
                    appearance="subtle"
                    aria-label="Close"
                    icon={<ChevronDownRegular />}
                    iconPosition="after">
                    Types
                </Button> */}
                <Button
                    appearance="subtle"
                    aria-label="Close"
                    icon={<Dismiss24Regular />}
                    onClick={onCloseCallback}
                />
            </div>
        </div>
    );
}
