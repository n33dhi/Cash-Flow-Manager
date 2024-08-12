import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';

const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const fetchBudgetData = useCallback(async () => {
    try {
      const response = await api.get('/cashMaster/getBudget');
      const { budget: fetchedBudget, remainingAmount } = response.data;
      setBudget(fetchedBudget);
      setRemainingBudget(remainingAmount);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  }, [updateTrigger]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  const updateBudget = async (newBudget) => {
    try {
      await api.post('/cashMaster/setBudget', { budget: newBudget });
      setUpdateTrigger(prev => !prev);
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  return { budget, remainingBudget, updateBudget };
};

export default useBudget;
