import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, CssBaseline } from '@mui/material';
import Axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http:localhost:3001/forgetPassword", {
        email,
    }).then(response => {
        if(response.data.status) {
            alert("Check your")
        }
    })
    // console.log('Email submitted:', email);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            p: 2,
            
          }}
        >
          <Typography style={{ fontFamily:'Nunito', fontWeight:'700', fontSize:'24px'}} gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" mb={2}>
            Under Development! Please contact Admin.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="email"
            />
            <Button
            disabled
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: '#ff3434', color: '#fff', '&:hover': { backgroundColor: '#ff6f61' } }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
