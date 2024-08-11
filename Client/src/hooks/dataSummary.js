import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const useDashboardData = () => {
  const [totalAmountProcessed, setTotalAmountProcessed] = useState(null);
  const [claimsProcessedThisMonth, setClaimsProcessedThisMonth] = useState(null);
  const [amountSpentThisMonth, setAmountSpentThisMonth] = useState(null);
  const [totalClaims, setTotalClaims] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/cashMaster/dashboard');
        const requests = response.data.data; 

        // Calculate total amount processed
        const totalAmount = requests
          .filter(request => request.status === 'Accepted')
          .reduce((acc, request) => acc + request.amount, 0);
        setTotalAmountProcessed(totalAmount);

        // Calculate claims processed this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const claimsThisMonth = requests
          .filter(request => 
            request.status === 'Accepted' && 
            new Date(request.createdAt) >= startOfMonth
          ).length;
        setClaimsProcessedThisMonth(claimsThisMonth);

        // Calculate amount spent this month
        const amountSpent = requests
          .filter(request => 
            request.status === 'Accepted' && 
            new Date(request.createdAt) >= startOfMonth
          )
          .reduce((acc, request) => acc + request.amount, 0);
        setAmountSpentThisMonth(amountSpent);

        // Calculate total claims
        const totalClaimsCount = requests.length;
        setTotalClaims(totalClaimsCount);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return { totalAmountProcessed, claimsProcessedThisMonth, amountSpentThisMonth, totalClaims };
};

export default useDashboardData;
