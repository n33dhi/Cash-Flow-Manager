import React from "react";
import { Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const name = useSelector((state) => state.auth.name);
  const navigate = useNavigate();

  const handleRequest = () => {
    navigate("/cashQuester/request");
  };

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
        Welcome, {name}👋
      </Typography>
      <Typography
        fontSize={{ xs: 30, md: 40 }}
        marginTop={5}
        fontWeight={800}
        align="center"
      >
        Ready to Claim for your expenses?
      </Typography>
      <Typography fontSize={20} marginTop={4} fontWeight={400} align="center">
        Let us help you streamline the process.
      </Typography>
      <Button
        type="submit"
        variant="contained"
        onClick={handleRequest}
        sx={{ mt: { xs: 5, md: 7 }, padding: "10px 50px" }}
      >
        Request
      </Button>
    </div>
  );
};

export default Home;
