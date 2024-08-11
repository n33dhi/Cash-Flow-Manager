import React from 'react';
import useDashboardData from '../hooks/dataSummary';
import DashboardChart from '../components/dashboardChart';

import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import ClaimsIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import AmountIcon from '@mui/icons-material/MonetizationOn';


const AnalyticsCard = ({ icon, title, value, chipLabel, cardStyle, valueColor, iconColor, iconFill, ThisMonth }) => {
  return (
    <Card 
      sx={{ 
        width: 240, 
        height: { xs: 80, md: 100 },
        borderRadius: 3, 
        padding: 2, 
        textAlign: 'left', 
        position: 'relative', 
        overflow: 'hidden', 
        ...cardStyle 
      }}
    >
      <CardContent 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          height: '100%', 
          padding: 0 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{display:'flex', flexDirection:'column'}}>
          <Typography variant="body2" sx={{ fontSize: 16, color: 'gray', fontWeight:'bold'}}>
            {chipLabel}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 'bold', color: valueColor }}>
            {value}
          </Typography>
          </Box>
  
          <Box 
            sx={{ 
              width: 41, 
              height: 41, 
              borderRadius: '10px', 
              background: iconColor,
              boxShadow: `0px 4px 12px 0px ${iconColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 20, color: iconFill } })}
          </Box>
        </Box>
        <Box sx={{ marginTop: 'auto' }} display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'}>
        <Typography variant="body2" sx={{ fontSize: 12, }}>
            {title}:
          </Typography>
          <Typography sx={{color: valueColor, fontWeight: 'bold' }}>
            {ThisMonth}
          </Typography>
 
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardCards = () => {

  const { totalAmountProcessed, amountSpentThisMonth, claimsProcessedThisMonth, totalClaims, } = useDashboardData();

  return (
    <Stack 
      direction="row" 
      spacing={3} 
      sx={{ 
        marginLeft: '12px',
        gap: { xs: '20px', md: '2px' }, 
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: { xs: 'baseline', md: 'center' },
        margin: { xs: '0px', md: '12px' } 
      }}
    >
      <AnalyticsCard
        icon={<AmountIcon />}
        title="Spend this Month"
        value= {totalAmountProcessed !== null ? `₹${totalAmountProcessed.toLocaleString()}` : 'Loading...'}
        ThisMonth = {amountSpentThisMonth !== null ? `₹${amountSpentThisMonth.toLocaleString()}` : 'Loading...'}
        chipLabel="Wallet"
        valueColor="rgba(151, 71, 255, 1)"
        iconColor="rgba(151, 71, 255, 0.20)"
        iconFill="rgba(151, 71, 255, 1)"
        cardStyle={{
          boxShadow: '0 4px 12px 0 rgba(151, 71, 255, .2)',
          background: 'rgba(151, 71, 255, 0.05)',
          borderBottom: '3px solid rgba(151, 71, 255, .2)',
          borderRight: '3px solid rgba(151, 71, 255, .2)',
        }}
      />
      <AnalyticsCard
        icon={<ClaimsIcon />}
        title="Processed this Month"
        value={totalClaims !== null ? totalClaims : 'Loading...'}
        ThisMonth={claimsProcessedThisMonth !== null ? claimsProcessedThisMonth : 'Loading...'}
        chipLabel="Claims"
        valueColor="rgba(255, 152, 0, 1)" 
        iconColor="rgba(255, 152, 0, 0.20)"
        iconFill="rgba(255, 152, 0, 1)"
        cardStyle={{
          boxShadow: '0 4px 12px 0 rgba(255, 152, 0, .2)',
          background: 'rgba(255, 152, 0, 0.05)', 
          borderBottom: '3px solid rgba(255, 152, 0, .2)', 
          borderRight: '3px solid rgba(255, 152, 0, .2)'
        }}
      />
      <DashboardChart />
    </Stack>
  );
};

export default DashboardCards;
