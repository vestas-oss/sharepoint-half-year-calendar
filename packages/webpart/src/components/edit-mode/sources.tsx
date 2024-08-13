import React from "react";
import { useSharePoint } from "../../hooks/useSharePoint";
import { Textarea, TextareaProps } from "@fluentui/react-components";

export const Sources = () => {
    const { properties } = useSharePoint();
    const [value, setValue] = React.useState(JSON.stringify(properties?.sources, undefined, 2));

    const onChange: TextareaProps["onChange"] = (ev, data) => {
        const value = data.value;
        setValue(value);

        try {
            const sources = JSON.parse(value);
            properties.sources = sources;
        } catch {
            // Ignore
        }
    };

    return (
        <>
            <h1 className="text-lg">Sources:</h1>

            <Textarea className="w-full" rows={20} value={value} onChange={onChange} />
        </>
    );
};
