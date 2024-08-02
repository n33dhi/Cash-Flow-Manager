import React from "react";
import Navbar from "../components/navbar";
import {  Button, Typography } from "@mui/material";
import img from '../cash receipt and coin.svg';

const Home = () => {
  return (
    <>
      <Navbar />
        <div style={{ marginTop: '120px', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Typography fontSize={{xs:16, md:24}} fontWeight={700} textAlign={'left'}>
                Welcome, Needhichozhan 👋
            </Typography>
            <Typography fontSize={{xs: 30, md: 40}} marginTop={5} fontWeight={800} align="center">
              Ready to Claim for your expenses?
            </Typography>
            <Typography fontSize={20} marginTop={4} fontWeight={400} align="center">
            Let us help you streamline the process.
            </Typography>
            <Button type="submit" variant="contained" sx={{ mt: {xs: 5, md: 10}, padding:'10px 50px' }}>
              Request
            </Button>
            <img
            src={img}
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              marginTop: 5,
            }}
          />
        </div>
    </>
  );
};

export default Home;
