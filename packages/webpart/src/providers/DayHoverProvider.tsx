import React, { useEffect, useState } from "react";
import { DayHoverContext } from "../contexts/DayHoverContext";

type Props = React.PropsWithChildren<{}>;

export function DayHoverProvider(props: Props) {
    const { children } = props;
    const [hover, setHover] = useState<{ year: number; month: number; day: number }>({
        year: 0,
        month: 0,
        day: 0,
    });

    const [popover, setPopover] = useState<{ year: number; month: number; day: number }>({
        year: 0,
        month: 0,
        day: 0,
    });

    // Effect: set popover after timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            setPopover(hover);
        }, 450);

        return () => clearTimeout(timer);
    }, [hover]);

    // Effect: when hover moves outside date
    useEffect(() => {
        if (hover.year !== 0 && hover.month !== 0 && hover.day !== 0) {
            return;
        }

        const timer = setTimeout(() => {
            // If still hovering the same after timeout, skip
            if (
                hover.year === popover.year &&
                hover.month === popover.year &&
                hover.day === popover.year
            ) {
                return;
            }
            setPopover({ year: 0, month: 0, day: 0 });
        }, 500);

        return () => clearTimeout(timer);
    }, [hover]);

    return (
        <DayHoverContext.Provider
            value={{
                hover,
                setHover,
                popover,
                setPopover,
            }}>
            {children}
        </DayHoverContext.Provider>
    );
}
