import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";

const ClienteList = () => {
  const navigate = useNavigate();

  const clientes = [
    { id: 1, nome: "João Silva", telefone: "(49) 99999-9999", email: "joao@email.com" },
    { id: 2, nome: "Maria Souza", telefone: "(49) 98888-8888", email: "maria@email.com" }
  ];

  const actions = (
    <Button
      variant="contained"
      onClick={() => navigate("/cliente")}
      startIcon={<FiberNew />}
    >
      Novo
    </Button>
  );

  const handleView = (item) => console.log("Visualizar:", item);
  const handleEdit = (item) => navigate(`/cliente/${item.id}`);
  const handleDelete = (item) => console.log("Excluir:", item);

  return (
    <PageLayout title="Clientes" actions={actions}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <ActionButtons
                    item={cliente}
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
    </PageLayout>
  );
};

export default ClienteList;