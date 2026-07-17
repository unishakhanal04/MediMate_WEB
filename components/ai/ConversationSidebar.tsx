import { AiMessage } from "../../types/ai.types";

export interface ConversationGroup {
  label: string;
  messages: AiMessage[];
}

interface ConversationSidebarProps {
  groups: ConversationGroup[];
  onNewConversation: () => void;
}

export function ConversationSidebar({ groups, onNewConversation }: ConversationSidebarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-gray-100 pb-4 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
      <button
        onClick={onNewConversation}
        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
      >
        + New Conversation
      </button>

      <div className="flex flex-col gap-3 overflow-y-auto lg:max-h-[28rem]">
        {groups.length === 0 ? (
          <p className="text-xs text-gray-400">No conversation history yet.</p>
        ) : (
          groups.map((group) => {
            const lastMessage = group.messages[group.messages.length - 1];
            return (
              <div key={group.label}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {group.label}
                </p>
                {lastMessage && (
                  <p className="truncate text-sm text-gray-600">{lastMessage.content}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
