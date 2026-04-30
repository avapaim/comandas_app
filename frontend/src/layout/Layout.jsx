import Navbar from "../components/commom/Navbar";
import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </>
  );
}