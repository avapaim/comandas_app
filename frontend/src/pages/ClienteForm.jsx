import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import useValidationRules from "../hooks/useValidationRules";
import useMasks from "../hooks/useMasks";

const ClienteForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const validationRules = useValidationRules();
  const { applyPhoneMask } = useMasks();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Cliente:", data);
  };

  const handleCancel = () => {
    navigate("/clientes");
  };

  return (
    <PageLayout title="Cadastro de Cliente">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>

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
              error={!!errors.nome}
              helperText={errors.nome?.message}
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
              error={!!errors.email}
              helperText={errors.email?.message}
            />
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

export default ClienteForm;