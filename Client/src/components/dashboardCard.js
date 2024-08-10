import React from 'react';
import useDashboardData from '../hooks/totalAmount';

import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import UsersIcon from '@mui/icons-material/People';
import ClaimsIcon from '@mui/icons-material/Checklist';
import AmountIcon from '@mui/icons-material/MonetizationOn';
import MonthIcon from '@mui/icons-material/Event';

const AnalyticsCard = ({ icon, title, value, chipLabel, cardStyle, valueColor, iconColor, iconFill }) => {
  return (
    <Card 
      sx={{ 
        width: 240, 
        height: { xs: 100, md: 140 },
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
          <Typography variant="body2" sx={{ fontSize: 18 }}>
            {chipLabel}
          </Typography>
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
        <Box sx={{ marginTop: 'auto' }}>
          <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 'bold', color: valueColor }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, color: 'gray' }}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardCards = () => {

  const { totalAmountProcessed, claimsProcessedThisMonth, amountSpentThisMonth, totalClaims, claimsThisMonth } = useDashboardData();

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
        title="Total Amount Processed"
        value={totalAmountProcessed !== null ? `₹${totalAmountProcessed.toLocaleString()}` : 'Loading...'}
        chipLabel="Total Amount"
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
        icon={<MonthIcon />}
        title="Amount Spend this Month"
        value={amountSpentThisMonth !== null ? `₹${amountSpentThisMonth.toLocaleString()}` : 'Loading...'}
        chipLabel="This Month"
        valueColor="rgba(71,255,67,1)"
        iconColor="rgba(71,255,67,0.20)"
        iconFill="rgba(71,255,67,1)"
        cardStyle={{
          boxShadow: '0 4px 12px 0 rgba(71,255,67,.2)',
          background: 'rgba(71,255,67,.05)',
          borderBottom: '3px solid rgba(71,255,67,.2)',
          borderRight: '3px solid rgba(71,255,67,.2)',
        }}
      />
      <AnalyticsCard
        icon={<ClaimsIcon />}
        title="Total Claims"
        value={totalClaims !== null ? totalClaims : 'Loading...'}
        chipLabel="Claims"
        valueColor="rgba(25, 118, 210, 1)"
        iconColor="rgba(25, 118, 210, 0.20)"
        iconFill="rgba(25, 118, 210, 1)"
        cardStyle={{
          boxShadow: '0 4px 12px 0 rgba(25, 118, 210, .2)',
          background: 'rgba(25, 118, 210, 0.05)',
          borderBottom: '3px solid rgba(25, 118, 210, .2)',
          borderRight: '3px solid rgba(25, 118, 210, .2)',
        }}
      />
      <AnalyticsCard
        icon={<UsersIcon />}
        title="Number of Users"
        value={claimsThisMonth !== null ? claimsThisMonth : 'Loading...'}
        chipLabel="Active"
        valueColor="rgba(255, 52, 52, 1)"
        iconColor="rgba(255, 52, 52, 0.20)"
        iconFill="rgba(255, 52, 52, 1)"
        cardStyle={{
          boxShadow: '0 4px 12px 0 rgba(255, 52, 52, .2)',
          background: 'rgba(255, 52, 52, 0.05)',
          borderBottom: '3px solid rgba(255, 52, 52, .2)',
          borderRight: '3px solid rgba(255, 52, 52, .2)',
        }}
      />
    </Stack>
  );
};

export default DashboardCards;
