import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1300, 
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ marginLeft: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
