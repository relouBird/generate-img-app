/**
 * Affiché pendant qu'une génération est en cours (isGenerating = true).
 * Simule une bulle assistant + une image en cours de génération.
 */
export function ChatSkeleton() {
  return (
    <div className="flex gap-3">
      {/* Avatar placeholder */}
      <div className="shrink-0 size-7 rounded-full bg-background-soft-100 animate-pulse mt-0.5" />

      <div className="flex flex-col gap-2 max-w-[75%]">
        {/* Ligne de texte simulée */}
        <div className="flex gap-1.5 items-center px-4 py-2.5 rounded-2xl rounded-tl-sm bg-background-soft-100">
          <span className="size-1.5 rounded-full bg-foreground-soft-300 animate-bounce [animation-delay:0ms]" />
          <span className="size-1.5 rounded-full bg-foreground-soft-300 animate-bounce [animation-delay:150ms]" />
          <span className="size-1.5 rounded-full bg-foreground-soft-300 animate-bounce [animation-delay:300ms]" />
        </div>

        {/* Image en cours de génération */}
        <div className="w-64 aspect-square rounded-xl bg-background-soft-100 animate-pulse" />
      </div>
    </div>
  );
}
