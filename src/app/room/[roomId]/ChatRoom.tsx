"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { Send } from "lucide-react";
import { UserButton, useUser } from '@/components/auth';
import { io, Socket } from "socket.io-client";
import BackButton from "@/components/backbutton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageList from "./MessageList";
import type { Message, ChatMessageEvent } from "./types";

export default function ChatRoom({ roomId, initialMessages }: { roomId: string; initialMessages: Message[] }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const sendingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO connection
  //
  // The fetch is one-shot websocket auth (a signed room token), not a data
  // fetch: it is aborted on cleanup, and the effect returns a cleanup that
  // disconnects the socket. These rules target data-loading effects and fire on
  // any fetch or subscription inside a useEffect.
  // react-doctor-disable-next-line -- false positive, see above
  useEffect(() => {
    if (!roomId || !isSignedIn || !user?.id) return;

    let cancelled = false;
    let socket: Socket | null = null;
    const abort = new AbortController();

    // The socket server authorises nothing itself; it verifies a signed room
    // token that the app issues only to participants of this job.
    const connect = async () => {
      let token: string;
      try {
        const res = await fetch(`/api/room/${roomId}/socket-token`, { signal: abort.signal });
        if (!res.ok) {
          if (cancelled) return;
          setAccessError(
            res.status === 403
              ? "You do not have access to this chat."
              : "Sign in again to join this chat."
          );
          return;
        }
        token = (await res.json()).token as string;
      } catch (err) {
        if (cancelled || (err as Error).name === 'AbortError') return;
        setAccessError("Could not verify access to this chat.");
        return;
      }

      if (cancelled) return;

      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
        transports: ['websocket'],
        withCredentials: true,
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        socket!.emit('joinRoom', roomId);
      });

      socket.on('disconnect', () => setIsConnected(false));

      socket.on('connect_error', (err: Error) => {
        console.error('Socket rejected:', err.message);
        setIsConnected(false);
        setAccessError(
          err.message === 'unauthorized'
            ? 'Your session expired. Sign in again to join this chat.'
            : 'You do not have access to this chat.'
        );
      });

      socket.on('roomError', (data: unknown) => {
        console.error('Room error:', data);
        setAccessError('You do not have access to this chat.');
      });

      socket.on('userJoined', (data: unknown) => console.log('User joined:', data));
      socket.on('userLeft', (data: unknown) => console.log('User left:', data));

      socket.on('chatMessage', (data: ChatMessageEvent) => {
        const incoming: Message = {
          _id: data._id || `${data.senderId}-${data.timestamp}`,
          senderId: data.senderId,
          senderName: data.senderName,
          role: data.role || 'user',
          message: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
          socketId: data.socketId,
        };

        setMessages(prev => {
          const exists = prev.some(msg => msg._id === incoming._id);
          return exists ? prev : [...prev, incoming];
        });
      });
    };

    connect();

    // Cleanup on unmount
    return () => {
      cancelled = true;
      abort.abort();
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [roomId, isSignedIn, user?.id]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    if (!newMessage.trim() || !user?.id || !socketRef.current?.connected) return;
    sendingRef.current = true;
    setSending(true);

    const messageData = {
      roomId,
      message: newMessage.trim(),
    };

    console.log("Sending message:", messageData);

    // Send via Socket.IO for real-time delivery
    socketRef.current.emit('chatMessage', messageData);

    // Also save to database via API. The server derives senderId/role from the
    // session, so they are deliberately not sent here.
    try {
      const response = await fetch(`/api/room/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageData.message }),
      });

      if (!response.ok) {
        console.error('Failed to save message to database', response.status);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }

    setNewMessage("");
  };

  if (!isLoaded) {
    return (
      <div className="flex h-dvh items-center justify-center bg-canvas">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-dvh items-center justify-center bg-canvas px-5">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold text-ink">Sign in to open this chat</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Conversations are private to the two people working on the project.
          </p>
        </div>
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="flex h-dvh items-center justify-center bg-canvas px-5">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold text-ink">Chat unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{accessError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-hairline bg-card px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight text-ink">Project chat</h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`size-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-destructive"}`}
                aria-hidden
              />
              {isConnected ? "Connected" : "Reconnecting…"}
            </p>
          </div>
        </div>
        <UserButton />
      </header>

      <MessageList
        messages={messages}
        currentUserId={user?.id}
        messagesEndRef={messagesEndRef}
      />

      <form
        onSubmit={handleSendMessage}
        className="flex shrink-0 items-center gap-2 border-t border-hairline bg-card px-4 py-3 sm:px-6"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Write a message" : "Connecting…"}
          disabled={!user?.id || !isConnected}
          aria-label="Message"
        />
        <Button type="submit" size="icon" disabled={sending || !newMessage.trim() || !isConnected}>
          <Send className="size-4" aria-hidden />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}