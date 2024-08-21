import { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import { DayHoverContext } from "../contexts/DayHoverContext";

export const useDayHover = (year: number, month: number, day: number) => {
    const dayHover = useContext(DayHoverContext);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(dayHover.popover.day === day &&
            dayHover.popover.month === month &&
            dayHover.popover.year === year);
    }, [dayHover.popover]);

    const onMouseEnter = useCallback(() => {
        dayHover.setHover({ year, month, day })
    }, [dayHover.setHover]);

    const onMouseLeave = useCallback(() => {
        dayHover.setHover({ year: 0, month: 0, day: 0 });
    }, [dayHover.setHover]);

    return {
        onMouseEnter,
        onMouseLeave,
        open
    };
};