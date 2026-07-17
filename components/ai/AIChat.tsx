"use client";

import { useEffect, useRef } from "react";
import { AiMessage } from "../../types/ai.types";
import { MessageBubble } from "./MessageBubble";
import { AILoading } from "./AILoading";
import { AIEmptyState } from "./AIEmptyState";

interface AIChatProps {
  messages: AiMessage[];
  sending: boolean;
}

export function AIChat({ messages, sending }: AIChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  if (messages.length === 0 && !sending) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <AIEmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {sending && <AILoading />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
