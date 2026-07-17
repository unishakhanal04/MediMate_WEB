export type AiMessageRole = "user" | "assistant";

export interface AiMessage {
  role: AiMessageRole;
  content: string;
  createdAt?: string;
}

export interface ChatResponse {
  role: "assistant";
  content: string;
}

export interface AiHistoryResponse {
  success: boolean;
  message: string;
  data: AiMessage[];
}
