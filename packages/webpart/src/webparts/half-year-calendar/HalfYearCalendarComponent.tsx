import { Calendar } from "../../components/calendar";
import * as React from "react";

type Props = React.ComponentProps<typeof Calendar>;

export function HalfYearCalendarComponent(props: Props) {
    return <Calendar {...props} />;
}
