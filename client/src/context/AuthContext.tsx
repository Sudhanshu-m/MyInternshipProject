import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CometChatService } from "@/lib/cometchat";

interface AuthContextType {
  user: any | null;
  login: (uid: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await CometChatService.initialize();
      const loggedInUser = await CometChatService.getLoggedInUser();
      setUser(loggedInUser);
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (uid: string, name: string) => {
    setIsLoading(true);
    try {
      // Try to create user first (will fail if exists, which is fine)
      await CometChatService.createUser(uid, name);
      // Login the user
      const loggedInUser = await CometChatService.loginUser(uid);
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await CometChatService.logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
