import { useRef, useState, useEffect } from "react";
import { useStore } from "zustand/react";
import { useConversationStore } from "@/stores/conversation.store";
import { cn } from "@/utils/cn";

export function ChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const { isGenerating, activeConversationId, startConversation, continueConversation } =
    useStore(useConversationStore);

  // Auto-resize du textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !isGenerating;

  const handleSend = async () => {
    if (!canSend) return;
    const prompt = value.trim();
    setValue("");

    try {
      if (activeConversationId) {
        await continueConversation({ prompt });
      } else {
        await startConversation({ prompt });
      }
    } catch {
      // L'erreur est déjà loggée dans le store.
      // Tu peux brancher ici ton useNotificationStore si besoin.
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Envoyer avec Enter (sans Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-base-200 bg-background-soft-50 px-6 py-4">
      <div className="max-w-2xl mx-auto">
        <div
          className={cn(
            "flex items-end gap-3 rounded-2xl border px-4 py-3 transition-colors",
            isGenerating
              ? "border-base-200 bg-background-soft-50"
              : "border-base-300 bg-white focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-200",
          )}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={
              isGenerating
                ? "Génération en cours..."
                : "Décrivez l'image à générer..."
            }
            className="flex-1 resize-none bg-transparent text-sm text-title-50 placeholder:text-foreground-soft-400 focus:outline-none leading-relaxed disabled:cursor-not-allowed"
          />

          {/* Bouton Send */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "shrink-0 size-8 rounded-xl grid place-items-center transition-all",
              canSend
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "bg-background-soft-100 text-foreground-soft-300 cursor-not-allowed",
            )}
          >
            {isGenerating ? (
              // Spinner minimaliste
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Flèche envoyer
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="text-xs text-foreground-soft-300 mt-2 text-center">
          Entrée pour envoyer · Maj+Entrée pour un saut de ligne
        </p>
      </div>
    </div>
  );
}
