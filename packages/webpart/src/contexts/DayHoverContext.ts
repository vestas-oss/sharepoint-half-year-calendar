import { createContext } from "react";

type DayHoverContext = {
    hover: { year: number; month: number; day: number };
    setHover: (date: { year: number; month: number; day: number }) => void;
    popover: { year: number; month: number; day: number };
    setPopover: (date: { year: number; month: number; day: number }) => void;
};

export const DayHoverContext = createContext<DayHoverContext>({
    hover: {
        year: 0,
        month: 0,
        day: 0,
    },
    setHover: () => { },
    popover: {
        year: 0,
        month: 0,
        day: 0,
    },
    setPopover: () => { },
});