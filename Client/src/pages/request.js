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
import Navbar from "../components/navbar";
import img from "../Sign up form.svg";
import api from "../api/axiosConfig";
import { useSelector } from "react-redux";



const RequestForm = () => {
  const role = useSelector((state) => state.auth.id);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    approvedBy: "",
    userId: role,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await api.post("/cashQuester/newRequest", formData);
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
              maxWidth: 1700,
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
              <Typography
                fontSize={36}
                mb={1}
                fontWeight={700}
                style={{ textAlign: "left" }}
              >
                Claim your flight 🚀
              </Typography>
              <Typography style={{ textAlign: "left" }} fontSize={16}>
                PettyCash Request Form
              </Typography>
              <img
                src={img}
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
                  Form
                </Typography>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="text"
                  required
                />
                <TextField
                  label="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  type="number"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formData.category}
                    label="Category"
                    name="category"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value={"travel"}>Travel</MenuItem>
                    <MenuItem value={"office supplies"}>
                      Office Supplies
                    </MenuItem>
                    <MenuItem value={"employee reimbursements"}>
                      Employee Reimbursementss
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Approved By"
                  name="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  type="text"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default RequestForm;
