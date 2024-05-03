import { ToolbarButton } from "@fluentui/react-components";
import React, { useCallback, useState } from "react";
import { Month } from "./month";
import { ArrowDownRegular, ArrowUpRegular } from "@fluentui/react-icons";

export function HalfYearCalendar() {
    const [period, setPeriod] = useState({
        year: new Date().getFullYear(),
        half: new Date().getMonth() > 5 ? ("H2" as const) : ("H1" as const),
    });

    const onNext = useCallback(() => {
        setPeriod((prev) => {
            if (prev.half === "H1") {
                return {
                    year: prev.year,
                    half: "H2",
                };
            }
            return {
                year: prev.year + 1,
                half: "H1",
            };
        });
    }, [setPeriod]);

    const onPrevious = useCallback(() => {
        setPeriod((prev) => {
            if (prev.half === "H2") {
                return {
                    year: prev.year,
                    half: "H1",
                };
            }
            return {
                year: prev.year - 1,
                half: "H2",
            };
        });
    }, [setPeriod]);

    const onToday = useCallback(() => {
        setPeriod({
            year: new Date().getFullYear(),
            half: new Date().getMonth() > 5 ? ("H2" as const) : ("H1" as const),
        });
    }, []);

    return (
        <div className="flex w-full flex-col">
            <div className="flex flex-row pb-1 gap-1">
                <ToolbarButton onClick={onToday} style={{minWidth: "unset"}}>Today</ToolbarButton>
                <ToolbarButton
                    icon={<ArrowDownRegular />}
                    className="rotate-90"
                    title="Previous"
                    onClick={onPrevious}
                />
                <ToolbarButton
                    icon={<ArrowUpRegular />}
                    className="rotate-90"
                    title="Next"
                    onClick={onNext}
                />
                <h1 className="text-2xl font-bold">
                    {period.year} {period.half}
                </h1>
            </div>
            <div className="flex border-2 border-[#d0d0d0] divide-x-2 divide-[#d0d0d0]">
                {Array.from({ length: 6 }).map((_, i) => {
                    const month = i + (period.half === "H2" ? 6 : 0);
                    return (
                        <div key={`month-${month}`} className="flex-grow flex-1 min-w-0">
                            <Month year={period.year} month={month} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
