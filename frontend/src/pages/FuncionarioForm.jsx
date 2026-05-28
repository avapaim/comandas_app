import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, MenuItem, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import useValidationRules from "../hooks/useValidationRules";
import useMasks from "../hooks/useMasks";
import showSnackbar from "../utils/snackbar";
import UniqueValidator from "../components/common/UniqueValidator";
import funcionarioService from "../services/funcionarioService";
import { GROUP_OPTIONS } from "../constants/userGroups";

const FuncionarioForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();

  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const [existingFuncionario, setExistingFuncionario] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm();

  const validationRules = useValidationRules();
  const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();

  const isReadOnly = opr === "view";

  const title =
    opr === "view"
      ? `Visualizar Funcionário: ${id}`
      : id
        ? `Editar Funcionário: ${id}`
        : "Cadastro de Funcionário";

  useEffect(() => {
    const loadFuncionario = async () => {
      if (id) {
        try {
          setLoadingData(true);

          const data = await funcionarioService.getById(id);

          reset({
            ...data,
            grupo: Number(data.grupo),
          });
        } catch (error) {
          showSnackbar("Erro ao carregar funcionário", "error");
          navigate("/funcionarios");
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    };

    loadFuncionario();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const cpfLimpo = cleanCpf(data.cpf);

      const existing = await funcionarioService.checkCpfExists(cpfLimpo, id);

      if (existing && existing.id.toString() !== id?.toString()) {
        setExistingFuncionario(existing);
        setDuplicateDialog(true);
        return;
      }

      const payload = {
        ...data,
        cpf: cpfLimpo,
        telefone: cleanPhone(data.telefone),
        grupo: Number(data.grupo),
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

        await funcionarioService.update(id, changedData);
        showSnackbar("Funcionário atualizado com sucesso!", "success");
      } else {
        await funcionarioService.create(payload);
        showSnackbar("Funcionário cadastrado com sucesso!", "success");
      }

      navigate("/funcionarios");
    } catch (error) {
      const mensagem =
        typeof error.apiMessage === "string"
          ? error.apiMessage
          : "Erro ao salvar funcionário";

      showSnackbar(mensagem, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/funcionarios");
  };

  const handleDialogClose = () => {
    setDuplicateDialog(false);
    setExistingFuncionario(null);
  };

  const handleDialogView = (funcionario) => {
    setDuplicateDialog(false);
    setExistingFuncionario(null);
    navigate(`/funcionario/view/${funcionario.id}`);
  };

  const handleDialogEdit = (funcionario) => {
    setDuplicateDialog(false);
    setExistingFuncionario(null);
    navigate(`/funcionario/edit/${funcionario.id}`);
  };

  return (
    <PageLayout title={title}>
      {loadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {isReadOnly && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Todos os campos estão em modo somente leitura.
            </Typography>
          )}

          <Controller
            name="nome"
            control={control}
            defaultValue=""
            rules={{
              ...validationRules.nome,
              maxLength: {
                value: 100,
                message: "Nome deve ter no máximo 100 caracteres",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome"
                placeholder="Digite o nome do funcionário"
                title="Nome completo do funcionário"
                fullWidth
                autoFocus
                margin="normal"
                disabled={isReadOnly}
                inputProps={{ maxLength: 100 }}
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
                label="CPF / Login"
                placeholder="000.000.000-00"
                title="Digite o CPF do funcionário"
                fullWidth
                margin="normal"
                disabled={isReadOnly}
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
            rules={{
              required: "Telefone é obrigatório",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Telefone"
                placeholder="(49) 99999-9999"
                title="Digite o telefone do funcionário"
                fullWidth
                margin="normal"
                disabled={isReadOnly}
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
            rules={{
              required: "E-mail é obrigatório",
              maxLength: {
                value: 100,
                message: "E-mail deve ter no máximo 100 caracteres",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                placeholder="email@exemplo.com"
                title="Digite o e-mail do funcionário"
                fullWidth
                margin="normal"
                type="email"
                disabled={isReadOnly}
                inputProps={{ maxLength: 100 }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="matricula"
            control={control}
            defaultValue=""
            rules={validationRules.matricula}
            render={({ field }) => (
              <TextField
                {...field}
                label="Matrícula"
                placeholder="Digite a matrícula"
                title="Informe a matrícula do funcionário"
                fullWidth
                margin="normal"
                disabled={isReadOnly}
                error={!!errors.matricula}
                helperText={errors.matricula?.message}
              />
            )}
          />

          {!isReadOnly && !id && (
            <Controller
              name="senha"
              control={control}
              defaultValue=""
              rules={validationRules.senha}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha"
                  placeholder="Digite a senha"
                  title="Informe a senha de acesso"
                  fullWidth
                  margin="normal"
                  type="password"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                />
              )}
            />
          )}

          <Controller
            name="grupo"
            control={control}
            defaultValue=""
            rules={validationRules.grupo}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Grupo"
                title="Selecione o grupo do funcionário"
                fullWidth
                margin="normal"
                disabled={isReadOnly}
                error={!!errors.grupo}
                helperText={errors.grupo?.message}
              >
                {GROUP_OPTIONS.map((grupo) => (
                  <MenuItem key={grupo.value} value={grupo.value}>
                    {grupo.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button sx={{ mr: 1 }} onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>

            {!isReadOnly && (
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
        existingRecord={existingFuncionario}
        recordType="Funcionário"
        onView={handleDialogView}
        onEdit={handleDialogEdit}
      />
    </PageLayout>
  );
};

export default FuncionarioForm;