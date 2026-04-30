import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

// Pages
const Dashboard = lazy(() => import("../pages/Dashboard"));

// Produto
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));

// Funcionário
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));

// Cliente
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));

// Outras telas
const Caixa = lazy(() => import("../pages/Caixa"));
const Comandas = lazy(() => import("../pages/Comandas"));
const Perfil = lazy(() => import("../pages/Perfil"));

// Login / erro
const LoginForm = lazy(() => import("../components/forms/LoginForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Redireciona raiz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pública */}
        <Route path="/produtos/publica" element={<ProdutoList />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            <RestrictedRoute>
              <LoginForm />
            </RestrictedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Produtos */}
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <ProdutoList />
            </PrivateRoute>
          }
        />
        <Route
          path="/produto"
          element={
            <PrivateRoute>
              <ProdutoForm />
            </PrivateRoute>
          }
        />

        {/* Funcionários */}
        <Route
          path="/funcionarios"
          element={
            <PrivateRoute>
              <FuncionarioList />
            </PrivateRoute>
          }
        />
        <Route
          path="/funcionario"
          element={
            <PrivateRoute>
              <FuncionarioForm />
            </PrivateRoute>
          }
        />

        {/* Clientes */}
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <ClienteList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <PrivateRoute>
              <ClienteForm />
            </PrivateRoute>
          }
        />

        {/* Extras */}
        <Route
          path="/caixa"
          element={
            <PrivateRoute>
              <Caixa />
            </PrivateRoute>
          }
        />
        <Route
          path="/comandas"
          element={
            <PrivateRoute>
              <Comandas />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;