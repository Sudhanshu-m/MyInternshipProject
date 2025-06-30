import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";

export default function Chat() {
  const [location] = useLocation();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    // Parse user data from URL params or state
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const userData = urlParams.get('user');
    if (userData) {
      try {
        setSelectedUser(JSON.parse(decodeURIComponent(userData)));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [location]);

  const handleBack = () => {
    // Navigate back to dashboard
    window.history.back();
  };

  if (!selectedUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatInterface selectedUser={selectedUser} onBack={handleBack} />
    </div>
  );
}
