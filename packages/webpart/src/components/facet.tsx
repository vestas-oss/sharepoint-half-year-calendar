import React, { useCallback, useMemo } from "react";
import { Button, Checkbox } from "@fluentui/react-components";
import { ChevronDownRegular, DismissRegular } from "@fluentui/react-icons";
import { Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import type {
    OpenPopoverEvents,
    OnOpenChangeData,
    CheckboxOnChangeData,
} from "@fluentui/react-components";

type Props = {
    facet: {
        count: number;
        values: Record<string, number>;
    };
    title: string;
    values: Array<string>;
    setValues: (key: string, values: Array<string>) => void;
};

export function Facet(props: Props) {
    const { facet, title, values, setValues } = props;
    const [open, setOpen] = React.useState(false);

    const onOpenChange = useCallback(
        (_: OpenPopoverEvents, data: OnOpenChangeData) => {
            setOpen(data.open || false);
        },
        [setOpen]
    );

    const onClearClick = useCallback(() => {
        setOpen(false);
        setValues(title, []);
    }, []);

    const onChange = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
            const value = ev.target.dataset.value;
            if (value === undefined) {
                return;
            }
            if (data.checked) {
                // Add
                const exists = (values ?? []).find((v) => v === value);
                if (!exists) {
                    setValues(title, (values ?? []).concat(value));
                }
                return;
            }
            // Remove
            setValues(
                title,
                (values ?? []).filter((v) => v !== value)
            );
        },
        [values, setValues]
    );

    const buttonTitle = useMemo(() => {
        if (!values || values.length === 0) {
            return title;
        }
        if (values.length === 1) {
            return values[0] || "(Empty)";
        }
        return `${values[0] || "(Empty)"} (+${values.length - 1})`;
    }, [values, title]);

    // If only one selectable value, ignore
    if (Object.keys(facet.values).length < 2) {
        return null;
    }

    return (
        <Popover positioning="below-end" open={open} onOpenChange={onOpenChange} inline={true}>
            <PopoverTrigger disableButtonEnhancement>
                <Button
                    appearance="subtle"
                    aria-label="Close"
                    icon={<ChevronDownRegular />}
                    iconPosition="after"
                    className="capitalize">
                    {buttonTitle}
                </Button>
            </PopoverTrigger>

            <PopoverSurface tabIndex={-1}>
                <div className="flex flex-col items-end">
                    <div>
                        {Object.entries(facet.values).map(([key, value]) => {
                            return (
                                <div key={key}>
                                    <Checkbox
                                        label={`${key || "(Empty)"} (${value})`}
                                        data-value={key}
                                        checked={
                                            (values ?? []).find((v) => v === key) !== undefined
                                        }
                                        onChange={onChange}
                                        className="text-slate-600"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <Button
                            appearance="subtle"
                            aria-label="Clear"
                            icon={<DismissRegular />}
                            onClick={onClearClick}
                            iconPosition="after">
                            Clear
                        </Button>
                    </div>
                </div>
            </PopoverSurface>
        </Popover>
    );
}
