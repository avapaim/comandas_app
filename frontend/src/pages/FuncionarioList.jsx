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
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";

const FuncionarioList = () => {
  const navigate = useNavigate();

  const funcionarios = [
    {
      id: 1,
      nome: "Arthur Paim",
      cpf: "000.000.000-00",
      telefone: "(49) 99999-9999",
      email: "arthur@email.com",
      matricula: "001",
      grupo: "Administrador",
    },
    {
      id: 2,
      nome: "José da Silva",
      cpf: "111.111.111-11",
      telefone: "(49) 98888-8888",
      email: "jose@email.com",
      matricula: "002",
      grupo: "Garçom",
    },
  ];

  const actions = (
    <Button
      variant="contained"
      onClick={() => navigate("/funcionario")}
      startIcon={<FiberNew />}
    >
      Novo
    </Button>
  );

  const handleView = (item) => console.log("Visualizar:", item);
  const handleEdit = (item) => navigate(`/funcionario/${item.id}`);
  const handleDelete = (item) => console.log("Excluir:", item);

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
                  <TableCell>{funcionario.cpf}</TableCell>
                  <TableCell>{funcionario.telefone}</TableCell>
                  <TableCell>{funcionario.email}</TableCell>
                  <TableCell>{funcionario.matricula}</TableCell>
                  <TableCell>{funcionario.grupo}</TableCell>
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
                <strong>CPF/Login:</strong> {funcionario.cpf}
              </Typography>

              <Typography variant="body2">
                <strong>Telefone:</strong> {funcionario.telefone}
              </Typography>

              <Typography variant="body2">
                <strong>E-mail:</strong> {funcionario.email}
              </Typography>

              <Typography variant="body2">
                <strong>Matrícula:</strong> {funcionario.matricula}
              </Typography>

              <Typography variant="body2">
                <strong>Grupo:</strong> {funcionario.grupo}
              </Typography>

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
    </PageLayout>
  );
};

export default FuncionarioList;