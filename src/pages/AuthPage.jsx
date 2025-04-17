import { Box, Container, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../../redux/slices/userSlice";

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (!isLogin) {
        const userData = {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        };

        await dispatch(registerUser(userData)).unwrap();
      } else {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        })).unwrap();
      }

      navigate("/");
    } catch (error) {
      setErrorMessage(error || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = "page"> <Container maxWidth="md" sx={{ py: 14, display: "flex", justifyContent: "center", height: "100vh",flexDirection:"column", alignItems:"center", textAlign:"center" }}>
    <Typography variant="h2" sx={{pb:2, fontWeight:"600"}} className="title">GameGPT </Typography>
    <Typography variant="h4" sx={{pb:4}}>Ассистент в подборе игр</Typography>
    <Box sx={{ backgroundColor: "#424549", py: 4, px: 8, borderRadius: 3, maxWidth:"480px", textAlign:"center", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column" }}>
      <Typography variant="h4" sx={{ color: "white" }}>
        {isLogin ? "Войти" : "Регистрация"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            name="userName"
            label="Никнейм"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formData.userName}
            onChange={handleInputChange}
          />
        )}

        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={handleInputChange}
        />

        <TextField
          name="password"
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={handleInputChange}
        />

        {errorMessage && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? "Войти" : "Зарегистрироваться"}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ userName: "", email: "", password: "" });
            setErrorMessage("");
          }}
        >
          {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </Button>
      </form>
    </Box>
  </Container>
</div>
     
  );
}