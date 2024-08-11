import React from 'react';
import { PieChart, Pie, Cell, Text } from 'recharts';
import useRequestStatusCounts from '../hooks/requestCounts';
import { Typography, Stack, Card, CardContent, Box } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';

const RADIAN = Math.PI / 180;

const PieValueLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, count, fill }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <Text
      x={x}
      y={y}
      fill={fill}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
      <tspan x={x} dy="1.2em">
        {count}
      </tspan>
    </Text>
  );
};

const DashboardPieChart = () => {
  const { pendingCount, acceptedCount, declinedCount } = useRequestStatusCounts();

  const data = [
    { name: 'Pending', value: pendingCount, color: '#ff9800' },
    { name: 'Accepted', value: acceptedCount, color: '#4caf50' },
    { name: 'Declined', value: declinedCount, color: '#f44336' },
  ];

  const getGlowStyle = (color) => ({
    filter: `drop-shadow(0 0 5px ${color})`
  });

  return (
    <Card sx={{
      width: 280, 
      height: 100, 
      borderRadius: 3, 
      padding: 2, 
      boxShadow: '0 4px 12px 0 rgba(255, 52, 52, .2)',
      background: 'rgba(255, 52, 52, 0.05)',
      borderBottom: '3px solid rgba(255, 52, 52, .2)',
      borderRight: '3px solid rgba(255, 52, 52, .2)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      position: 'relative', // Allow positioning of TaskIcon
    }}>
      <CardContent sx={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PieChart width={110} height={110}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={38} 
            outerRadius={50} 
            labelLine={false}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={getGlowStyle(entry.color)} />
            ))}
          </Pie>
          <circle cx="50%" cy="50%" r="40" fill="#FF34340D" />
        </PieChart>
      </CardContent>
      <Stack spacing={.3} alignItems="flex-start">
        {data.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography fontSize={16} fontWeight={700} sx={{ color: entry.color }}>
              {`${entry.value}`}
            </Typography>
            <Typography sx={{ fontWeight: 700, marginLeft: '6px', color: 'gray' }}>
              {entry.name}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Box
        sx={{
          position: 'absolute',
          top: 13,
          right: 15,
          width: 41,
          height: 41,
          borderRadius: '10px',
          background: 'rgba(255, 52, 52, 0.2)',
          boxShadow: '0px 4px 12px 0px rgba(255, 52, 52, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TaskIcon sx={{ fontSize: 20, color: '#FF3434' }} />
      </Box>
    </Card>
  );
};

export default DashboardPieChart;
