import React, { useEffect, useState } from "react";
import { Button, Typography, Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api/axiosConfig";

const Home = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState(0);
  const userId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.post('/cashQuester/userDetail', { userId });
        setUserData(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch claimed amount on component mount and when userId changes
  useEffect(() => {
    const fetchUserAmount = async () => {
      try {
        const response = await api.post(`/cashQuester/history`, { userId });
        const requests = response.data;
  
        // Filter approved requests
        const approvedRequests = requests.filter(request => request.status === 'Accepted');
  
        // Sum the amount of approved requests
        const totalAmount = approvedRequests.reduce((sum, request) => sum + request.amount, 0);
  
        setAmount(totalAmount);
      } catch (error) {
        console.error("Error fetching user amount:", error);
      }
    };
  
    fetchUserAmount();
  }, [userId]);
  

  const handleRequest = () => {
    navigate("/cashQuester/request");
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div
      style={{
        marginTop: "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        fontSize={{ xs: 16, md: 24 }}
        fontWeight={700}
        textAlign={"left"}
      >
        Welcome, {userData.userName}👋
      </Typography>
      <Typography
        fontSize={{ xs: 30, md: 40 }}
        marginTop={2}
        fontWeight={800}
        align="center"
      >
        Ready to Claim for your expenses?
      </Typography>
      <Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" }, // Hide on mobile
            width: "350px",
            height: "180px",
            padding: 2,
            borderRadius: "15px",
            background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: theme.palette.common.white,
            flexDirection: "column",
            boxShadow: theme.shadows[5],
            position: "relative",
            marginTop: {xs: 'none', md: '32px'}
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
          >
            <PersonIcon fontSize="large" />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
            }}
          >
            <Typography fontSize={12}>
              <strong>Date Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}
            </Typography>
            <Typography fontSize={12}>
              <strong>Claimed Amount:</strong> {amount.toLocaleString()} ₹
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              textAlign: "right",
            }}
          >
            <Typography fontWeight={500} fontSize={28}>
              {userData.userName}
            </Typography>
            <Typography fontSize={14}>{userData.email}</Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              {userData.role === "admin" ? "Admin" : "Employee"}
            </Typography>
            <Typography fontSize={12}>
              <strong>User ID:</strong> {userData.userId}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography fontSize={20} marginTop={4} fontWeight={400} align="center">
        Let us help you streamline the process.
      </Typography>
      <Button
        type="submit"
        variant="contained"
        onClick={handleRequest}
        sx={{ mt: { xs: 5, md: 5 }, padding: "10px 50px" }}
      >
        Request
      </Button>
    </div>
  );
};

export default Home;
