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
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { validatePassword } from "../Utilities/validation";
import { Toaster, toast } from "react-hot-toast";

import Logo from "../Sign up form.svg";

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

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Validate password field
    if (name === "password") {
      const errorMessage = validatePassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform validation for all fields
    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: passwordError,
      }));
      return; // Prevent form submission if there's a validation error
    }

    // console.log(formData);
    await api
      .post("/register", formData)
      .then((response) => {
        // console.log(response);
        toast.success('Success, Please Login!',
          {
            position: "top-right",
            style: {
              fontFamily: "Nunito, sans-serif",
              fontWeight: "700",
            },
          }
        )
        if (response.data.status) {
          setTimeout(() => {navigate("/login");}, 2000)
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
        p: { xs: 0, md: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: { xs: "0px 0px", md: "0px 60px" },
          p: { xs: 0, md: 7 },
          borderRadius: 2,
          // background: "#fff",
          width: "100%",
          maxWidth: 1200,
          gap: { xs: 3, md: 10 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" }, // Hide on xs screens
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
          <Typography
            style={{ textAlign: "left" }}
            fontSize={16}
            marginBottom={5}
          >
            Enter your Details
          </Typography>
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: 400,
              height: 300,
              marginTop: 20,
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            width: { xs: "270px", sm: "400px", md: "150px" },
            boxShadow: {
              xs: "none",
              sm: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
              md: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
            },
            padding: "50px",
            background: { xs: "none", sm: "#fff", md: "#fff" },
            borderRadius: "5px",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Typography
              fontSize={24}
              fontWeight={500}
              mb={3}
              style={{ textAlign: "left" }}
            >
              Signup
            </Typography>
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
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password || " "}
              FormHelperTextProps={{ style: { margin: 0 } }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <Typography
              variant="body2"
              style={{ marginTop: "10px", textAlign: "initial" }}
            >
              Have an Account?{" "}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                style={{
                  textDecoration: "none",
                  color: "#32393d",
                  fontWeight: "800",
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Toaster position="top-right" reverseOrder={false} />
    </Box>
  );
};

export default Register;
