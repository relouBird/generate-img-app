import { cn } from "@/utils/cn";
import type { ConversationSummaryType } from "@/types/conversation.type";

type Props = {
  conversation: ConversationSummaryType;
  isActive: boolean;
  onClick: (id: string) => void;
};

export function ConversationItem({ conversation, isActive, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(conversation.id)}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg transition-colors group",
        isActive
          ? "bg-primary-50 text-primary-600"
          : "text-foreground-soft-500 hover:bg-background-soft-100 hover:text-title-50",
      )}
    >
      <p
        className={cn(
          "text-sm font-medium truncate leading-snug",
          isActive ? "text-primary-600" : "text-title-50",
        )}
      >
        {conversation.name}
      </p>
    </button>
  );
}
