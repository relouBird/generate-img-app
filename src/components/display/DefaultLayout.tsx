import { Outlet, useNavigate } from "react-router";
import { ConversationSidebar } from "@/components/conversations/ConversationSidebar";
import { useStore } from "zustand";
import { useConversationStore } from "@/stores/conversation.store";
import { useEffect, useState } from "react";
import MobileTopBar from "./MobileTopBar";

/**
 * Layout de base sans topbar ni sidebar.
 * Utilisé par ConversationsPage (et potentiellement d'autres pages).
 * AuthLayout pourra étendre ce même pattern plus tard.
 */
export function DefaultLayout() {
  const { fetchAllConversations, clearActiveConversation, isInitalized: isInitialized } =
    useStore(useConversationStore);

  const navigate = useNavigate();

  // Valeurs réactives
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);

  // Charge la liste des conversations au montage
  useEffect(() => {
    if (!isInitialized) {
      navigate("/loading");
    }
    fetchAllConversations();
  }, [fetchAllConversations, isInitialized, navigate]);

  const handleNewConversation = () => {
    clearActiveConversation();
    setToggleSidebar(false);
  };

  return (
    <div className="min-h-screen bg-background-soft-50 font-surfer">
      <div className="flex h-screen overflow-hidden">
        <MobileTopBar
          onToggleSidebar={() => {
            setToggleSidebar(!toggleSidebar);
          }}
        />
        {/* Sidebar */}
        <ConversationSidebar
          sideview={toggleSidebar}
          onClose={() => setToggleSidebar(false)}
          onNewConversation={handleNewConversation}
        />
        <Outlet />
      </div>
    </div>
  );
}
