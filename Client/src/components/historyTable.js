import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axiosConfig';
import {
  Table, Container, CircularProgress, TableBody, InputAdornment, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery, TextField, TablePagination, TableSortLabel, IconButton
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, useTheme } from '@mui/material/styles';
import { Toaster, toast } from "react-hot-toast";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
}));

const statusChips = {
  Pending: { label: 'Pending', color: 'user2' },
  Accepted: { label: 'Accepted', color: 'success' },
  Declined: { label: 'Declined', color: 'error' },
};

const HistoryTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedRequests, setSortedRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

    if (searchQuery) {
      filteredRequests = filteredRequests.filter(request =>
        `PW-${request.requestId}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filteredRequests.sort((a, b) => {
      const aValue = new Date(a.createdAt).getTime();
      const bValue = new Date(b.createdAt).getTime();
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    if (statusFilter) {
      filteredRequests = filteredRequests.filter(request => request.status === statusFilter);
    }

    setSortedRequests(filteredRequests);
  }, [requests, sortDirection, statusFilter, searchQuery]);

  const handleSort = useCallback(() => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? '' : status);
  };

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

  const handleDeleteRequest = async (requestId) => {
    const toastId = toast.loading('Deleting request...');
    try {
        await api.delete(`/cashQuester/history/${requestId}`);
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
        toast.success('Request deleted successfully!', { id: toastId, style: {
          fontFamily: 'Nunito, sans-serif',
          fontWeight: '700'
        } });
    } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('Failed to delete request.', { id: toastId, style: {
          fontFamily: 'Nunito, sans-serif',
          fontWeight: '700'
        } });
    }
};


  const isDeleteIconDisabled = (createdAt) => {
    const oneHourInMs = 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const requestTime = new Date(createdAt).getTime();
    return currentTime - requestTime > oneHourInMs;
  };

  const paginatedRequests = useMemo(() => {
    return sortedRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRequests, page, rowsPerPage]);

  const statusCounts = useMemo(() => {
    return Object.keys(statusChips).reduce((counts, status) => {
      counts[status] = requests.filter(request => request.status === status).length;
      return counts;
    }, {});
  }, [requests]);

  const MemoizedTable = useMemo(() => (
    <TableContainer component={Paper} style={{ overflowX: 'auto', backgroundColor: '#fff' }}>
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
            {!isMobile && <TableCell>Date</TableCell>}
            {!isMobile && <TableCell>Description</TableCell>}
            {!isMobile && <TableCell>Amount</TableCell>}
            {!isMobile && <TableCell>Category</TableCell>}
            {!isMobile && <TableCell>Approved By</TableCell>}
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <TableRow key={request._id} onClick={() => handleRowClick(request)}>
                <TableCell>{`PW-${request.requestId}`}</TableCell>
                {!isMobile && <TableCell>{formatDate(request.createdAt)}</TableCell>}
                {!isMobile && <StyledTableCell>{request.description}</StyledTableCell>}
                {!isMobile && <TableCell>{request.amount}</TableCell>}
                {!isMobile && <TableCell>{request.category}</TableCell>}
                {!isMobile && <TableCell>{request.approvedBy}</TableCell>}
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusChipColor(request.status)}
                    icon={<CircleIcon />}
                    style={{ cursor: 'default' }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRequest(request._id);
                    }}
                    disabled={isDeleteIconDisabled(request.createdAt)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isMobile ? 8 : 9} style={{ textAlign: 'center' }}>
                No records found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={sortedRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </TableContainer>
  ), [paginatedRequests, sortDirection, isMobile, handleSort, page, rowsPerPage, sortedRequests.length]);

  return (
    <Container>
      <Toaster position="top-right" reverseOrder={false} />
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '30px',
        gap: isMobile ? '14px' : '0'
      }}>
        <TextField
          label="Search by Claim ID"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '350px',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <Typography marginRight={2} fontWeight={700}>Sort by</Typography>
          {Object.keys(statusChips).map((status) => (
            <Chip
              key={status}
              label={`${statusChips[status].label} (${statusCounts[status]})`}
              color={getStatusChipColor(status)}
              onClick={() => handleStatusFilter(status)}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'white',
                border: statusFilter === status ? `2px solid ${theme.palette[statusChips[status].color].main}` : 'none',
                '&:hover': {
                  backgroundColor: 'white',
                }
              }}
              icon={<CircleIcon />}
            />
          ))}
        </div>
      </div>
  
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        MemoizedTable 
      )}
  
      {selectedRequest && (
        <Dialog
          open={true}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>Claim ID:</strong> {`PW-${selectedRequest.requestId}`}</Typography>
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
