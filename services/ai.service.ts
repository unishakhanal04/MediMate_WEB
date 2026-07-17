import { apiFetch } from "./api-client";
import { AiMessage } from "../types/ai.types";

export type { AiMessage };

export const aiService = {
  async sendMessage(message: string) {
    return apiFetch<AiMessage>("/api/v1/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  async getHistory() {
    return apiFetch<AiMessage[]>("/api/v1/ai/history");
  },

  async clearHistory() {
    return apiFetch<{ success: boolean }>("/api/v1/ai/history", { method: "DELETE" });
  },
};
