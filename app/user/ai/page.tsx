"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { useConfirmDialog } from "../../../contexts/ConfirmDialogContext";
import { aiService } from "../../../services/ai.service";
import { AiMessage } from "../../../types/ai.types";
import { AiUsage } from "../../../types/subscription.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { AIChat } from "../../../components/ai/AIChat";
import { ChatInput } from "../../../components/ai/ChatInput";
import { SuggestedPrompts } from "../../../components/ai/SuggestedPrompts";
import { ConversationSidebar, ConversationGroup } from "../../../components/ai/ConversationSidebar";
import { MedicalDisclaimer } from "../../../components/ai/MedicalDisclaimer";

const greeting: AiMessage = {
  role: "assistant",
  content: "Hello! I'm your AI health assistant. How can I help you today?",
};

const suggestedPrompts = [
  "What should I do if I miss a dose?",
  "How do I know if I need a refill?",
  "What are common side effects to watch for?",
];

const groupMessagesByDate = (messages: AiMessage[]): ConversationGroup[] => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups = new Map<string, AiMessage[]>();

  messages.forEach((message) => {
    if (!message.createdAt) return;
    const day = new Date(message.createdAt).toDateString();
    const label = day === today ? "Today" : day === yesterday ? "Yesterday" : "Earlier";
    const list = groups.get(label) ?? [];
    list.push(message);
    groups.set(label, list);
  });

  return ["Today", "Yesterday", "Earlier"]
    .filter((label) => groups.has(label))
    .map((label) => ({ label, messages: groups.get(label)! }));
};

export default function AIAssistantPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const confirmDialog = useConfirmDialog();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([greeting]);
  const [sending, setSending] = useState(false);
  const [usage, setUsage] = useState<AiUsage | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchHistory();
    fetchUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchUsage = () => {
    aiService
      .getUsage()
      .then(setUsage)
      .catch((error) => console.error("Failed to load AI usage:", error));
  };

  const fetchHistory = () => {
    setLoading(true);
    setLoadError(false);
    aiService
      .getHistory()
      .then((history) => {
        if (history.length > 0) {
          setMessages(history);
        }
      })
      .catch((error) => {
        console.error("Failed to load AI chat history:", error);
        setLoadError(true);
        toast.error("Unable to load your chat history.");
      })
      .finally(() => setLoading(false));
  };

  const sendText = async (text: string) => {
    if (!text.trim() || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setSending(true);

    try {
      const reply = await aiService.sendMessage(text.trim());
      setMessages((prev) => [...prev, reply]);
      fetchUsage();
    } catch (error) {
      console.error("Failed to send message:", error);
      const message = error instanceof Error ? error.message : "Failed to reach the AI assistant";
      toast.error(message);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    const confirmed = await confirmDialog({
      title: "Clear chat history",
      message: "Clear your entire chat history with the AI assistant?",
    });
    if (!confirmed) return;

    try {
      await aiService.clearHistory();
      setMessages([greeting]);
      toast.success("Chat history cleared.");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Unable to clear chat history. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner message="Loading AI assistant..." />;
  }

  const historyGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        icon="🤖"
        title="AI Health Assistant"
        description="Ask questions about your medications and health."
        action={
          <button
            onClick={handleClearHistory}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            Clear History
          </button>
        }
      />

      {loadError && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <span>Something went wrong loading your chat history.</span>
          <button onClick={fetchHistory} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      <div className="mb-4">
        <MedicalDisclaimer />
      </div>

      {usage && !usage.isPremium && usage.limit !== null && (
        <div
          className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            usage.used >= usage.limit
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400"
          }`}
        >
          <span>
            {usage.used >= usage.limit
              ? "You've reached your free plan's monthly AI message limit."
              : `${usage.used}/${usage.limit} free AI messages used this month.`}
          </span>
          <Link href="/user/subscription" className="font-semibold underline">
            Upgrade for unlimited
          </Link>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        <ConversationSidebar groups={historyGroups} onNewConversation={handleClearHistory} />

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <AIChat messages={messages} sending={sending} />

          <div className="flex flex-col gap-3 px-4 pt-3">
            <SuggestedPrompts prompts={suggestedPrompts} onSelect={sendText} disabled={sending} />
          </div>

          <ChatInput onSend={sendText} disabled={sending} />
        </div>
      </div>
    </div>
  );
}
