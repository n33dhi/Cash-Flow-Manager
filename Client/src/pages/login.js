import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { setAccessToken } from "../Utilities/tokenManagement";
import { useDispatch, useSelector } from "react-redux";
import { setTokenData } from "../stateManagement/authSlice";

import image from "../minimal black line money.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const role = useSelector((state) => state.auth.role);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await api.post("http://localhost:3001/login", formData);
      // console.log("Response:", response.data);

      const { token } = response.data;

      if (token) {
        dispatch(setTokenData(token)); //decodes the token and sets user data in Redux
        setAccessToken(token); //sets the token in memory

        console.log("User role:", role);

        if (role.includes("admin")) {
          navigate("/cashMaster/dashboard");
        } else if (role.includes("employee")) {
          navigate("/cashQuester/home");
        } else {
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Stack column on small screens
        alignItems: "center",
        justifyContent: { xs: "flex-start", sm: "center", md: "center" },
        minHeight: "100vh",
        backgroundColor: "#f2f2f2",
        gap: { xs: 0, md: "50px" },
        padding: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" }, // Hide image on small screens
          flexDirection: "column",
          justifyItems: "flex-start",
          width: "700px",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          fontSize={36}
          fontWeight={800}
          sx={{
            background:
              "linear-gradient(90deg, #FF3434 32.97%, #32393D 60.54%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Effortless Petty Cash Management
        </Typography>
        <Typography fontSize={20} style={{ padding: "10px 20px" }}>
          Streamline your petty cash processes with PettyWallet and experience
          the ease of managing funds and expenses.
        </Typography>
        <img
          src={image}
          alt="Logo"
          style={{
            width: "100%",
            maxWidth: 400,
            height: "auto",
            marginTop: 20,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 5,
          borderRadius: 2,
          background: { xs: "#f2f2f2", sm: "fff", md: "#fff" },
          width: { xs: "90%", sm: "400px" },
          boxShadow: {
            xs: "none",
            sm: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
            md: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
          },
        }}
      >
        <Typography fontSize={20} fontWeight={800} marginBottom={3}>
          Birdscale
        </Typography>
        <Typography fontSize={24}>Welcome to</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mb: 2,
            mr: { xs: 3 },
          }}
        >
          <Typography color={"#ff3434"} fontWeight={800} fontSize={36}>
            Petty
          </Typography>
          <Typography color={"#32393d"} fontWeight={800} fontSize={36}>
            Wallet
          </Typography>
        </Box>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "5px" }}
        >
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="password"
          />
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgetPassword");
              }}
              style={{
                textDecoration: "none",
                color: "#32393d",
                fontWeight: "700",
                fontFamily: "Nunito",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Login
          </Button>
        </form>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2" style={{ marginTop: "10px" }}>
            Don't have an account?{" "}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              style={{
                textDecoration: "none",
                color: "#32393d",
                fontWeight: "800",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
