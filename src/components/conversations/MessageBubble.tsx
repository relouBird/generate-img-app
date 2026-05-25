import { cn } from "@/utils/cn";
import { MessageRoleEnum, type MessageType } from "@/types/conversation.type";
import { GeneratedImage } from "./GeneratedImage";

type Props = {
  message: MessageType;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === MessageRoleEnum.USER;

  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 size-7 rounded-full grid place-items-center text-xs font-semibold mt-0.5",
          isUser
            ? "bg-primary-100 text-primary-600"
            : "bg-background-soft-100 text-foreground-soft-500",
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Contenu */}
      <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
        {/* Texte */}
        {message.content && (
          <div
            className={cn(
              "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
              isUser
                ? "bg-primary-500 text-white rounded-tr-sm"
                : "bg-background-soft-100 text-title-50 rounded-tl-sm",
            )}
          >
            {message.content}
          </div>
        )}

        {/* Image générée (côté assistant uniquement) */}
        {message.image && (
          <GeneratedImage image={message.image} alt={`Génération turn ${message.turnIndex}`} />
        )}
      </div>
    </div>
  );
}
