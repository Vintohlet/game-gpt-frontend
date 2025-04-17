import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
export default function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <Box
        sx={{
          backgroundColor: isUser ? "#7289da" : "#737e85",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: 2,
          maxWidth: "70%",
        }}
      >
          <ReactMarkdown>{text}</ReactMarkdown>
      </Box>
    </Box>
  );
}
