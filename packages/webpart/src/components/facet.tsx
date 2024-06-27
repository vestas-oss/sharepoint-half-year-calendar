import React, { useCallback } from "react";
import { Button, Checkbox } from "@fluentui/react-components";
import { ChevronDownRegular, DismissRegular } from "@fluentui/react-icons";
import { Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import type { OpenPopoverEvents, OnOpenChangeData } from "@fluentui/react-components";

type Props = {
    facet: {
        count: number;
        values: Record<string, number>;
    };
    title: string;
};

export function Facet(props: Props) {
    const { facet, title } = props;
    const [open, setOpen] = React.useState(false);

    const onOpenChange = useCallback(
        (_: OpenPopoverEvents, data: OnOpenChangeData) => {
            setOpen(data.open || false);
        },
        [setOpen]
    );

    const onClearClick = useCallback(() => {
        setOpen(false);
    }, []);

    if (Object.keys(facet.values).length < 2) {
        return null;
    }

    return (
        <Popover positioning={"below-end"} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger disableButtonEnhancement>
                <Button
                    appearance="subtle"
                    aria-label="Close"
                    icon={<ChevronDownRegular />}
                    iconPosition="after">
                    {title}
                </Button>
            </PopoverTrigger>

            <PopoverSurface tabIndex={-1}>
                <div className="flex flex-col items-end">
                    <div>
                        {Object.entries(facet.values).map(([key, value]) => (
                            <div key={key}>
                                {/* TODO: handle onChange */}
                                <Checkbox label={`${key} (${value})`} />
                            </div>
                        ))}
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
