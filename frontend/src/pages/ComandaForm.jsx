import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, CircularProgress } from "@mui/material";

import PageLayout from "../components/common/PageLayout";
import { useValidationRules } from "../hooks/useValidationRules";
import comandaService from "../services/comandaService";
import showSnackbar from "../utils/snackbar";
import { useAuth } from "../context/AuthContext";
import ComandaValidator, {
  useComandaValidation,
} from "../components/common/ComandaValidator";

// Definição do componente ComandaForm
const ComandaForm = () => {
  // Hooks de navegação e parâmetros
  const { id, opr } = useParams();
  const navigate = useNavigate();

  // Hook de autenticação
  const { user } = useAuth();

  // Hook de formulário
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
    defaultValues: {
      comanda: "",
      data_hora: new Date().toISOString().slice(0, 16),
      cliente_id: "",
      funcionario_id: user?.id || "",
    },
  });

  // Estados do componente
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Configurações e validações
  const validationRules = useValidationRules();
  const isReadOnly = opr === "view";

  const title =
    opr === "view"
      ? `Visualizar Comanda: ${id}`
      : id
        ? `Editar Comanda: ${id}`
        : "Nova Comanda";

  // Hook de validação de comanda
  const {
    dialog: comandaDialog,
    validateComanda,
    closeDialog,
    clearField,
  } = useComandaValidation(comandaService, id);

  // Funções de tratamento do diálogo de comanda em uso
  const handleDialogCancel = () => {
    closeDialog();
    clearField();

    reset((prev) => ({
      ...prev,
      comanda: "",
    }));
  };

  const handleDialogView = (comanda) => {
    closeDialog();
    navigate(`/comanda/view/${comanda.id}`);
  };

  const handleDialogEdit = (comanda) => {
    closeDialog();
    navigate(`/comanda/edit/${comanda.id}`);
  };

  const handleCancel = () => {
    navigate("/comandas");
  };

  // Carregar dados da comanda para edição/visualização
  useEffect(() => {
    const loadComanda = async () => {
      if (id && id !== "new") {
        try {
          const data = await comandaService.getById(id);

          if (data.data_hora) {
            const dataAbertura = new Date(data.data_hora);
            data.data_hora = dataAbertura.toISOString().slice(0, 16);
          }

          reset({
            ...data,
            cliente_id: data.cliente_id || "",
          });
        } catch (error) {
          const mensagem =
            typeof error.apiMessage === "string"
              ? error.apiMessage
              : "Erro ao carregar comanda";

          showSnackbar(mensagem, "error");
        } finally {
          setLoadingData(false);
        }
      } else {
        reset({
          comanda: "",
          cliente_id: "",
          funcionario_id: user?.id || "",
          data_hora: new Date().toISOString().slice(0, 16),
        });

        setLoadingData(false);
      }
    };

    loadComanda();
  }, [id, reset, user?.id]);

  // Função de salvamento
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const comandaData = {
        comanda: data.comanda,
        data_hora:
          id && id !== "new"
            ? data.data_hora
            : new Date().toISOString().slice(0, 16),
        cliente_id: data.cliente_id ? Number(data.cliente_id) : null,
        funcionario_id:
          id && id !== "new" ? data.funcionario_id : user?.id || "",
        status: 0,
      };

      if (id && id !== "new") {
        await comandaService.update(id, comandaData);
        showSnackbar("Comanda atualizada com sucesso!", "success");
      } else {
        await comandaService.create(comandaData);
        showSnackbar("Comanda aberta com sucesso!", "success");
      }

      navigate("/comandas");
    } catch (error) {
      const mensagem =
        typeof error.apiMessage === "string"
          ? error.apiMessage
          : error.response?.data?.detail
            ? JSON.stringify(error.response.data.detail)
            : "Erro ao salvar comanda";

      console.error("Erro ao salvar comanda:", error);
      showSnackbar(mensagem, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <PageLayout title={title}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 600, mx: "auto" }}
      >
        <Controller
          name="comanda"
          control={control}
          rules={{
            required: validationRules.required,
            pattern: {
              value: /^[0-9]+$/,
              message: "A comanda deve conter apenas números",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ""}
              fullWidth
              label="Comanda"
              margin="normal"
              error={!!errors.comanda}
              helperText={
                errors.comanda?.message ||
                "Número da comanda deve ser único e estar disponível"
              }
              disabled={loading || isReadOnly}
              type="number"
              onBlur={() => {
                if (!isReadOnly) {
                  const isNovaComanda = !id || id === "new";

                  if (isNovaComanda || dirtyFields.comanda) {
                    validateComanda(field.value);
                  }
                }
              }}
            />
          )}
        />

        {isReadOnly && (
          <Controller
            name="data_hora"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={
                  field.value
                    ? new Date(field.value).toLocaleString("pt-BR")
                    : ""
                }
                fullWidth
                label="Data e Hora de Abertura"
                margin="normal"
                disabled
              />
            )}
          />
        )}

        {isReadOnly && (
          <Controller
            name="funcionario_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={`ID: ${field.value || "N/A"} - ${
                  user?.nome || "Funcionário"
                }`}
                fullWidth
                label="Funcionário Responsável"
                margin="normal"
                disabled
              />
            )}
          />
        )}

        <Controller
          name="cliente_id"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ""}
              fullWidth
              label="ID do Cliente (opcional)"
              margin="normal"
              placeholder="Digite apenas o ID do cliente"
              type="number"
              error={!!errors.cliente_id}
              helperText={
                errors.cliente_id?.message ||
                "Deixe vazio caso não queira vincular cliente"
              }
              disabled={loading || isReadOnly}
            />
          )}
        />

        {!isReadOnly && (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Salvando..." : id ? "Atualizar" : "Abrir Comanda"}
            </Button>
          </Box>
        )}

        {isReadOnly && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCancel} disabled={loading}>
              Voltar
            </Button>
          </Box>
        )}
      </Box>

      <ComandaValidator
        open={comandaDialog.open}
        onClose={handleDialogCancel}
        existingRecord={comandaDialog.record}
        recordType="comanda"
        onView={handleDialogView}
        onEdit={handleDialogEdit}
      />
    </PageLayout>
  );
};

export default ComandaForm;