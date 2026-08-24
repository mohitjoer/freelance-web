"use client";

import { RefObject } from "react";
import type { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'UTC',
});

export default function MessageList({ messages, currentUserId, loading, messagesEndRef }: MessageListProps) {
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-500 font-medium">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h3>
              <p className="text-slate-500">Be the first to start the conversation in this room!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUserId;

            return (
              <div
                key={msg._id ?? `${msg.senderId}-${msg.timestamp}`}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  {!isCurrentUser && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {(msg.senderName || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white text-slate-900 shadow-sm border border-slate-200 rounded-bl-md"
                    }`}
                  >
                    
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <div className="flex items-center justify-end mt-2">
                      <span
                        suppressHydrationWarning
                        className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-slate-400'}`}
                      >
                        {timeFormatter.format(new Date(msg.timestamp))}
                      </span>
                      {isCurrentUser && (
                        <svg className="w-3 h-3 ml-1 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
