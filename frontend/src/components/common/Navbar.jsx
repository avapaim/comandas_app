import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  Dashboard,
  People,
  Group,
  RestaurantMenu,
  Receipt,
  PointOfSale,
  Logout,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import perfil from "../../assets/perfil.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { label: "Dashboard", icon: <Dashboard />, path: "/home" },
    { label: "Funcionários", icon: <People />, path: "/funcionarios" },
    { label: "Clientes", icon: <Group />, path: "/clientes" },
    { label: "Produtos", icon: <RestaurantMenu />, path: "/produtos" },
    { label: "Comandas", icon: <Receipt />, path: "/comandas" },
    { label: "Caixa", icon: <PointOfSale />, path: "/caixa" },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            Comandas do Zé
          </Typography>

          {isAuthenticated && (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}

                <IconButton color="inherit" onClick={() => navigate("/perfil")}>
                  <Avatar src={perfil} />
                </IconButton>

                <IconButton color="inherit" onClick={handleLogout}>
                  <Logout />
                </IconButton>
              </Box>

              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton color="inherit" onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={mobileDrawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            <ListItem
              button
              onClick={() => {
                navigate("/perfil");
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
          </List>

          <Divider />

          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;