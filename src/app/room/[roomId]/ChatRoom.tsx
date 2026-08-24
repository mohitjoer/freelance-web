"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { UserButton, useUser } from '@/components/auth';
import { io, Socket } from "socket.io-client";
import BackButton from "@/components/backbutton";
import MessageList from "./MessageList";
import type { Message, ChatMessageEvent } from "./types";

export default function ChatRoom({ roomId, initialMessages }: { roomId: string; initialMessages: Message[] }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [sending, setSending] = useState(false);
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
  useEffect(() => {
    if (!roomId || !isSignedIn || !user?.id) return;

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      transports: ['websocket'],
      withCredentials: true
    });

    socketRef.current = socket;

    // Connection event handlers
    const onConnect = () => {
      console.log('Connected to server:', socket.id);
      setIsConnected(true);

      // Join the room
      socket.emit('joinRoom', roomId);
    };

    const onDisconnect = () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    };

    // Room event handlers
    const onRoomJoined = (data: unknown) => {
      console.log('Successfully joined room:', data);
    };

    const onUserJoined = (data: unknown) => {
      console.log('User joined:', data);
    };

    const onUserLeft = (data: unknown) => {
      console.log('User left:', data);
    };

    // Message event handlers
    const onChatMessage = (data: ChatMessageEvent) => {
      console.log('Received message:', data);

      const newMessage: Message = {
        _id: data._id || Date.now().toString(),
        senderId: data.senderId,
        senderName: data.senderName,
        role: data.role || 'user',
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        socketId: data.socketId
      };

      setMessages(prev => {
        // Avoid duplicate messages
        const exists = prev.some(msg =>
          msg._id === newMessage._id ||
          (msg.message === newMessage.message &&
           msg.senderId === newMessage.senderId &&
           Math.abs(new Date(msg.timestamp).getTime() - new Date(newMessage.timestamp).getTime()) < 1000)
        );

        if (exists) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('roomJoined', onRoomJoined);
    socket.on('userJoined', onUserJoined);
    socket.on('userLeft', onUserLeft);
    socket.on('chatMessage', onChatMessage);

    // Cleanup on unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('roomJoined', onRoomJoined);
      socket.off('userJoined', onUserJoined);
      socket.off('userLeft', onUserLeft);
      socket.off('chatMessage', onChatMessage);
      socket.disconnect();
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
      senderId: user.id,
      senderName: user.firstName || 'Anonymous',
      role: "user",
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    console.log("Sending message:", messageData);

    // Send via Socket.IO for real-time delivery
    socketRef.current.emit('chatMessage', messageData);

    // Also save to database via API
    try {
      const response = await fetch(`/api/room/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: messageData.senderId,
          role: messageData.role,
          message: messageData.message
        }),
      });

      if (!response.ok) {
        console.error('Failed to save message to database');
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h2>
          <p className="text-slate-600">Please sign in to access the chat room and connect with others.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton/>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Chat Room</h1>
                    <p className="text-sm text-slate-500 font-mono">ID: {roomId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${isConnected ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.firstName || 'You'}</p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      <MessageList
        messages={messages}
        currentUserId={user?.id}
        loading={false}
        messagesEndRef={messagesEndRef}
      />


      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              aria-label="Type your message"
              className="w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3 pr-12 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder={
                isConnected 
                  ? "Type your message..." 
                  : "Connecting..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!user?.id || !isConnected}
            />
            {newMessage.trim() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={sending || !newMessage.trim() || !user?.id || !isConnected}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {!newMessage.trim() && (
            <button
              type="button"
              aria-label="Add attachment"
              className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}