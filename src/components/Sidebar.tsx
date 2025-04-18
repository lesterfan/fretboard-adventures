import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Toolbar,
  AppBar,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

interface Route {
  path: string;
  name: string;
}

interface Props {
  routes: Route[];
}

const drawerWidth = 240;

const styles = {
  appBar: {
    backgroundColor: "white",
    color: "black",
    boxShadow: "none",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  toolbar: {
    justifyContent: "flex-start",
  },
  menuButton: {
    color: "black",
    "& .MuiSvgIcon-root": {
      fontSize: "1.2rem",
    },
  },
  title: {
    marginLeft: "0.35em",
  },
};

export const Sidebar: React.FC<Props> = ({ routes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentPageTitle = () => {
    const currentRoute = routes.find((route) => route.path === location.pathname);
    return currentRoute ? currentRoute.name : "Fretboard Adventures";
  };

  const drawer = (
    <List>
      {routes.map((route) => (
        <ListItem key={route.path} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(route.path);
              setIsOpen(false);
            }}
          >
            <ListItemText primary={route.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="absolute" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={styles.title}>
            {getCurrentPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};
