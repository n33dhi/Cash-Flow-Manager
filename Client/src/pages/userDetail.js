import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api/axiosConfig";
import ClaimTable from "../components/claimTable";

function UserDetail() {
  const { userId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/cashMaster/user/${userId}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/cashMaster/user/${userId}`);
      navigate("/cashMaster/users");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        marginTop: isMobile ? "100px" : "110px",
        display: "flex",
        flexDirection: "column",
        alignItems: "initial",
        gap: 2,
        px: isMobile ? 2 : 0,
        marginBottom: "30px",
      }}
    >
      {/* User Info and Delete Button */}
      <Box
        sx={{
          width: isMobile ? "100%" : "1200px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
       
        <Typography sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: 700 }} gutterBottom>
        <Link to={'/cashMaster/users'} style={{textDecoration: 'none'}}>PettyWallet Users </Link><span style={{ margin: "0 8px" }}> &gt; </span> {userData.userName}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteUser}
          sx={{
            alignSelf: isMobile ? "flex-start" : "flex-end",
            mt: isMobile ? 2 : 0,
          }}
        >
          Delete User
        </Button>
      </Box>

      {/* Profile Card */}
      <Box>
        <Typography
          fontSize={20}
          fontWeight={700}
          marginBottom={2}
          sx={{
            display: { xs: "none", md: "block" }, // Hide on mobile
          }}
        >
          Profile Card
        </Typography>
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

      {/* Claims Section */}
      <Box>
        <Typography fontSize={20} fontWeight={700} marginTop={4}>
          Claims
        </Typography>
        <ClaimTable />
      </Box>
    </Box>
  );
}

export default UserDetail;
