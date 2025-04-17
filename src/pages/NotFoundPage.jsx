import { Container, Typography } from "@mui/material";

export default function NotFoundPage(){
    return(
        <Container sx={{display:"flex", justifyContent:"center", alignItems:"center", textAlign:"center", height:"100vh", flexDirection:"column"}}>
            <Typography variant="h1" className="error-message" sx={{fontWeight:"600"}}>404</Typography>
            <Typography variant="h1" className="error-message"sx={{fontWeight:"600"}}>Упс... Страница не найдена!</Typography>
        </Container>
    )
}