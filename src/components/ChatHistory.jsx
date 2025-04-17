import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  LinearProgress,
  Button,
  IconButton,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../../redux/slices/chatSlice";
import ChatManagement from "./ChatManagement";
import { deleteChat } from "../../redux/slices/chatSlice";

export default function ChatHistory({ activeChat, setActiveChat }) {
  const dispatch = useDispatch();
  const { chats, loading } = useSelector((state) => state.chat);
 console.log(chats)
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
  };

  const handleChatDelete = async (e, chatId) => {
    e.stopPropagation();

    try {
      if (activeChat === chatId) {
        setActiveChat(null);
      }
      await dispatch(deleteChat(chatId)).unwrap();
    } catch (error) {
      console.error("Ошибка удаления чата", error);
    }
  };

  return (
    <Box
      sx={{
       
        backgroundColor: "#2c2f33",
        borderRadius: 2,
        p: 2,
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <Typography variant="h6" gutterBottom>
        История Чатов
      </Typography>
      <Divider sx={{ borderColor: "#555" }} />
      <List sx={{ flexGrow: 1, overflowY: "auto", gap: 2 }}>
        {loading ? (
          <LinearProgress />
        ) : !Array.isArray(chats) || chats.length === 0 ? (
          <Typography variant="body2">У вас пока нет чатов</Typography>
        ) : (
          chats.map((chat) => (
            <ListItem
              button
              key={chat._id}
              onClick={() => handleChatClick(chat._id)}
              sx={{
                backgroundColor:
                  activeChat === chat._id
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {chat.chatName}
              <IconButton
                onClick={(e) => handleChatDelete(e, chat._id)}
                sx={{ color: "white" }}
              >
                <MdDelete />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>
      <ChatManagement />
    </Box>
  );
}
