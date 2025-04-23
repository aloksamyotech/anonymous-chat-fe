import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { ChatProps, MessageProps } from "@/types";

type MessagesPaneProps = {
  chat: ChatProps;
  onSendMessage: () => void;
  textAreaValue: string;
  setTextAreaValue: (val: string) => void;
};

export default function MessagesPane({
  chat,
  onSendMessage,
  textAreaValue,
  setTextAreaValue,
}: MessagesPaneProps) {
  const [chatMessages, setChatMessages] = React.useState(chat.messages);

  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [chatMessages]);
  console.log(`chatMessages`, chatMessages);
  

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", lg: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader sender={chat?.sender} />

      <Box
        ref={messagesContainerRef}
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "auto",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2}>
          {chatMessages?.map((message: MessageProps, index: number) => {
            const isYou = message?.sender?.name === "You";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? "row-reverse" : "row"}
                justifyContent={isYou ? "flex-start" : "flex-start"}
                sx={{
                  width: "100%",
                }}
              >
                {!isYou && (
                  <AvatarWithStatus
                    online={message?.sender?.online}
                    src={message?.sender?.avatar}
                  />
                )}
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  {...message}
                  sx={{
                    maxWidth: "70%",
                    backgroundColor: isYou
                      ? "primary.solidBg"
                      : "background.body",
                    color: isYou ? "primary.solidColor" : "text.primary",
                  }}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>

      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={onSendMessage}
      />
    </Sheet>
  );
}
