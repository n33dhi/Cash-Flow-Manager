import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { clearAccessToken } from "../Utilities/tokenManagement";
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';
import { clearUserData } from "../stateManagement/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const role = useSelector((state) => state.auth.role);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    document.body.style.overflow = "hidden";
  };

  const handleLogout = () => {
    setAnchorEl(null);
    clearAccessToken();
    Cookies.remove('refreshToken', { path: '/' });

    try {
      api.post("/logout");
      dispatch(clearUserData()); // clear user data from redux store
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/login");
  };

  const handleUsers = () => {
    navigate("/cashMaster/users");
    setAnchorEl(null);
  };

  const handleHistory = () => {
    if (role === "admin") {
      navigate("/cashMaster/requests");
    } else {
      navigate("/cashQuester/history");
    }
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      sx={{
        background: "rgba(255, 255, 255, 0.7)",
        color: "#32393d",
        boxShadow: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 0 } }}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              style={{
                textDecoration: "none",
                fontWeight: "800",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography color="#ff3434" fontWeight={800} fontSize={24}>
                Petty
              </Typography>
              <Typography color="#32393d" fontWeight={800} fontSize={24}>
                Wallet
              </Typography>
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "50px",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: "700", opacity: "80%" }}
            >
              {role === "admin" ? "CashMaster" : "CashQuester"}
            </Typography>
            {role === "admin" && (
              <Typography
                fontWeight={800}
                fontSize={16}
                onClick={handleUsers}
                sx={{
                  color: "#32393d",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#ff3434",
                  },
                }}
              >
                Users
              </Typography>
            )}
            <Typography
              color="#ff3434"
              fontWeight={800}
              fontSize={16}
              onClick={handleHistory}
              sx={{
                color: "#32393d",
                cursor: "pointer",
                "&:hover": {
                  color: "#ff3434",
                },
              }}
            >
              {role === 'admin' ? 'Claims' : 'History'}
            </Typography>
            <Typography
              color="#32393d"
              fontWeight={800}
              fontSize={16}
              onClick={handleLogout}
              sx={{
                color: "#32393d",
                cursor: "pointer",
                "&:hover": {
                  color: "#ff3434",
                },
              }}
            >
              Logout
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {role === "admin" && (
                <MenuItem onClick={handleUsers}>Users</MenuItem>
              )}
              <MenuItem onClick={handleHistory}>History</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
