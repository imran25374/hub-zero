import { cn } from "@workspace/ui/lib/utils";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
        Imran Syed Naqvi
      </p>
      <h1
        className={cn(
          "mt-4 text-4xl font-semibold tracking-tight text-balance",
          "sm:text-5xl",
        )}
      >
        Hub Zero: coming December 2026
      </h1>
    </main>
  );
}
