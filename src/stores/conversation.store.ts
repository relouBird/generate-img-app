import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AxiosResponse } from "axios";
import conversationService from "@/services/conversation.service";
import { MessageRoleEnum } from "@/types/conversation.type";
import type {
  ConversationSummaryType,
  MessageType,
  ConversationApiResponse,
  StartConversationPayload,
  ContinueConversationPayload,
} from "@/types/conversation.type";
import {
  rawMessagesToUIMessages,
  turnResponseToUIMessages,
} from "@/helpers/conversation.helper";

// ─── State ────────────────────────────────────────────────────────────────────

type ConversationStoreState = {
  isInitalized: boolean; // Vrai après le premier fetchAllConversations pour éviter les fetch redondants
  /** Liste des conversations (sidebar) */
  conversations: ConversationSummaryType[];
  /** ID de la conversation active */
  activeConversationId: string | null;
  /** Messages UI dénormalisés de la conversation active */
  messages: MessageType[];
  /** Vrai pendant qu'une génération est en cours */
  isGenerating: boolean;
  /** Vrai pendant le chargement de la liste ou d'une conversation */
  isLoading: boolean;
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type ConversationStoreActions = {
  /** Charge toutes les conversations (sidebar) */
  fetchAllConversations: () => Promise<void>;
  /** Charge l'historique d'une conversation et la sélectionne */
  selectConversation: (id: string) => Promise<void>;
  /** Démarre une nouvelle conversation avec un premier prompt */
  startConversation: (payload: StartConversationPayload) => Promise<void>;
  /** Continue la conversation active avec un nouveau prompt */
  continueConversation: (payload: ContinueConversationPayload) => Promise<void>;
  /** Réinitialise la conversation active (retour à l'état vide) */
  clearActiveConversation: () => void;
  clearState: () => void;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useConversationStore = create<
  ConversationStoreState & ConversationStoreActions
>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      messages: [],
      isGenerating: false,
      isLoading: false,
      isInitalized: false,
      // ── Fetch liste sidebar ──────────────────────────────────────────────────────
      fetchAllConversations: async () => {
        try {
          set({ isLoading: true });
          const service = conversationService();
          const response = await service.fetchAll();

          if (response.status === 200 || response.status === 201) {
            set({ conversations: response.data.data });
            set({ isInitalized: true });
          }
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Sélectionner + charger une conversation ──────────────────────────────────
      selectConversation: async (id: string) => {
        if (get().activeConversationId === id) return;

        try {
          set({ isLoading: true, activeConversationId: id, messages: [] });

          const service = conversationService();
          const response = await service.fetch(id);

          if (response.status === 200 || response.status === 201) {
            const raw = response.data.data; // RawConversation

            const messages = rawMessagesToUIMessages(raw.id, raw.messages);

            set({ messages });
          }
        } catch (error) {
          console.error("Failed to fetch conversation:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Nouvelle conversation ────────────────────────────────────────────────────
      startConversation: async (payload: StartConversationPayload) => {
        try {
          set({ isGenerating: true });

          const service = conversationService();
          const response: AxiosResponse<ConversationApiResponse> =
            await service.create(payload);

          if (response.status === 200 || response.status === 201) {
            const { conversationId, turnIndex, prompt, image } =
              response.data.data;

            const newMessages = turnResponseToUIMessages(
              conversationId,
              turnIndex,
              prompt,
              image,
            );

            // Le name vient du backend (prompt.slice(0,30)) — on l'infère ici
            // en attendant que fetchAllConversations le synchronise
            const newSummary: ConversationSummaryType = {
              id: conversationId,
              name: prompt.slice(0, 30),
            };

            set((state) => ({
              activeConversationId: conversationId,
              messages: newMessages,
              conversations: [newSummary, ...state.conversations],
            }));
          }
        } catch (error) {
          console.error("Failed to start conversation:", error);
          throw error;
        } finally {
          set({ isGenerating: false });
        }
      },

      // ── Continuer la conversation active ────────────────────────────────────────
      continueConversation: async (payload: ContinueConversationPayload) => {
        const { activeConversationId } = get();
        if (!activeConversationId) return;

        const optimisticTurnIndex = Math.floor(get().messages.length / 2);

        // Optimistic UI : message utilisateur immédiat
        const optimisticUserMsg: MessageType = {
          id: `${activeConversationId}-${optimisticTurnIndex}-user-optimistic`,
          role: MessageRoleEnum.USER,
          content: payload.prompt,
          turnIndex: optimisticTurnIndex,
        };

        set((state) => ({
          isGenerating: true,
          messages: [...state.messages, optimisticUserMsg],
        }));

        try {
          const service = conversationService();
          const response: AxiosResponse<ConversationApiResponse> =
            await service.continueConversation(activeConversationId, payload);

          if (response.status === 200 || response.status === 201) {
            const { conversationId, turnIndex, prompt, image } =
              response.data.data;

            const confirmedUserMsg: MessageType = {
              id: `${conversationId}-${turnIndex}-user`,
              role: MessageRoleEnum.USER,
              content: prompt,
              turnIndex,
            };

            const assistantMsg: MessageType = {
              id: `${conversationId}-${turnIndex}-assistant`,
              role: MessageRoleEnum.ASSISTANT,
              content: "",
              image,
              turnIndex,
            };

            // Remplace le message optimiste + ajoute la réponse IA
            set((state) => ({
              messages: [
                ...state.messages.filter((m) => m.id !== optimisticUserMsg.id),
                confirmedUserMsg,
                assistantMsg,
              ],
            }));
          }
        } catch (error) {
          // Rollback : retire le message optimiste
          set((state) => ({
            messages: state.messages.filter(
              (m) => m.id !== optimisticUserMsg.id,
            ),
          }));
          console.error("Failed to continue conversation:", error);
          throw error;
        } finally {
          set({ isGenerating: false });
        }
      },

      // ── Reset ────────────────────────────────────────────────────────────────────
      clearActiveConversation: () =>
        set({ activeConversationId: null, messages: [] }),

      // ── Reset State ──────────────────────────────────────────────────────────────
      clearState: () =>
        set({
          conversations: [],
          activeConversationId: null,
          messages: [],
          isGenerating: false,
          isLoading: false,
          isInitalized: false,
        }),
    }),
    {
      name: "conversation-storage", // nom de la clé dans le storage
      storage: createJSONStorage(() => localStorage), // utilise localStorage
    },
  ),
);
