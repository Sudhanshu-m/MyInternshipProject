import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserList } from "@/components/UserList";
import { ChatInterface } from "@/components/ChatInterface";
import { LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-full">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">StudyBuddy</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1">
          <div className="w-80 border-r border-border">
            <UserList onUserSelect={handleUserSelect} />
          </div>
          <div className="flex-1">
            {selectedUser ? (
              <ChatInterface selectedUser={selectedUser} onBack={handleBack} />
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <MessageCircle className="mx-auto h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a study partner</p>
                  <p className="text-sm">Choose someone from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex-1">
          {selectedUser ? (
            <ChatInterface selectedUser={selectedUser} onBack={handleBack} />
          ) : (
            <UserList onUserSelect={handleUserSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
