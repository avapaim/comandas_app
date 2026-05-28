import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

const Dashboard = lazy(() => import("../pages/Dashboard"));

// códigos omitidos – somente os fragmentos relacionados ao Produto
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));

// fragmento de código, contendo somente a rota para abrir a pesquisa publica de produto
const ProdutoListPublic = lazy(() => import("../pages/ProdutoListPublic"));

const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));

const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));

const Caixa = lazy(() => import("../pages/Caixa"));
const Comandas = lazy(() => import("../pages/Comandas"));
const Perfil = lazy(() => import("../pages/Perfil"));

const LoginForm = lazy(() => import("../components/forms/LoginForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas - sem necessidade de autenticação */}
        <Route path="/produtos/publica" element={<ProdutoListPublic />} />

        <Route
          path="/login"
          element={
            <RestrictedRoute>
              <LoginForm />
            </RestrictedRoute>
          }
        />

        {/* Rotas protegidas - somente se estiver logado */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

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

        {/* Rota para editar ou visualizar com opr {view ou edit} e id dinâmico */}
        <Route
          path="/produto/:opr/:id"
          element={
            <PrivateRoute>
              <ProdutoForm />
            </PrivateRoute>
          }
        />

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
        <Route
          path="/caixa"
          element={
            <PrivateRoute allowedGroups={[1, 3]}>
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;