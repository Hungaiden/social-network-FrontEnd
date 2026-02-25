import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface WebSocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;

  connect(
    token: string,
    onMessageReceived: (message: WebSocketMessage) => void,
  ) {
    if (this.connected) {
      console.log("WebSocket already connected");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");

    this.client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected successfully");
        this.connected = true;

        // Subscribe to receive messages
        this.client?.subscribe("/user/queue/messages", (message) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            console.log("Received message:", receivedMessage);
            onMessageReceived(receivedMessage);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        this.connected = false;
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        this.connected = false;
      },
    });

    this.client.activate();
  }

  sendMessage(conversationId: string, senderId: string, content: string) {
    if (!this.connected || !this.client) {
      console.error("WebSocket is not connected");
      throw new Error("WebSocket is not connected");
    }

    const message = {
      conversationId,
      senderId,
      content,
    };

    console.log("Sending message:", message);

    this.client.publish({
      destination: "/app/send-message",
      body: JSON.stringify(message),
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log("WebSocket disconnected");
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
