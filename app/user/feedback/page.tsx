"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { feedbackService } from "../../../services/feedback.service";
import { Feedback, FeedbackType } from "../../../types/feedback.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/dashboard/Card";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/common/EmptyState";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

const typeOptions: { value: FeedbackType; label: string }[] = [
  { value: "bug_report", label: "Bug Report" },
  { value: "suggestion", label: "Suggestion" },
  { value: "feature_request", label: "Feature Request" },
  { value: "general", label: "General Feedback" },
];

const statusStyle: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  reviewed: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export default function FeedbackPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [history, setHistory] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState<FeedbackType>("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchHistory = async () => {
    try {
      const data = await feedbackService.getMyFeedback();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load feedback history:", error);
      toast.error("Unable to load your feedback history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.submit({ type, subject: subject.trim(), message: message.trim() });
      toast.success("Feedback submitted. Thank you!");
      setSubject("");
      setMessage("");
      fetchHistory();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Unable to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon="💬"
        title="Feedback"
        description="Report a bug, suggest an improvement, or tell us what's on your mind."
      />

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FeedbackType)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Reminder time picker doesn't save"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Message *</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened, or what you'd like to see."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <Button type="submit" disabled={submitting} className="self-start">
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Your Feedback History</h2>
        {loading ? (
          <LoadingSpinner message="Loading your feedback..." />
        ) : history.length === 0 ? (
          <EmptyState icon="💬" title="No feedback yet" description="Anything you submit will show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <Card key={item._id} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{item.subject}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {typeOptions.find((o) => o.value === item.type)?.label} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
