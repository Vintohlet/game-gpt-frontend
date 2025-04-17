import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";
import {store} from "../redux/store.js"
import { BrowserRouter } from 'react-router-dom'
import theme from '../utils/theme.js';
import { ThemeProvider } from '@mui/material';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
   <ThemeProvider theme={theme}>
   <App />

   </ThemeProvider>
  </BrowserRouter>
</Provider>,
)
