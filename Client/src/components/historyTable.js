import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axiosConfig';
import {
  Table, Container, CircularProgress, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery, FormControl, MenuItem, Select, InputLabel, TableSortLabel
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { styled, useTheme } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
}));

const HistoryTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortedRequests, setSortedRequests] = useState([]);

  const userId = useSelector((state) => state.auth.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = useCallback(async () => {
    if (userId) {
      setLoading(true);
      try {
        const response = await api.post('/cashQuester/history', { userId });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('User ID is missing');
      setRequests([]);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filteredRequests = [...requests];

    filteredRequests.sort((a, b) => {
      const aValue = new Date(a.createdAt).getTime();
      const bValue = new Date(b.createdAt).getTime();
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    if (statusFilter) {
      filteredRequests = filteredRequests.filter(request => request.status === statusFilter);
    }

    setSortedRequests(filteredRequests);
  }, [requests, sortDirection, statusFilter]);

  const handleSort = useCallback(() => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  }, []);

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'primary';
      case 'Accepted':
        return 'success';
      case 'Declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const MemoizedTable = useMemo(() => (
    <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={true}
                direction={sortDirection}
                onClick={handleSort}
              >
                Claim ID
              </TableSortLabel>
            </TableCell>
            <TableCell>Date</TableCell>
            {!isMobile && <TableCell>Description</TableCell>}
            {!isMobile && <TableCell>Amount</TableCell>}
            {!isMobile && <TableCell>Category</TableCell>}
            {!isMobile && <TableCell>Approved By</TableCell>}
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRequests.length > 0 ? (
            sortedRequests.map((request, index) => (
              <TableRow key={request._id} onClick={() => handleRowClick(request)}>
                <TableCell>{`PW-${request.requestId}`}</TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                {!isMobile && <StyledTableCell>{request.description}</StyledTableCell>}
                {!isMobile && <TableCell>{request.amount}</TableCell>}
                {!isMobile && <TableCell>{request.category}</TableCell>}
                {!isMobile && <TableCell>{request.approvedBy}</TableCell>}
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusChipColor(request.status)}
                    icon={<CircleIcon />}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isMobile ? 7 : 8} style={{ textAlign: 'center' }}>
                No records found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ), [sortedRequests, sortDirection, isMobile, handleSort]);

  return (
    <Container>
      <div style={{ display: 'flex', alignItems:'center', marginBottom: '30px', width: '200px', gap:'10px' }}>
      <Typography style={{width:'120px'}} fontSize={20} fontWeight={700}>Sort by</Typography>
        <FormControl fullWidth margin='normal'>
          <InputLabel id="filter-select-label">Select</InputLabel>
          <Select
            labelId="filter-select-label"
            id="filter-select"
            value={statusFilter}
            label="filter"
            name="filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Declined">Declined</MenuItem>
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        MemoizedTable
      )}

      {selectedRequest && (
        <Dialog open={true} onClose={handleCloseModal}>
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>Claim ID:</strong>{`PW-${selectedRequest.requestId}`}</Typography>
            <Typography variant="body1"><strong>Date:</strong> {formatDate(selectedRequest.createdAt)}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {selectedRequest.description}</Typography>
            <Typography variant="body1"><strong>Amount:</strong> {selectedRequest.amount}</Typography>
            <Typography variant="body1"><strong>Category:</strong> {selectedRequest.category}</Typography>
            <Typography variant="body1"><strong>Approved By:</strong> {selectedRequest.approvedBy}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {selectedRequest.status}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant='contained'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default HistoryTable;
