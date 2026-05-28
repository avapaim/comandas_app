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
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import Pagination from "../components/common/Pagination";
import { getGrupoInfo } from "../constants/userGroups";
import useMasks from "../hooks/useMasks";
import funcionarioService from "../services/funcionarioService";
import showSnackbar from "../utils/snackbar";

const FuncionarioList = () => {
  const navigate = useNavigate();

  const { applyCpfMask, applyPhoneMask } = useMasks();

  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 3,
    currentPage: 1,
  });
  const [hasItems, setHasItems] = useState(true);

  const loadFuncionarios = async () => {
    try {
      setLoading(true);

      const response = await funcionarioService.list({
        skip: pagination.skip,
        limit: pagination.limit,
      });

      const data = response.data || response;

      setFuncionarios(data);
      setHasItems(data && data.length > 0);
    } catch (error) {
      showSnackbar("Erro ao carregar funcionários", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuncionarios();
  }, [pagination.skip, pagination.limit]);

  const actions = (
    <Button
      variant="contained"
      onClick={() => navigate("/funcionario")}
      startIcon={<FiberNew />}
    >
      Novo
    </Button>
  );

  const handleView = (item) => navigate(`/funcionario/view/${item.id}`);
  const handleEdit = (item) => navigate(`/funcionario/edit/${item.id}`);

  const handleDelete = async (item) => {
    try {
      await funcionarioService.delete(item.id);

      showSnackbar("Funcionário excluído com sucesso!", "success");
      loadFuncionarios();
    } catch (error) {
      showSnackbar("Erro ao excluir funcionário", "error");
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
      <PageLayout title="Funcionários" actions={actions}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Funcionários" actions={actions}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>CPF/Login</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>Grupo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {funcionarios.map((funcionario) => (
                <TableRow key={funcionario.id} hover>
                  <TableCell>{funcionario.id}</TableCell>
                  <TableCell>{funcionario.nome}</TableCell>
                  <TableCell>{applyCpfMask(funcionario.cpf)}</TableCell>
                  <TableCell>{applyPhoneMask(funcionario.telefone)}</TableCell>
                  <TableCell>{funcionario.email}</TableCell>
                  <TableCell>{funcionario.matricula}</TableCell>
                  <TableCell>
                    <Chip
                      label={getGrupoInfo(funcionario.grupo).label}
                      color={getGrupoInfo(funcionario.grupo).color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      item={funcionario}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {funcionarios.map((funcionario) => (
          <Card key={funcionario.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {funcionario.nome}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ID: {funcionario.id}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2">
                <strong>CPF/Login:</strong> {applyCpfMask(funcionario.cpf)}
              </Typography>

              <Typography variant="body2">
                <strong>Telefone:</strong>{" "}
                {applyPhoneMask(funcionario.telefone)}
              </Typography>

              <Typography variant="body2">
                <strong>E-mail:</strong> {funcionario.email}
              </Typography>

              <Typography variant="body2">
                <strong>Matrícula:</strong> {funcionario.matricula}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={getGrupoInfo(funcionario.grupo).label}
                  color={getGrupoInfo(funcionario.grupo).color}
                  size="small"
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <ActionButtons
                  item={funcionario}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

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

export default FuncionarioList;