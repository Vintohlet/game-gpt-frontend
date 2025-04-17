import { Box, TextField, IconButton } from "@mui/material";
import { IoSend } from "react-icons/io5";

export default function ChatPanel({ value, onChange, onSend, disabled }) {

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Напишите сообщение..."
        value={value}
        onChange={onChange}
 
        disabled={disabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "white",
            backgroundColor: "#36393f",
            "& fieldset": {
              borderColor: "#555",
            },
            "&:hover fieldset": {
              borderColor: "#777",
            },
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        sx={{ ml: 1 }}
      >
        <IoSend />
      </IconButton>
    </Box>
  );
}