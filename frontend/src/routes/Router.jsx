import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

const Dashboard = lazy(() => import("../pages/Dashboard"));

// Produtos
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const ProdutoListPublic = lazy(() => import("../pages/ProdutoListPublic"));

// Funcionários
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));

// Clientes
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));

// Comandas
const ComandaList = lazy(() => import("../pages/ComandaList"));
const ComandaForm = lazy(() => import("../pages/ComandaForm"));
const ComandaConsumoForm = lazy(() => import("../pages/ComandaConsumoForm"));

const Caixa = lazy(() => import("../pages/Caixa"));
const Perfil = lazy(() => import("../pages/Perfil"));

const LoginForm = lazy(() => import("../components/forms/LoginForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas */}
        <Route path="/produtos/publica" element={<ProdutoListPublic />} />

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

        <Route
          path="/produto/:opr/:id"
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
            <PrivateRoute allowedGroups={[1]}>
              <FuncionarioList />
            </PrivateRoute>
          }
        />

        <Route
          path="/funcionario"
          element={
            <PrivateRoute allowedGroups={[1]}>
              <FuncionarioForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/funcionario/:opr/:id"
          element={
            <PrivateRoute allowedGroups={[1]}>
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
            <PrivateRoute allowedGroups={[1, 3]}>
              <ClienteForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/:opr/:id"
          element={
            <PrivateRoute>
              <ClienteForm />
            </PrivateRoute>
          }
        />

        {/* Comandas */}
        <Route
          path="/comandas"
          element={
            <PrivateRoute>
              <ComandaList />
            </PrivateRoute>
          }
        />

        <Route
          path="/comanda"
          element={
            <PrivateRoute>
              <ComandaForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/comanda/:opr/:id"
          element={
            <PrivateRoute>
              <ComandaForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/comanda/consumo/:id"
          element={
            <PrivateRoute>
              <ComandaConsumoForm />
            </PrivateRoute>
          }
        />

        {/* Caixa */}
        <Route
          path="/caixa"
          element={
            <PrivateRoute allowedGroups={[1, 3]}>
              <Caixa />
            </PrivateRoute>
          }
        />

        {/* Perfil */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;