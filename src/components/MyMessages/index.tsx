import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import { ChatProps, MessageProps } from "@/types";
import { users } from "@/data";
import ChatsPane from "./ChatsPane";
import MessagesPane from "./MessagesPane";
import { useSocket } from "@/hook/useSocket";

export default function MyProfile() {
  const [chats, setChats] = React.useState<ChatProps[]>([
    {
      id: "1",
      sender: users[0],
      messages: [],
    },
  ]);

  const [selectedChatId, setSelectedChatId] = React.useState("1");
  const [messageInput, setMessageInput] = React.useState("");

  const selectedChat = chats.find((chat) => chat.id === selectedChatId)!;

  // const handleNewMessage = (message: MessageProps, chatId: string) => {
  //   setChats((prevChats) =>
  //     prevChats.map((chat) =>
  //       chat.id === chatId
  //         ? { ...chat, messages: [...chat.messages, message] }
  //         : chat
  //     )
  //   );
  // };

  const handleNewMessage = React.useCallback(
    (message: MessageProps, chatId: string) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        )
      );
    },
    []
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const messageObj: MessageProps = {
      id: Date.now().toString(),
      sender: { id: 1, name: "You" },
      content: messageInput,
      timestamp: new Date().toISOString(),
    };

    handleNewMessage(messageObj, selectedChatId);
    sendMessage(messageObj);
    setMessageInput("");
  };

  const { sendMessage } = useSocket({
    onMessageReceived: handleNewMessage,
    selectedChatId,
  });

  return (
    <Sheet
      sx={{
        flex: 1,
        width: "100%",
        mx: "auto",
        pt: { xs: "var(--Header-height)", sm: 0 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(min-content, min(30%, 400px)) 1fr",
        },
        gap: 1,
        overflow: "hidden",
      }}
    >
      <ChatsPane
        chats={chats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <MessagesPane
        chat={selectedChat}
        onSendMessage={handleSendMessage}
        textAreaValue={messageInput}
        setTextAreaValue={setMessageInput}
      />
    </Sheet>
  );
}
