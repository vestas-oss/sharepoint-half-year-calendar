import React from "react";
import { useSharePoint } from "../../hooks/useSharePoint";
import { Textarea, TextareaProps } from "@fluentui/react-components";

export const Extensibility = () => {
    const { properties } = useSharePoint();
    const [value, setValue] = React.useState(JSON.stringify(properties?.extensions, undefined, 2));

    const onChange: TextareaProps["onChange"] = (ev, data) => {
        const value = data.value;
        setValue(value);

        try {
            const extensions = JSON.parse(value);
            properties.extensions = extensions;
        } catch {
            // Ignore
        }
    };

    return (
        <div>
            <h1 className="text-lg">Extensibility libraries to load:</h1>

            <ul className="list-disc">
                {properties?.extensions
                    ?.filter((e) => e.enabled)
                    .map((e, index) => {
                        return (
                            <li key={`extension-${index}`} title={e.id}>
                                {e.title}
                            </li>
                        );
                    })}
            </ul>

            <div className="py-2" />

            <Textarea className="w-full" rows={20} value={value} onChange={onChange} />
        </div>
    );
};
