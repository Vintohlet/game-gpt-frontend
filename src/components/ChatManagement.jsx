import { useState } from "react";
import { Box, Button, Collapse, TextField, Paper } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { logout } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../services/axios";
import { fetchChats } from "../../redux/slices/chatSlice"; // предполагается, что такой action есть

export default function ChatManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [chatName, setChatName] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  const handleCreateChat = async () => {
    if (!chatName.trim()) return;

    try {
      await axiosInstance.post(
        "/chat",
        { chatName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setChatName("");
      setShowForm(false);
      dispatch(fetchChats()); 
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  };

  return (
    <>

      <Collapse in={showForm}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 80,
            left: 8,
            p: 2,
            width: 250,
            backgroundColor: "#2c2f33",
            color: "white",
            borderRadius: 2,
            zIndex: 10,
          }}
        >
          <TextField
            fullWidth
            label="Название чата"
            variant="filled"
            size="small"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 1, width: "100%" }}
            onClick={handleCreateChat}
          >
            Создать
          </Button>
        </Paper>
      </Collapse>

      {/* Кнопка создания чата */}
      <Button
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          minWidth: 40,
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.8)",
          },
        }}
        onClick={() => setShowForm((prev) => !prev)}
      >
        <FaPlus size={24} color="#2c2f33" />
      </Button>

      {/* Кнопка выхода */}
      <Button
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          minWidth: 40,
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.8)",
          },
        }}
        onClick={handleLogout}
      >
        <IoLogOut size={24} color="#2c2f33" />
      </Button>
    </>
  );
}