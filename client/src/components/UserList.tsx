import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, RefreshCw } from "lucide-react";
import { useUsers, useUserPresence } from "@/hooks/use-cometchat";
import { useAuth } from "@/context/AuthContext";

interface UserListProps {
  onUserSelect: (user: any) => void;
}

export function UserList({ onUserSelect }: UserListProps) {
  const { user: currentUser } = useAuth();
  const { users, isLoading, error, refetch } = useUsers();
  const { onlineUsers } = useUserPresence();

  const filteredUsers = users.filter(user => user.uid !== currentUser?.uid);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Study Partners
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Study Partners
            </span>
            <Button size="sm" variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Study Partners ({filteredUsers.length})
          </span>
          <Button size="sm" variant="outline" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No study partners available</p>
            <p className="text-sm">Check back later or create more users</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <div
                key={user.uid}
                className="flex items-center space-x-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
                onClick={() => onUserSelect(user)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name?.charAt(0).toUpperCase() || user.uid.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 status-indicator ${
                      onlineUsers.has(user.uid) ? "status-online" : "status-offline"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">@{user.uid}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {onlineUsers.has(user.uid) ? "Online" : "Offline"}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
