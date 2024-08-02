import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import Logo from "../smiling man with palm up.svg";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Password validation
    if (name === "password" && value.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters long.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    await Axios.post("http://localhost:3001/register", formData)
      .then((response) => {
        // console.log(response);
        if (response.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        // backgroundColor: "#f2f2f2",
        p: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: { xs: "0px 10px", md: "0px 60px" },
          p: { xs: 3, md: 7 },
          borderRadius: 2,
          background: "#fff",
          width: "100%",
          boxShadow: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
          maxWidth: 1200,
          gap: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "flex-start" },
            mb: { xs: 3, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-start" },
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
          <Typography fontSize={24} mb={1} style={{ textAlign: "left" }}>
            Create a PettyWallet Account
          </Typography>
          <Typography style={{ textAlign: "left" }} fontSize={16}>
            Enter your Details
          </Typography>
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              marginTop: 20,
            }}
          />
        </Box>
        <Box sx={{ flex: 1, width: { xs: "270px", md: "150px" } }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={formData.role}
                label="Role"
                name="role"
                onChange={handleChange}
                required
              >
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"employee"}>Employee</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="password"
              error={!!errors.password}
              helperText={errors.password || " "}
              FormHelperTextProps={{ style: { margin: 0 } }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;