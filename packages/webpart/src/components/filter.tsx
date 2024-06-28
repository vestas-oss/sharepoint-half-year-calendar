import React, { useCallback, useEffect, useContext } from "react";
import { Input, Button } from "@fluentui/react-components";
import { Dismiss24Regular, FilterRegular } from "@fluentui/react-icons";
import { JsonParam, StringParam, useQueryParam, withDefault } from "use-query-params";
import { EventsContext } from "../contexts/EventsContext";
import { useDebounce } from "../hooks/useDebounce";
import { Facet } from "./facet";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function Filter(props: Props) {
    const { open, onClose } = props;
    const [filter, setFilter] = useQueryParam("filter", withDefault(StringParam, ""), {
        removeDefaultsFromUrl: true,
    });
    const [queryParamFacets, setQueryParamFacets] = useQueryParam<Record<string, Array<string>>>(
        "facets",
        withDefault(JsonParam, {}),
        {
            removeDefaultsFromUrl: true,
        }
    );

    const setQueryParamFacetsValue = useCallback((key: string, values: Array<string>) => {
        const facets = Object.assign({}, queryParamFacets);
        facets[key] = values;
        setQueryParamFacets(facets);
    }, [queryParamFacets, setQueryParamFacets]);

    const {
        setFilterText: setContextFilterText,
        setFilterOpen: setContextFilterOpen,
        setSelectedFacets: setContextSelectedFacets,
        facets,
    } = useContext(EventsContext);

    useEffect(() => {
        setContextFilterOpen(open);
    }, [open]);

    const onChange = (_: unknown, data: { value: string }) => {
        setFilter(data.value);
    };

    const onCloseCallback = useCallback(() => {
        setFilter("");
        setQueryParamFacets({});
        onClose();
    }, [onClose]);

    const debouncedFilter = useDebounce(filter, 500);

    useEffect(() => {
        setContextFilterText(debouncedFilter ?? "");
    }, [debouncedFilter]);

    useEffect(() => {
        setContextSelectedFacets(queryParamFacets);
    }, [queryParamFacets])

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
                {Object.entries(facets ?? {}).map(([key, value]) => (
                    <Facet
                        key={key}
                        facet={value}
                        title={key}
                        values={queryParamFacets[key]}
                        setValues={setQueryParamFacetsValue}
                    />
                ))}
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
