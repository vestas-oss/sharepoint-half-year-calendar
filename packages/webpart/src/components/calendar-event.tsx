import clsx from "clsx";
import React from "react";

type Props = {
    event: {
        title: string;
        color?: string;
    };
    size?: "small" | "large";
    onClick?: () => void;
};

export function CalendarEvent(props: Props) {
    const { event, size, onClick } = props;
    const { title, color } = event;

    if (size === "small") {
        return (
            <div
                onClick={onClick}
                style={{ backgroundColor: color }}
                title={title}>
                <div className="truncate h-[13px] px-[2px] text-[10px] leading-tight font-semibold">
                    {title}
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            style={{ backgroundColor: color }}
            className={clsx(`h-full w-full p-[2px]`, "flex items-center")}
            title={title}>
            <div className="truncate px-[2px] text-xs font-semibold">{title}</div>
        </div>
    );
}
