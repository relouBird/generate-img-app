// ─── Helpers ──────────────────────────────────────────────────────────────────

import {
  MessageRoleEnum,
  MessageTypeEnum,
  type GeneratedImageType,
  type MessageType,
  type RawMessage,
} from "@/types/conversation.type";

/**
 * Reconstruit les messages UI depuis les RawMessage[] Prisma.
 *
 * Le backend stocke les messages en paires ordonnées :
 *   order 0 → USER / TEXT  (prompt)
 *   order 1 → ASSISTANT / IMAGE (filename)
 *   order 2 → USER / TEXT  (prompt suivant)
 *   ...
 *
 * On regroupe par paires pour reconstruire les turns, puis on dénormalise
 * chaque turn en deux MessageType pour l'affichage dans la ChatZone.
 *
 * IMPORTANT : les messages ASSISTANT de type IMAGE contiennent un filename
 * (ex: "uuid_turn0.png"), pas une dataUrl. On ne peut pas afficher l'image
 * directement sans un endpoint de fichier servi par le backend.
 * → On construit une GeneratedImageType partielle avec filepath uniquement.
 */
export function rawMessagesToUIMessages(
  conversationId: string,
  rawMessages: RawMessage[],
): MessageType[] {
  const uiMessages: MessageType[] = [];

  // Les messages sont déjà triés par order (orderBy: { order: 'asc' } côté backend)
  // On itère par pas de 2 pour traiter chaque paire USER + ASSISTANT
  for (let i = 0; i < rawMessages.length; i += 2) {
    const userMsg = rawMessages[i];
    const assistantMsg = rawMessages[i + 1];
    const turnIndex = i / 2;

    // Message utilisateur
    if (userMsg && userMsg.role === MessageRoleEnum.USER) {
      uiMessages.push({
        id: `${conversationId}-${turnIndex}-user`,
        role: MessageRoleEnum.USER,
        content: userMsg.content,
        turnIndex,
      });
    }

    // Message assistant — le content est un filename, pas une dataUrl
    if (
      assistantMsg &&
      assistantMsg.role === MessageRoleEnum.ASSISTANT &&
      assistantMsg.type === MessageTypeEnum.IMAGE
    ) {
      // Le filename seul ne suffit pas pour afficher l'image.
      // Le backend doit exposer un endpoint statique ou une route /files/:filename.
      // On construit une GeneratedImageType avec seulement filepath pour l'instant.
      const image: GeneratedImageType = {
        dataUrl: assistantMsg.content, // sera rempli si le backend sert le fichier statiquement
        format: "base64",
        data: "",
        filepath: assistantMsg.content, // ex: "uuid_turn0.png"
      };

      uiMessages.push({
        id: `${conversationId}-${turnIndex}-assistant`,
        role: MessageRoleEnum.ASSISTANT,
        content: "",
        image,
        turnIndex,
      });
    }
  }

  return uiMessages;
}

/**
 * Transforme la réponse d'un POST (turn frais avec base64) en deux messages UI.
 * Ici on a la dataUrl complète — utilisé après startConversation et continueConversation.
 */
export function turnResponseToUIMessages(
  conversationId: string,
  turnIndex: number,
  prompt: string,
  image: GeneratedImageType,
): MessageType[] {
  return [
    {
      id: `${conversationId}-${turnIndex}-user`,
      role: MessageRoleEnum.USER,
      content: prompt,
      turnIndex,
    },
    {
      id: `${conversationId}-${turnIndex}-assistant`,
      role: MessageRoleEnum.ASSISTANT,
      content: "",
      image,
      turnIndex,
    },
  ];
}
