import React from "react";
import { PieChart, Pie, Cell, Text } from "recharts";
import useRequestStatusCounts from "../hooks/requestCounts";
import { Typography, Card, CardContent, Box } from "@mui/material";

const DashboardPieChart = () => {
  const { pendingCount, acceptedCount, declinedCount } =
    useRequestStatusCounts();

  const data = [
    { name: "Pending", value: pendingCount, color: "#ff9800" },
    { name: "Accepted", value: acceptedCount, color: "#4caf50" },
    { name: "Declined", value: declinedCount, color: "#f44336" },
  ];

  const getGlowStyle = (color) => ({
    filter: `drop-shadow(0 0 3px ${color})`,
  });

  return (
    <Card
      sx={{
        width: 240,
        height: 100,
        borderRadius: 3,
        padding: 2,
        // boxShadow: "0 4px 16px 0 hsla(0, 0%, 9%, .1)",
        background: "#fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box spacing={0.3} alignItems="flex-start" sx={{textWrap:'nowrap'}}>
        <Typography fontWeight={700} color={"gray"}>
          Status Overview
        </Typography>
        {data.map((entry, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
              sx={{
                marginLeft: "1px",
                color: "gray",
                fontSize: "12px",
              }}
            >
              {entry.name}: 
            </Typography>
            <Typography
              fontSize={16}
              fontWeight={700}
              sx={{ color: entry.color, marginLeft:'5px' }}
            >
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <CardContent
        sx={{
          paddingTop: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={getGlowStyle(entry.color)}
              />
            ))}
          </Pie>
          <circle cx="50%" cy="50%" r="40" fill="#FF3434" fillOpacity={"1%"} />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default DashboardPieChart;
