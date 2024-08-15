import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const useRequestStatusCounts = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);

  useEffect(() => {
    const fetchRequestStatusCounts = async () => {
      try {
        const response = await api.get('/cashMaster/dashboard');
        const requests = response.data.data;

        // Calculate counts for each status
        const pending = requests.filter(request => request.status === 'Pending').length;
        const accepted = requests.filter(request => request.status === 'Accepted').length;
        const declined = requests.filter(request => request.status === 'Declined').length;
        // console.log(pending);

        setPendingCount(pending);
        setAcceptedCount(accepted);
        setDeclinedCount(declined);

      } catch (error) {
        console.error('Error fetching request status counts:', error);
      }
    };

    fetchRequestStatusCounts();
  }, []);

  return { pendingCount, acceptedCount, declinedCount };
};

export default useRequestStatusCounts;
