import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Container, ThemeProvider, CssBaseline } from "@mui/material";

import { theme } from "./theme"; // estilos globais
import Navbar from "./components/common/Navbar"; // componente reutilizável de navegação
import SnackbarGlobal from "./components/common/Snackbar"; // componente global de notificações
import AppRoutes from "./routes/Router"; // rotas da aplicação

function App() {
  return (
    // aplica o tema global ao aplicativo - Material UI
    <ThemeProvider theme={theme}>
      {/* normaliza estilos CSS */}
      <CssBaseline />

      {/* BrowserRouter é o roteador principal que gerencia as rotas da aplicação */}
      <BrowserRouter>
        {/* O AuthProvider envolve toda a aplicação */}
        <AuthProvider>
          {/* Navbar */}
          <Navbar />

          {/* SnackbarGlobal */}
          <SnackbarGlobal />

          {/* Container principal */}
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Rotas */}
            <AppRoutes />
          </Container>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;