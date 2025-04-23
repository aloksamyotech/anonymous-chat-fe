import { useEffect, useRef } from "react";
import { connectSocket } from "@/utils/socket";
import { MessageProps } from "@/types";

interface UseSocketProps {
  onMessageReceived: (message: MessageProps, chatId: string) => void;
  selectedChatId: string;
}

export const useSocket = ({ onMessageReceived, selectedChatId }: UseSocketProps) => {
  const socketRef = useRef<any>(null);

  const sendMessage = (message: MessageProps) => {
    socketRef.current?.emit("message", {
      type: "group-chat",
      payload: {
        message: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
      },
    });
  };

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket");
    });

    socket.on("message", (data: any) => {
      console.log("Received message:", data);
      const message = data.payload?.message || data;
      const sender = data.payload?.sender || { id: 0, name: "Server" };
      const timestamp = data.payload?.timestamp || new Date().toTimeString();

      const incomingMessage: MessageProps = {
        id: Date.now().toString(),
        sender,
        content: message,
        timestamp,
      };

      onMessageReceived(incomingMessage, selectedChatId);
    });

    socket.on("groupMessage", (data: any) => {
      console.log("Received group message:", data);
      const message = data.payload?.message || data;
      const sender = data.payload?.sender || { id: 0, name: "Server" };
      const timestamp = data.payload?.timestamp || new Date().toTimeString();

      const incomingMessage: MessageProps = {
        id: Date.now().toString(),
        sender,
        content: message,
        timestamp,
      };

      onMessageReceived(incomingMessage, selectedChatId);
    });

    socket.onAny((eventName: string, data: any) => {
      console.log(`Received ${eventName}:`, data);
      if (eventName !== "message" && eventName !== "groupMessage") {
        const message = data.payload?.message || data;
        const sender = data.payload?.sender || { id: 0, name: "Server" };
        const timestamp = data.payload?.timestamp || new Date().toISOString();

        const incomingMessage: MessageProps = {
          id: Date.now().toString(),
          sender,
          content: message,
          timestamp,
        };

        onMessageReceived(incomingMessage, selectedChatId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatId, onMessageReceived]);

  return {
    sendMessage,
  };
};
