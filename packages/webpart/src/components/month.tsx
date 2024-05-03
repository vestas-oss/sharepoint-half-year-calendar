import React from "react";
import { MonthHeader } from "./month-header";
import { Day } from "./day";

type Props = {
    year: number;
    month: number;
};

export function Month(props: Props) {
    const { year, month } = props;

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: 32 });

    return (
        <div className="divide-y divide-[#d0d0d0]">
            {days.map((_, day) => {
                if (day === 0) {
                    return <MonthHeader year={year} month={month} key={`month-${month}`} />;
                }
                if (day <= daysInMonth(year, month)) {
                    return <Day year={year} month={month} day={day} key={`day-${month}-${day}`} />;
                }
                return <Day year={year} month={month} key={`day-${month}-${day}`} />;
            })}
        </div>
    );
}
