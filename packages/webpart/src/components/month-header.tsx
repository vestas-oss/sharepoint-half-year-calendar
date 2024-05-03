import React from "react";

type Props = {
    year: number;
    month: number;
};

export function MonthHeader(props: Props) {
    const { year, month } = props;

    const date = new Date(year, month, 1);
    const monthName = date.toLocaleString("default", { month: "long" });

    return (
        <div className="uppercase text-lg m-[2px]">
            {monthName}
        </div>
    );
}
