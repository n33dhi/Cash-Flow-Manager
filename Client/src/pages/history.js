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
        <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, justifyContent:'start'}}>
        <Typography
          sx={{ fontSize: { xs: "18px", md: "24px" }, fontWeight: 700 }}
          gutterBottom
        >
          <Link to={"/cashQuester/home"} style={{ textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px" }}> &gt; </span>
        </Typography>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          History of Claims
        </Typography>
        </Box>
        <Button
          component={Link}
          variant="contained"
          to="/cashQuester/request"
          sx={{
            mt: isMobile ? 2 : 0,
            alignSelf: isMobile ? 'initial' : 'initial',
          }}
        >
          New Request
        </Button>
      </Box>
      <HistoryTable />
    </Box>
  );
};

export default HistoryPage;
