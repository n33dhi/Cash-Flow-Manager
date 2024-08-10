import React from 'react';
import Typography from '@mui/material/Typography';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import NewRequestsTable from '../components/newRequestTable';

const Dashboard = () => {
  const name = useSelector((state) => state.auth.name);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        marginTop: isMobile ? '100px' : '110px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'center' : 'flex-start',
        gap: 5,
        px: isMobile ? 2 : 0, 
        marginBottom: '30px'
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : '1200px', 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          paddingLeft: isMobile ? '24px' : 0
        }}
      >
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          Hi, {name} 👋
        </Typography>
      </Box>
      <Typography fontSize={20} fontWeight={700}>New Requests</Typography>
        <NewRequestsTable />
    </Box>
  );
};

export default Dashboard;
