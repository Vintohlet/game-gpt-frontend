import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatHistory from "../components/ChatHistory";
import ChatPanel from "../components/ChatPanel";
import MessageBubble from "../components/MessageBubble";
import { axiosInstance } from "../../services/axios";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!activeChat || !localStorage.getItem("token")) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/chat/${activeChat}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data?.messages || []);
      } catch (error) {
        console.error("Ошибка загрузки сообщений", error);
        setMessages([]);
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
        { chatId: activeChat, userMessage: input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const assistantMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text:
          response.data?.assistantMessage ||
          "Произошла ошибка при обращении к модели.",
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
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        py: 2,
      }}
    >
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 2,
              backgroundColor: "#2c2f33",
              "&:hover": { backgroundColor: "#3a3d41" },
            }}
          >
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                backgroundColor: "#2c2f33",
                color: "white",
                p: 2,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            }}
          >
            <Box sx={{ height: "100%", overflowY: "auto" }}>
              <ChatHistory
                activeChat={activeChat}
                setActiveChat={setActiveChat}
              />
            </Box>
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            width: 280,
            backgroundColor: "#2c2f33",
            color: "white",
            borderRadius: 2,
            p: 2,
            overflowY: "auto",
          }}
        >
          <ChatHistory
            activeChat={activeChat}
            setActiveChat={setActiveChat}
          />
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          backgroundColor: "#424549",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          p: 2,
          color: "white",
          overflow: "hidden",
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
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              pr: 1,
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
        )}
        <ChatPanel
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={handleSendMessage}
          disabled={!activeChat}
        />
      </Box>
    </Container>
  );
}
