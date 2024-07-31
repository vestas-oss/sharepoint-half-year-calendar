import clsx from "clsx";
import React from "react";
import { Event } from "../types/Event";
import { useContrastColor } from "../hooks/useContrastColor";

type Props = {
    event: Event;
    size?: "small" | "large";
};

export function CalendarEvent(props: Props) {
    const { event, size } = props;
    const { title, color } = event;

    const fontColor = useContrastColor(color);

    let content = (
        <div
            style={{ backgroundColor: color }}
            className={clsx(`h-full w-full p-[2px]`, "flex items-center", {
                "cursor-default": !event.link,
            })}
            title={title}>
            <div style={{ color: fontColor }} className={`truncate px-[2px] text-xs font-semibold`}>
                {title}
            </div>
        </div>
    );

    if (size === "small") {
        content = (
            <div style={{ backgroundColor: color }} title={title}>
                <div
                    style={{ color: fontColor }}
                    className={clsx(
                        "truncate h-[13px] px-[2px] text-[10px] leading-tight font-semibold",
                        {
                            "cursor-default": !event.link,
                        }
                    )}>
                    {title}
                </div>
            </div>
        );
    }

    if (event.link) {
        return (
            <a href={event.link} target="_blank" rel="noreferrer" data-interception="off">
                {content}
            </a>
        );
    }

    return content;
}
