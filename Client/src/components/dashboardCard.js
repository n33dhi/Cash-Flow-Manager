import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Divider, Button } from "@mui/material";
import { AccountBalanceWallet as WalletIcon, RequestQuote as RequestIcon, TrendingUp as TrendIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import api from "../api/axiosConfig";

const DashboardCards = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [requestStatus, setRequestStatus] = useState({
    pending: 0,
    approved: 0,
    declined: 0,
  });
  const [recentActivity, setRecentActivity] = useState({
    lastRequestDate: "",
    lastLogin: "",
  });

  useEffect(() => {
    // Fetch data for total amount processed
    const fetchTotalAmount = async () => {
      try {
        const response = await api.get(`/cashMaster/user/${userId}/totalAmount`);
        setTotalAmount(response.data.totalAmount);
      } catch (error) {
        console.error("Error fetching total amount:", error);
      }
    };

    // Fetch data for this month's spending
    const fetchMonthlyAmount = async () => {
      try {
        const response = await api.get(`/cashMaster/user/${userId}/monthlyAmount`);
        setMonthlyAmount(response.data.monthlyAmount);
      } catch (error) {
        console.error("Error fetching monthly amount:", error);
      }
    };

    // Fetch request status data
    const fetchRequestStatus = async () => {
      try {
        const response = await api.get(`/cashMaster/user/${userId}/requestStatus`);
        setRequestStatus(response.data);
      } catch (error) {
        console.error("Error fetching request status:", error);
      }
    };

    // Fetch recent activity data
    const fetchRecentActivity = async () => {
      try {
        const response = await api.get(`/cashMaster/user/${userId}/recentActivity`);
        setRecentActivity(response.data);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchTotalAmount();
    fetchMonthlyAmount();
    fetchRequestStatus();
    fetchRecentActivity();
  }, [userId]);

  return (
    <Box display="flex" flexDirection="row" gap={3} flexWrap="wrap">
      {/* Request Status Card */}
      <Card sx={{ width: 300, backgroundColor: '#1976d2', color: '#fff', borderRadius: 2, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <RequestIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6" fontWeight="bold">
              Request Status
            </Typography>
          </Box>
          <Divider sx={{ my: 2, bgcolor: '#ffffff80' }} />
          <Box mt={2}>
            <Typography>Pending: {requestStatus.pending}</Typography>
            <Typography>Approved: {requestStatus.approved}</Typography>
            <Typography>Declined: {requestStatus.declined}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Total Amount Processed Card */}
      <Card sx={{ width: 300, backgroundColor: '#2e7d32', color: '#fff', borderRadius: 2, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <WalletIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6" fontWeight="bold">
              Total Amount Processed
            </Typography>
          </Box>
          <Divider sx={{ my: 2, bgcolor: '#ffffff80' }} />
          <Box mt={2}>
            <Typography>Total Amount: ${totalAmount}</Typography>
            <Typography>This Month: ${monthlyAmount}</Typography>
          </Box>
          <Box mt={2}>
            <Button variant="contained" sx={{ bgcolor: '#ffffff20', color: '#fff' }}>
              Show This Month's Spending
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card sx={{ width: 300, backgroundColor: '#d32f2f', color: '#fff', borderRadius: 2, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TrendIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6" fontWeight="bold">
              Recent Activity
            </Typography>
          </Box>
          <Divider sx={{ my: 2, bgcolor: '#ffffff80' }} />
          <Box mt={2}>
            <Typography>Last Request: {recentActivity.lastRequestDate}</Typography>
            <Typography>Last Login: {recentActivity.lastLogin}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardCards;
