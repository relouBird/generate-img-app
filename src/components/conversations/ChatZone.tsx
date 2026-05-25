import { useEffect, useRef } from "react";
import { useStore } from "zustand/react";
import { useConversationStore } from "@/stores/conversation.store";
import { MessageBubble } from "./MessageBubble";
import { ChatSkeleton } from "./ChatSkeleton";
import { EmptyConversation } from "./EmptyConversation";

type Props = {
  onStartNew: () => void;
};

export function ChatZone({ onStartNew }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, isGenerating, isLoading, activeConversationId } =
    useStore(useConversationStore);

  // Auto-scroll vers le bas à chaque nouveau message ou pendant la génération
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // État vide : aucune conversation sélectionnée
  if (!activeConversationId && messages.length === 0) {
    return (
      <div className="flex-1 overflow-hidden">
        <EmptyConversation onStart={onStartNew} />
      </div>
    );
  }

  // Chargement de l'historique
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <ChatSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Skeleton pendant la génération */}
        {isGenerating && <ChatSkeleton />}

        {/* Ancre de scroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
