import { Box, Typography, Avatar } from "@mui/material";
import PageLayout from "../components/common/PageLayout";
import perfil from "../assets/perfil.jpg";

const Perfil = () => {
  return (
    <PageLayout title="Meu Perfil">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <Avatar
          src={perfil}
          sx={{ width: 150, height: 150, mb: 2 }}
        />

        <Typography variant="h6">
          Arthur Virgilio Alves Paim
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Sistemas de Informação
        </Typography>

      </Box>
    </PageLayout>
  );
};

export default Perfil;