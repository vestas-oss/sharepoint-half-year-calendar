import dynamic from "next/dynamic";

const Workbench = dynamic(
  async () => {
    let { start } = await import("../mocks");
    await start;
    return import("../components/workbench");
  },
  {
    ssr: false,
  }
);

export default function Home() {
  const AnyWorkbench = Workbench as any;
  return <AnyWorkbench />;
}
