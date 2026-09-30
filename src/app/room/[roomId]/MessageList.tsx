"use client";

import { RefObject } from "react";
import type { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'UTC',
});

export default function MessageList({ messages, currentUserId, messagesEndRef }: MessageListProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      {messages.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No messages yet. Say hello and agree on scope.
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => {
            const mine = msg.senderId === currentUserId;
            return (
              <li
                key={msg._id ?? `${msg.senderId}-${msg.timestamp}`}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-md ${mine ? "text-right" : ""}`}>
                  {!mine && (
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      {msg.senderName || 'Unknown'}
                    </p>
                  )}
                  <div
                    className={`inline-block rounded-2xl px-3.5 py-2 text-left text-sm leading-relaxed ${
                      mine
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm border border-hairline bg-card text-ink"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <p
                    suppressHydrationWarning
                    className={`mt-1 text-[11px] tabular-nums text-muted-foreground ${
                      mine ? "text-right" : ""
                    }`}
                  >
                    {timeFormatter.format(new Date(msg.timestamp))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
