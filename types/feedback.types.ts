export type FeedbackType = "bug_report" | "suggestion" | "feature_request" | "general";
export type FeedbackStatus = "new" | "reviewed" | "resolved";

export interface Feedback {
  _id: string;
  userId: string;
  type: FeedbackType;
  subject: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackDTO {
  type: FeedbackType;
  subject: string;
  message: string;
}
