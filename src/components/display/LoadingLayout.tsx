import { useConversationStore } from "@/stores/conversation.store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useStore } from "zustand";

/**
 * Layout de base sans topbar ni sidebar.
 * Utilisé par ConversationsPage (et potentiellement d'autres pages).
 * AuthLayout pourra étendre ce même pattern plus tard.
 */
export function LoadingLayout() {
  const { isInitalized } = useStore(useConversationStore);
  const navigate = useNavigate();

  // Charge la liste des conversations au montage
  useEffect(() => {
    if (isInitalized) {
      const t = setTimeout(() => {
        navigate("/");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [isInitalized, navigate]);
  return (
    <div className="min-h-screen bg-background-soft-50 font-surfer">
      <div className="h-screen flex flex-col justify-center items-center overflow-hidden">
        <img
          src="/avora.png"
          alt="Avora Logo"
          className="h-30 w-auto object-contain select-none"
        />
        <span className="text-3xl font-semibold text-title-50">Avora</span>
        <span className="text-md pb-6 text-title-50/70 mt-2 font-sans">
          Converse. Create Inspire
        </span>
        <Outlet />
      </div>
    </div>
  );
}