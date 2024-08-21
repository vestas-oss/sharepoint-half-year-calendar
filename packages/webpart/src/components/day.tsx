import React from "react";
import clsx from "clsx";
import { useEvents } from "../hooks/useEvents";
import { CalendarEvent } from "./calendar-event";
import {
    Popover,
    PopoverSurface,
    PopoverTrigger,
    Skeleton,
    SkeletonItem,
} from "@fluentui/react-components";
import { DaySummary } from "./day-summary";
import { useDayHover } from "../hooks/useDayHover";

type Props = {
    year: number;
    month: number;
    day?: number;
};

export function Day(props: Props) {
    const { year, month, day } = props;
    const { isFetched, events } = useEvents(year, month, day);
    const { open, onMouseEnter, onMouseLeave } = useDayHover(year, month, day);

    let dayCharacter = "";
    let weekday: "" | number = "";
    if (day) {
        const date = new Date(year, month, day);
        dayCharacter = new Intl.DateTimeFormat("default", { weekday: "narrow" }).format(date);
        weekday = date.getDay();
    }
    const now = new Date();
    const isToday = now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;

    let content = (
        <div
            className={clsx(
                "h-[27px] flex flex-row hover:bg-[#eaeaea]",
                "divide-x divide-[#d0d0d0]",
                {
                    "bg-[#eeeeee]": weekday === 0 || weekday === 6,
                }
            )}>
            <div
                className={clsx("flex flex-row w-9 min-w-9 justify-between p-[2px]", {
                    "text-blue-600 font-semibold": isToday,
                })}>
                <div dangerouslySetInnerHTML={{ __html: dayCharacter || "&nbsp;" }} />
                {day}
            </div>
            <div className={clsx("min-w-0 w-full")}>
                {!isFetched && (
                    <Skeleton as="div" style={{ height: "100%" }}>
                        <SkeletonItem style={{ height: "100%" }} />
                    </Skeleton>
                )}
                {isFetched && events?.length === 1 ? <CalendarEvent event={events[0]} /> : null}
                {isFetched && events?.length === 2 ? (
                    <div className={clsx("flex flex-col")}>
                        <CalendarEvent size="small" event={events[0]} />
                        <CalendarEvent size="small" event={events[1]} />
                    </div>
                ) : null}
                {isFetched && events && events.length > 2 ? (
                    <div className="flex flex-row divide-x-[1px] divide-[#d0d0d0]">
                        <div className="flex flex-col min-w-0 grow">
                            <CalendarEvent size="small" event={events[0]} />
                            <CalendarEvent size="small" event={events[1]} />
                        </div>
                        <div className="bg-[#f8f8f8] flex items-center px-[2px]">
                            <div className="font-semibold min-w-[22px]">+{events.length - 2}</div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );

    if (isFetched && events && events.length > 0 && day) {
        content = (
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <Popover
                    positioning={"after"}
                    withArrow
                    open={open}
                    unstable_disableAutoFocus={true}
                    inline={true}>
                    <PopoverTrigger disableButtonEnhancement>{content}</PopoverTrigger>

                    <PopoverSurface>
                        <DaySummary year={year} month={month} day={day} events={events} />
                    </PopoverSurface>
                </Popover>
            </div>
        );
    }

    return content;
}
