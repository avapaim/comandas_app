import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import useValidationRules from "../hooks/useValidationRules";
import useMasks from "../hooks/useMasks";
import showSnackbar from "../utils/snackbar";
import { useAuth } from "../context/AuthContext";
import { USER_GROUPS } from "../constants/userGroups";
import clienteService from "../services/clienteService";
import UniqueValidator from "../components/common/UniqueValidator";

const ClienteForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const [existingCliente, setExistingCliente] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm();

  const validationRules = useValidationRules();
  const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();

  const { user } = useAuth();

  const isViewMode = opr === "view";

  const title =
    opr === "view"
      ? `Visualizar Cliente: ${id}`
      : id
        ? `Editar Cliente: ${id}`
        : "Cadastro de Cliente";

  useEffect(() => {
    if (
      opr !== "view" &&
      user?.grupo !== USER_GROUPS.ADMINISTRADOR &&
      user?.grupo !== USER_GROUPS.CAIXA
    ) {
      showSnackbar(
        "Acesso negado: Apenas administradores e caixas podem cadastrar ou editar clientes.",
        "warning"
      );

      navigate("/clientes");
      return;
    }

    const loadCliente = async () => {
      if (id) {
        try {
          setLoadingData(true);

          const data = await clienteService.getById(id);
          reset(data);
        } catch (error) {
          showSnackbar("Erro ao carregar cliente", "error");
          navigate("/clientes");
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    };

    loadCliente();
  }, [id, opr, user, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const cpfLimpo = cleanCpf(data.cpf);

      const existing = await clienteService.checkCpfExists(cpfLimpo, id);

      if (existing && existing.id.toString() !== id?.toString()) {
        setExistingCliente(existing);
        setDuplicateDialog(true);
        return;
      }

      const payload = {
        ...data,
        cpf: cpfLimpo,
        telefone: cleanPhone(data.telefone),
      };

      if (id) {
        const changedData = {};

        Object.keys(dirtyFields).forEach((key) => {
          if (dirtyFields[key]) {
            changedData[key] = payload[key];
          }
        });

        if (Object.keys(changedData).length === 0) {
          showSnackbar("Nenhuma alteração detectada", "info");
          return;
        }

        await clienteService.update(id, changedData);
        showSnackbar("Cliente atualizado com sucesso!", "success");
      } else {
        await clienteService.create(payload);
        showSnackbar("Cliente cadastrado com sucesso!", "success");
      }

      navigate("/clientes");
    } catch (error) {
      const mensagem =
        typeof error.apiMessage === "string"
          ? error.apiMessage
          : "Erro ao salvar cliente";

      showSnackbar(mensagem, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/clientes");
  };

  const handleDialogClose = () => {
    setDuplicateDialog(false);
    setExistingCliente(null);
  };

  const handleDialogView = (cliente) => {
    setDuplicateDialog(false);
    setExistingCliente(null);
    navigate(`/cliente/view/${cliente.id}`);
  };

  const handleDialogEdit = (cliente) => {
    setDuplicateDialog(false);
    setExistingCliente(null);
    navigate(`/cliente/edit/${cliente.id}`);
  };

  return (
    <PageLayout title={title}>
      {loadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {isViewMode && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Todos os campos estão em modo somente leitura.
            </Typography>
          )}

          <Controller
            name="nome"
            control={control}
            defaultValue=""
            rules={validationRules.nome}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome"
                fullWidth
                margin="normal"
                disabled={isViewMode}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />

          <Controller
            name="cpf"
            control={control}
            defaultValue=""
            rules={validationRules.cpf}
            render={({ field }) => (
              <TextField
                {...field}
                label="CPF"
                fullWidth
                margin="normal"
                disabled={isViewMode}
                value={applyCpfMask(field.value)}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
              />
            )}
          />

          <Controller
            name="telefone"
            control={control}
            defaultValue=""
            rules={validationRules.telefone}
            render={({ field }) => (
              <TextField
                {...field}
                label="Telefone"
                fullWidth
                margin="normal"
                disabled={isViewMode}
                value={applyPhoneMask(field.value)}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.telefone}
                helperText={errors.telefone?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={validationRules.email}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                fullWidth
                margin="normal"
                disabled={isViewMode}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button sx={{ mr: 1 }} onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>

            {!isViewMode && (
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Salvando..." : id ? "Atualizar" : "Cadastrar"}
              </Button>
            )}
          </Box>
        </Box>
      )}

      <UniqueValidator
        open={duplicateDialog}
        onClose={handleDialogClose}
        existingRecord={existingCliente}
        recordType="Cliente"
        onView={handleDialogView}
        onEdit={handleDialogEdit}
      />
    </PageLayout>
  );
};

export default ClienteForm;