import { useState, useEffect } from "react";
import { useStore } from "zustand/react";
import { useConversationStore } from "@/stores/conversation.store";
import { ConversationItem } from "./ConversationItem";
import { Button } from "../ui/Button";
import ThemeSelector from "../ui/ThemeSelector";

type Props = {
  sideview: boolean;
  onNewConversation: () => void;
  onClose?: () => void;
};

export function ConversationSidebar({
  sideview,
  onNewConversation,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    conversations,
    activeConversationId,
    isLoading,
    selectConversation,
    clearState,
  } = useStore(useConversationStore);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const logout = () => {
    clearState();
  };

  // Gestion de l'animation d'entrée/sortie
  useEffect(() => {
    if (sideview) {
      // Petit délai pour permettre le rendu avant l'animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [sideview]);

  return (
    <>
      {/* Overlay avec animation */}
      <div
        className={`fixed inset-0 bg-black md:hidden transition-opacity duration-300 z-40 ${
          isAnimating ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar avec animation */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 md:relative md:z-0 flex flex-col w-64 shrink-0 h-screen border-r border-base-200 bg-background-soft-100 transform transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header avec bouton de fermeture mobile */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-base-200">
          <div className="flex items-center gap-0">
            <img
              src="/logo.svg"
              width={40}
              className="-translate-y-1"
              alt="Favicon"
            />

            <span className="text-lg font-semibold text-title-50">
              Conversations
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewConversation}
              title="Nouvelle conversation"
              className="size-7 rounded-lg bg-primary-50 grid place-items-center text-primary-500 border border-primary-500/50 hover:bg-primary-100 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v12M1 7h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-base-200 bg-background-soft-50 text-title-50 placeholder:text-foreground-soft-400 focus:outline-none focus:ring-1 focus:ring-primary-300 transition"
          />
        </div>

        {/* Liste */}
        <div className="flex-1 max-h-11/12 overflow-y-auto px-2 pb-4 space-y-0.5">
          {isLoading && conversations.length === 0 && (
            <div className="space-y-1.5 px-1 pt-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg bg-background-soft-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-xs text-foreground-soft-400 text-center mt-8 px-2">
              {search ? "Aucun résultat" : "Aucune conversation"}
            </p>
          )}

          {filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={(id) => {
                selectConversation(id);
                // Fermer la sidebar sur mobile après sélection
                if (window.innerWidth < 768 && onClose) {
                  onClose();
                }
              }}
            />
          ))}
        </div>

        {/*Choix de théme et Logout*/}
        <div className="px-3 py-3 border-t border-base-200 space-y-2">
          {/* Theme selector */}

          <ThemeSelector />

          {/* Logout button */}
          <Button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center gap-2 p-2 rounded-lg bg-transparent text-red-700 border border-red-700/70 hover:bg-red-700/5 focus-visible:hidden outline-none focus:ring-0 focus:ring-transparent transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm">Déconnexion</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
