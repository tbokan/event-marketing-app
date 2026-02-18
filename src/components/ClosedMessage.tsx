import { uiContent } from "@/config/content.config";

export function ClosedMessage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{uiContent.closed.title}</h1>
        <p className="mt-4 text-muted-foreground">{uiContent.closed.message}</p>
      </div>
    </div>
  );
}
