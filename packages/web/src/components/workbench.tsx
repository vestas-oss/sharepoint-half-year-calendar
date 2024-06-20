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
          properties={{
            extensions: [
              {
                title: "Default",
                id: "81f8329d-67af-4b07-b59a-78e0120cd9ee",
                enabled: true,
              },
            ],
            sources: [
              {
                id: "083a3d2e-c6a1-49c2-ad2e-62e7c7037051",
                title: "SharePoint Default",
                name: "sharepoint",
              },
              {
                id: "30d268a0-5ade-48fa-92b5-45a23b0f6fd8",
                title: "SharePoint List",
                properties: {
                  list: "Events 2",
                  color: "#d946ef",
                },
                name: "sharepoint",
              },
              {
                id: "a279f490-62dd-4786-a620-ffce4dff1eb7",
                title: "Graph Calendar",
                name: "graph",
              },
            ],
          }}
        />
      )}
    </SPWorkbench>
  );
}
