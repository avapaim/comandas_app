import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import useValidationRules from "../hooks/useValidationRules";
import useMasks from "../hooks/useMasks";
import showSnackbar from "../utils/snackbar";

const FuncionarioForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const validationRules = useValidationRules();
  const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const payload = {
      ...data,
      cpf: cleanCpf(data.cpf),
      telefone: cleanPhone(data.telefone),
    };

    console.log("Funcionário:", payload);
    showSnackbar("Funcionário cadastrado com sucesso!", "success");
  };

  const handleCancel = () => {
    navigate("/funcionarios");
  };

  return (
    <PageLayout title="Cadastro de Funcionário">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
              error={!!errors.matricula}
              helperText={errors.matricula?.message}
            />
          )}
        />

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
              error={!!errors.grupo}
              helperText={errors.grupo?.message}
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="garcom">Garçom</MenuItem>
              <MenuItem value="caixa">Caixa</MenuItem>
            </TextField>
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button sx={{ mr: 1 }} onClick={handleCancel}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default FuncionarioForm;