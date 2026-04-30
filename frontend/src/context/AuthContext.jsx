import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  // agora usando localStorage (permanece entre abas)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("loginRealizado") === "true";
  });

  const navigate = useNavigate();

  // Função para login
  const login = (cpf, senha) => {
    if (cpf === "abc" && senha === "bolinhas") {
      setIsAuthenticated(true);
      localStorage.setItem("loginRealizado", "true");
      navigate("/home");
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  // Função para logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("loginRealizado");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);