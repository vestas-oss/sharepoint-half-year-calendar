import { useMemo } from "react";
import { SPWorkbench } from "sp-workbench";
import { Calendar } from "webpart/src/components/calendar";

export default function Workbench() {
  type Context = React.ComponentProps<typeof Calendar>["context"];
  const context = useMemo<Context>(() => {
    return {
      pageContext: {
        web: {
          absoluteUrl: window.location.origin,
        },
        legacyPageContext: {
          formDigestTimeoutSeconds: 60,
          formDigestValue: "digest",
        },
      },
    };
  }, []);

  return (
    <SPWorkbench>
      {(workbench) => (
        <Calendar
          context={context}
          displayMode={workbench.displayMode}
          properties={{}}
        />
      )}
    </SPWorkbench>
  );
}
