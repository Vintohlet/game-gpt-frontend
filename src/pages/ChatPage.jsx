import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import ChatHistory from "../components/ChatHistory";
import ChatPanel from "../components/ChatPanel";
import MessageBubble from "../components/MessageBubble";
import { axiosInstance } from "../../services/axios";
import {CircularProgress }from "@mui/material";
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeChat || !localStorage.getItem("token")) return;

    const fetchMessages = async () => {
     
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/chat/${activeChat}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Ошибка загрузки сообщений", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!input.trim() || !activeChat) return;

    const tempUserMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, tempUserMessage]);
    setInput("");
    setGenerating(true);

    try {
      const response = await axiosInstance.post(
        "/messages",
        {
          chatId: activeChat,
          userMessage: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const assistantMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: response.data.assistantMessage,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Ошибка отправки сообщения", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "assistant",
          text: "Произошла ошибка при обращении к модели.",
        },
      ]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", display: "flex", py: 2 }}>
      <ChatHistory activeChat={activeChat} setActiveChat={setActiveChat} />

      <Box
        sx={{
          flex: 1,
          backgroundColor: "#424549",
          borderRadius: 2,
          ml: 2,
          display: "flex",
          flexDirection: "column",
          p: 2,
          color: "white",
        }}
      >
        {!activeChat ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography>Выберите чат или создайте новый</Typography>
          </Box>
        ) : loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
             <CircularProgress color="secondary" size={32} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography>Нет сообщений. Начните общение!</Typography>
                </Box>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id || msg._id}
                    sender={msg.sender}
                    text={msg.text}
                  />
                ))
              )}
              {generating && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress color="secondary" size={32} />
                </Box>
              )}
            </Box>
            <ChatPanel
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={handleSendMessage}
              disabled={!activeChat}
            />
          </>
        )}
      </Box>
    </Container>
  );
}
