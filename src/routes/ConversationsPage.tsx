import { useStore } from "zustand/react";
import { useConversationStore } from "@/stores/conversation.store";
import { ChatZone } from "@/components/conversations/ChatZone";
import { ChatInput } from "@/components/conversations/ChatInput";

export default function ConversationsPage() {
  const { clearActiveConversation,  } =
    useStore(useConversationStore);


  const handleNewConversation = () => {
    clearActiveConversation();
  };


  return (
    <>
      {/* Zone principale */}
      <div className="flex flex-col pt-16 md:pt-0 flex-1 overflow-hidden">
        <ChatZone onStartNew={handleNewConversation} />
        <ChatInput />
      </div>
    </>
  );
}
