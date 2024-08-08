import React from "react";
import { useSharePoint } from "../../hooks/useSharePoint";
import { Textarea, TextareaProps } from "@fluentui/react-components";

export const Facets = () => {
    const { properties } = useSharePoint();
    const [value, setValue] = React.useState(JSON.stringify(properties?.facets, undefined, 2));

    const onChange: TextareaProps["onChange"] = (ev, data) => {
        const value = data.value;
        setValue(value);

        try {
            const facets = JSON.parse(value);
            properties.facets = facets;
        } catch {
            // Ignore
        }
    };

    return (
        <>
            <h1 className="text-lg">Facets:</h1>

            <Textarea className="w-full" rows={20} value={value} onChange={onChange} />
        </>
    );
};
