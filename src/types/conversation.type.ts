// ─── Enums miroir du schema Prisma ────────────────────────────────────────────
// Toujours synchronisés avec src/dto/enums (backend)

export const MessageRoleEnum = {
  USER: "USER",
  ASSISTANT: "ASSISTANT",
  SYSTEM: "SYSTEM",   // jamais exposé côté client, mais présent pour exhaustivité
} as const;

export const MessageTypeEnum = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  FILE: "FILE",
} as const;

// ─── Message brut tel que retourné par Prisma / GET /conversations/:id ────────

export type RawMessage = {
  id:             string;
  conversationId: string;
  role:           typeof MessageRoleEnum[keyof typeof MessageRoleEnum];
  type:           typeof MessageTypeEnum[keyof typeof MessageTypeEnum];
  content:        string;   // texte brut OU filename (ex: "uuid_turn0.png")
  order:          number;
  createdAt:      string;   // ISO string après sérialisation JSON
};

// ─── Conversation brute retournée par GET /conversations/:id ──────────────────

export type RawConversation = {
  id:        string;
  name:      string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  messages:  RawMessage[];
};

// ─── Image générée par l'IA ───────────────────────────────────────────────────

export type GeneratedImageType = {
  dataUrl:   string;    // "data:image/png;base64,..." prêt pour <img src>
  format:    "base64";
  data:      string;    // raw base64 string
  filepath?: string;    // présent uniquement sur le POST /conversations (premier turn)
};

// ─── Turn = un échange reconstruit (prompt utilisateur + réponse IA) ──────────
// Construit côté front à partir d'une paire de RawMessage

export type TurnType = {
  turnIndex: number;
  prompt:    string;
  image:     GeneratedImageType;
};

// ─── Message UI affiché dans la ChatZone ──────────────────────────────────────
// Dénormalisé depuis un TurnType pour l'affichage (1 turn = 2 messages UI)

export type MessageRole = typeof MessageRoleEnum[keyof typeof MessageRoleEnum];

export type MessageType = {
  id:        string;              // `${conversationId}-${turnIndex}-${role}`
  role:      MessageRole;
  content:   string;              // texte du prompt (user) ou vide (assistant)
  image?:    GeneratedImageType;  // uniquement pour le rôle assistant
  turnIndex: number;
};

// ─── Conversation complète reconstituée (pour la ChatZone) ───────────────────

export type ConversationType = {
  id:    string;
  name:  string;
  turns: TurnType[];
};

// ─── Résumé conversation (retourné par GET /conversations/all) ────────────────

export type ConversationSummaryType = {
  id:   string;
  name: string;
};

// ─── Payloads API ─────────────────────────────────────────────────────────────

export type StartConversationPayload = {
  prompt:       string;
  aspectRatio?: string;  // champ réel du backend (pas size)
};

export type ContinueConversationPayload = {
  prompt:       string;
  aspectRatio?: string;
};

// ─── Réponses API ─────────────────────────────────────────────────────────────

// POST /conversations  &  POST /conversations/:id/continue
export type ConversationApiResponse = {
  success: boolean;
  data: {
    conversationId: string;
    turnIndex:      number;
    prompt:         string;
    image:          GeneratedImageType;
  };
};

// GET /conversations/:id — retourne la conversation avec ses messages bruts
export type GetConversationApiResponse = {
  success: boolean;
  data:    RawConversation;
};

// GET /conversations/all
export type GetAllConversationsApiResponse = {
  success: boolean;
  data:    ConversationSummaryType[];
};