import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";

import {
  Visibility,
  Edit,
  Delete,
  AddCircle,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import { USER_GROUPS } from "../constants/userGroups";

import PageLayout from "../components/common/PageLayout";

const ComandaList = () => {
  const { user } = useAuth();

  const comandas = [
    {
      id: 1,
      mesa: "Mesa 01",
      cliente: "João Silva",
      status: "Aberta",
      total: 75.5,
    },
    {
      id: 2,
      mesa: "Mesa 02",
      cliente: "Maria Souza",
      status: "Aberta",
      total: 42.9,
    },
  ];

  const handleView = (comanda) => console.log("Visualizar:", comanda);
  const handleEdit = (comanda) => console.log("Editar:", comanda);
  const handleDelete = (comanda) => console.log("Excluir:", comanda);
  const handleAddItem = (comanda) => console.log("Adicionar consumo:", comanda);
  const handleCancel = (comanda) => console.log("Cancelar comanda:", comanda);

  return (
    <PageLayout title="Comandas">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {comandas.map((comanda) => (
              <TableRow key={comanda.id}>
                <TableCell>{comanda.id}</TableCell>
                <TableCell>{comanda.mesa}</TableCell>
                <TableCell>{comanda.cliente}</TableCell>
                <TableCell>{comanda.status}</TableCell>
                <TableCell>R$ {comanda.total.toFixed(2)}</TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      title="Visualizar"
                      onClick={() => handleView(comanda)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>

                    {user?.grupo === USER_GROUPS.ADMINISTRADOR && (
                      <IconButton
                        size="small"
                        color="secondary"
                        title="Editar"
                        onClick={() => handleEdit(comanda)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}

                    {user?.grupo === USER_GROUPS.ADMINISTRADOR && (
                      <IconButton
                        size="small"
                        color="error"
                        title="Excluir"
                        onClick={() => handleDelete(comanda)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}

                    <IconButton
                      size="small"
                      color="success"
                      title="Adicionar Consumo"
                      onClick={() => handleAddItem(comanda)}
                    >
                      <AddCircle fontSize="small" />
                    </IconButton>

                    {user?.grupo === USER_GROUPS.ADMINISTRADOR && (
                      <IconButton
                        size="small"
                        color="warning"
                        title="Cancelar Comanda"
                        onClick={() => handleCancel(comanda)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
};

export default ComandaList;