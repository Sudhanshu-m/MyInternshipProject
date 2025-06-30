import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { useMessages } from "@/hooks/use-cometchat";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

interface ChatInterfaceProps {
  selectedUser: any;
  onBack: () => void;
}

export function ChatInterface({ selectedUser, onBack }: ChatInterfaceProps) {
  const { user: currentUser } = useAuth();
  const { messages, isLoading, error, sendMessage } = useMessages(selectedUser?.uid);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      await sendMessage(messageText);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "HH:mm");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Button
            size="sm"
            variant="ghost"
            className="mr-3 lg:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {selectedUser.name?.charAt(0).toUpperCase() || selectedUser.uid.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">@{selectedUser.uid}</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start a conversation with {selectedUser.name}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isCurrentUser = message.sender?.uid === currentUser?.uid;
                const showAvatar = index === 0 || messages[index - 1]?.sender?.uid !== message.sender?.uid;

                return (
                  <div
                    key={message.id || index}
                    className={`flex items-end space-x-2 ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {showAvatar && !isCurrentUser && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted text-xs">
                          {message.sender?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!showAvatar && !isCurrentUser && <div className="w-6" />}

                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                      <div className={`chat-bubble ${isCurrentUser ? "chat-bubble-user" : "chat-bubble-other"}`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {formatMessageTime(message.sentAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={isSending || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
