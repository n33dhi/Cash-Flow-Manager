import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HistoryTable from '../components/historyTable';
import { useTheme, useMediaQuery, Box } from '@mui/material';

const HistoryPage = () => {
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
          History of Claims
        </Typography>
        <Button
          component={Link}
          variant="contained"
          to="/cashQuester/request"
          sx={{
            mt: isMobile ? 2 : 0,
            alignSelf: isMobile ? 'initial' : 'initial',
          }}
        >
          + Request
        </Button>
      </Box>
      <HistoryTable />
    </Box>
  );
};

export default HistoryPage;
