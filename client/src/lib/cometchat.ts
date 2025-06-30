import { CometChat } from "@cometchat/chat-sdk-javascript";

const APP_ID = import.meta.env.VITE_COMETCHAT_APP_ID || "278109ec43f5d417";
const REGION = import.meta.env.VITE_COMETCHAT_REGION || "in";
const AUTH_KEY = import.meta.env.VITE_COMETCHAT_AUTH_KEY || "6ea9d276374ad88436c4f66cc035e467b54548ed";

let isInitialized = false;

export interface CometChatUser {
  uid: string;
  name: string;
  avatar?: string;
  status?: string;
}

export interface CometChatMessage {
  id: string;
  text: string;
  sender: CometChatUser;
  receiver: string;
  sentAt: number;
  type: string;
}

export class CometChatService {
  static async initialize(): Promise<void> {
    if (isInitialized) return;

    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(REGION)
      .autoEstablishSocketConnection(true)
      .build();

    try {
      await CometChat.init(APP_ID, appSetting);
      isInitialized = true;
      console.log("CometChat initialized successfully");
    } catch (error) {
      console.error("CometChat initialization failed:", error);
      throw error;
    }
  }

  static async createUser(uid: string, name: string): Promise<any> {
    const user = new CometChat.User(uid);
    user.setName(name);

    try {
      const createdUser = await CometChat.createUser(user, AUTH_KEY);
      console.log("User created successfully:", createdUser);
      return createdUser;
    } catch (error: any) {
      if (error.code === "ERR_UID_ALREADY_EXISTS") {
        console.log("User already exists");
        return { uid, name };
      }
      console.error("User creation failed:", error);
      throw error;
    }
  }

  static async loginUser(uid: string): Promise<any> {
    try {
      const loggedInUser = await CometChat.login(uid, AUTH_KEY);
      console.log("Login successful:", loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  static async logoutUser(): Promise<void> {
    try {
      await CometChat.logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  static async getLoggedInUser(): Promise<any> {
    try {
      const user = await CometChat.getLoggedInUser();
      return user;
    } catch (error) {
      console.error("Get logged in user failed:", error);
      return null;
    }
  }

  static async getUsers(limit: number = 30): Promise<any[]> {
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();

    try {
      const usersList = await usersRequest.fetchNext();
      console.log("Users list fetched:", usersList);
      return usersList;
    } catch (error) {
      console.error("Users list fetching failed:", error);
      throw error;
    }
  }

  static async sendMessage(receiverUID: string, messageText: string): Promise<any> {
    const receiverType = CometChat.RECEIVER_TYPE.USER;

    const textMessage = new CometChat.TextMessage(
      receiverUID,
      messageText,
      receiverType
    );

    try {
      const message = await CometChat.sendMessage(textMessage);
      console.log("Message sent successfully:", message);
      return message;
    } catch (error) {
      console.error("Message sending failed:", error);
      throw error;
    }
  }

  static async getMessages(uid: string, limit: number = 50): Promise<any[]> {
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(uid)
      .setLimit(limit)
      .build();

    try {
      const messages = await messagesRequest.fetchPrevious();
      console.log("Messages fetched:", messages);
      return messages;
    } catch (error) {
      console.error("Message fetching failed:", error);
      throw error;
    }
  }

  static addMessageListener(listenerId: string, callback: (message: any) => void): void {
    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: any) => {
          console.log("Text message received:", textMessage);
          callback(textMessage);
        },
        onMediaMessageReceived: (mediaMessage: any) => {
          console.log("Media message received:", mediaMessage);
          callback(mediaMessage);
        }
      })
    );
  }

  static removeMessageListener(listenerId: string): void {
    CometChat.removeMessageListener(listenerId);
  }

  static addUserListener(listenerId: string, callbacks: {
    onUserOnline?: (user: any) => void;
    onUserOffline?: (user: any) => void;
  }): void {
    CometChat.addUserListener(
      listenerId,
      new CometChat.UserListener({
        onUserOnline: callbacks.onUserOnline || (() => {}),
        onUserOffline: callbacks.onUserOffline || (() => {})
      })
    );
  }

  static removeUserListener(listenerId: string): void {
    CometChat.removeUserListener(listenerId);
  }
}
