import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, InputLabel } from "@mui/material";
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/common/PageLayout";
import { useValidationRules } from "../hooks/useValidationRules";
import showSnackbar from "../utils/snackbar";

const ProdutoForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const validationRules = useValidationRules();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Dados do produto:", data);
    showSnackbar("Produto cadastrado com sucesso!", "success");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      console.log("Arquivo selecionado:", file);
    }
  };

  const handleCancel = () => {
    navigate("/produtos");
  };

  return (
    <PageLayout title="Dados Produto">
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
              placeholder="Digite o nome do produto"
              title="Informe o nome do produto"
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
          name="descricao"
          control={control}
          defaultValue=""
          rules={{
            ...validationRules.descricao,
            maxLength: {
              value: 200,
              message: "Descrição deve ter no máximo 200 caracteres",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição"
              placeholder="Digite uma breve descrição do produto"
              title="Informe a descrição do produto"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              inputProps={{ maxLength: 200 }}
              error={!!errors.descricao}
              helperText={errors.descricao?.message}
            />
          )}
        />

        <Controller
          name="valor_unitario"
          control={control}
          defaultValue=""
          rules={validationRules.valor_unitario}
          render={({ field }) => (
            <TextField
              {...field}
              label="Valor Unitário"
              placeholder="Ex: 25.90"
              title="Informe o valor unitário do produto"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              error={!!errors.valor_unitario}
              helperText={errors.valor_unitario?.message}
            />
          )}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <InputLabel htmlFor="foto-upload" sx={{ mb: 1 }}>
            Foto do Produto
          </InputLabel>

          <input
            id="foto-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <label htmlFor="foto-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCameraIcon />}
              fullWidth
              title="Selecionar imagem do produto"
            >
              Selecionar Foto
            </Button>
          </label>
        </Box>

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

export default ProdutoForm;