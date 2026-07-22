import { apiFetch } from "./api-client";
import { CreateFeedbackDTO, Feedback } from "../types/feedback.types";

export const feedbackService = {
  async getMyFeedback(): Promise<Feedback[]> {
    return apiFetch<Feedback[]>("/api/v1/feedback");
  },

  async submit(data: CreateFeedbackDTO): Promise<Feedback> {
    return apiFetch<Feedback>("/api/v1/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
