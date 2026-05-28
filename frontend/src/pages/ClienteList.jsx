import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_GROUPS } from "../constants/userGroups";

import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import Pagination from "../components/common/Pagination";
import clienteService from "../services/clienteService";
import useMasks from "../hooks/useMasks";
import showSnackbar from "../utils/snackbar";

const ClienteList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { applyCpfMask, applyPhoneMask } = useMasks();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 3,
    currentPage: 1,
  });
  const [hasItems, setHasItems] = useState(true);

  const loadClientes = async () => {
    try {
      setLoading(true);

      const response = await clienteService.list({
        skip: pagination.skip,
        limit: pagination.limit,
      });

      const data = response.data || response;

      setClientes(data);
      setHasItems(data && data.length > 0);
    } catch (error) {
      showSnackbar("Erro ao carregar clientes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, [pagination.skip, pagination.limit]);

  const actions =
    user?.grupo === USER_GROUPS.ADMINISTRADOR ||
    user?.grupo === USER_GROUPS.CAIXA ? (
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/cliente")}
        startIcon={<FiberNew />}
        sx={{ fontWeight: 600, px: 2, py: 1 }}
      >
        Novo
      </Button>
    ) : null;

  const handleView = (item) => navigate(`/cliente/view/${item.id}`);
  const handleEdit = (item) => navigate(`/cliente/edit/${item.id}`);

  const handleDelete = async (item) => {
    try {
      await clienteService.delete(item.id);

      showSnackbar("Cliente excluído com sucesso!", "success");
      loadClientes();
    } catch (error) {
      showSnackbar("Erro ao excluir cliente", "error");
    }
  };

  const handlePageChange = (newPage) => {
    const newSkip = (newPage - 1) * pagination.limit;

    setPagination((prev) => ({
      ...prev,
      skip: newSkip,
      currentPage: newPage,
    }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination({
      skip: 0,
      limit: newLimit,
      currentPage: 1,
    });
  };

  if (loading) {
    return (
      <PageLayout title="Clientes" actions={actions}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Clientes" actions={actions}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id} hover>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{applyCpfMask(cliente.cpf)}</TableCell>
                <TableCell>{applyPhoneMask(cliente.telefone)}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <ActionButtons
                    onView={handleView}
                    onEdit={
                      user?.grupo === USER_GROUPS.ADMINISTRADOR ||
                      user?.grupo === USER_GROUPS.CAIXA
                        ? handleEdit
                        : null
                    }
                    onDelete={
                      user?.grupo === USER_GROUPS.ADMINISTRADOR
                        ? handleDelete
                        : null
                    }
                    item={cliente}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        loading={loading}
        hasItems={hasItems}
      />
    </PageLayout>
  );
};

export default ClienteList;