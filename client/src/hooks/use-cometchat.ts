import { useState, useEffect, useCallback } from "react";
import { CometChatService } from "@/lib/cometchat";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const usersList = await CometChatService.getUsers();
      setUsers(usersList);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
}

export function useMessages(partnerId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!partnerId) return;

    setIsLoading(true);
    setError(null);
    try {
      const messagesList = await CometChatService.getMessages(partnerId);
      setMessages(messagesList.reverse()); // Reverse to show oldest first
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!partnerId || !text.trim()) return;

    try {
      const message = await CometChatService.sendMessage(partnerId, text);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err: any) {
      setError(err.message || "Failed to send message");
      throw err;
    }
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      fetchMessages();

      // Set up real-time message listener
      const listenerId = `MESSAGE_LISTENER_${partnerId}`;
      CometChatService.addMessageListener(listenerId, (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        CometChatService.removeMessageListener(listenerId);
      };
    }
  }, [partnerId, fetchMessages]);

  return { messages, isLoading, error, sendMessage, refetch: fetchMessages };
}

export function useUserPresence() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const listenerId = "USER_PRESENCE_LISTENER";
    
    CometChatService.addUserListener(listenerId, {
      onUserOnline: (user) => {
        setOnlineUsers(prev => new Set(prev).add(user.uid));
      },
      onUserOffline: (user) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(user.uid);
          return newSet;
        });
      }
    });

    return () => {
      CometChatService.removeUserListener(listenerId);
    };
  }, []);

  return { onlineUsers };
}
