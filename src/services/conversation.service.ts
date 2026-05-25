import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type {
  ConversationApiResponse,
  GetConversationApiResponse,
  GetAllConversationsApiResponse,
  StartConversationPayload,
  ContinueConversationPayload,
} from "@/types/conversation.type";

export default function conversationService() {
  /**
   * Démarre une nouvelle conversation (POST /conversations)
   */
  const create = async (
    payload: StartConversationPayload,
  ): Promise<AxiosResponse<ConversationApiResponse>> => {
    return await request(`/conversations`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Continue une conversation existante (POST /conversations/:id/continue)
   */
  const continueConversation = async (
    id: string,
    payload: ContinueConversationPayload,
  ): Promise<AxiosResponse<ConversationApiResponse>> => {
    return await request(`/conversations/${id}/continue`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Récupère l'historique complet d'une conversation (GET /conversations/:id)
   */
  const fetch = async (
    id: string,
  ): Promise<AxiosResponse<GetConversationApiResponse>> => {
    return await request(`/conversations/${id}`, {
      method: "get",
    });
  };

  /**
   * Récupère la liste de toutes les conversations (GET /conversations/all)
   */
  const fetchAll = async (): Promise<
    AxiosResponse<GetAllConversationsApiResponse>
  > => {
    return await request(`/conversations/all`, {
      method: "get",
    });
  };

  return {
    create,
    continueConversation,
    fetch,
    fetchAll,
  };
}
