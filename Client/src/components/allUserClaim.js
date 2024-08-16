import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosConfig';
import {
  Table, Container, Box, CircularProgress, TableBody, TableCell, FormControl, InputLabel, Select, MenuItem, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery, TextField, TablePagination, TableSortLabel, InputAdornment
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

const statusChips = {
  Pending: { label: 'Pending', color: 'user2' },
  Accepted: { label: 'Accepted', color: 'success' },
  Declined: { label: 'Declined', color: 'error' },
};

const AllUserClaimTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedRequests, setSortedRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusToEdit, setStatusToEdit] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [budgetId, setBudgetId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/cashMaster/dashboard');
      const requestData = response.data.data;

      const requesterIds = [...new Set(requestData.map(request => request.requester))];

      const usernameResponses = await Promise.all(
        requesterIds.map(userId => api.get(`/cashMaster/user/${userId}`))
      );

      const usernameMap = usernameResponses.reduce((acc, res) => {
        if (res.data && res.data.data && res.data.data.userName) {
          const { _id, userName } = res.data.data;
          acc[_id] = userName;
        }
        return acc;
      }, {});

      const requestsWithUsernames = requestData.map(request => ({
        ...request,
        requester: usernameMap[request.requester] || 'Unknown'
      }));

      const filteredRequests = requestsWithUsernames.filter(request => request.requester !== 'Unknown');

      setRequests(filteredRequests);
      setSortedRequests(filteredRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchBudgetId = async () => {
      try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
  
        const response = await api.post(`/cashMaster/getBudgetId`, {month: currentMonth, year: currentYear});
        if (response.data && response.data._id) {
          setBudgetId(response.data._id); 
          // console.log(response.data._id);
        } else {
          console.error("No budget found for the current month and year.");
        }
      } catch (error) {
        console.error("Error fetching budget ID:", error);
      }
    };
  
    fetchBudgetId();
  }, []);

  // Updated effect to handle searching by both name and claim ID
  useEffect(() => {
    let filteredRequests = [...requests];

    if (searchQuery) {
      filteredRequests = filteredRequests.filter(request =>
        `PW-${request.requestId}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requester.toLowerCase().includes(searchQuery.toLowerCase())
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
    setDetailsDialogOpen(true);
  };

  const handleStatusClick = (request) => {
    setSelectedRequest(request);
    setStatusToEdit(request.status);
    setEditDialogOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setDetailsDialogOpen(false);
    setEditDialogOpen(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put('/cashMaster/requests', {
        id: selectedRequest._id,
        status: newStatus
      });

      if (budgetId) {
        // console.log(budgetId);
        await api.put(`/cashMaster/updateBudget/${budgetId}`);
      }

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === selectedRequest._id
            ? { ...req, status: newStatus }
            : req
        )
      );
      setSortedRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === selectedRequest._id
            ? { ...req, status: newStatus }
            : req
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
            <TableCell>Date</TableCell>
            {!isMobile && <TableCell>Employee</TableCell>}
            {!isMobile && <TableCell>Amount</TableCell>}
            {!isMobile && <TableCell>Description</TableCell>}
            {!isMobile && <TableCell>Approved By</TableCell>}
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography fontSize={{ xs: 14, md: 18 }} fontWeight={700} style={{ marginRight: '8px' }}>
                  Click to Edit
                </Typography>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <TableRow key={request._id} onClick={() => handleRowClick(request)} style={{ cursor: 'pointer' }}>
                <TableCell>{`PW-${request.requestId}`}</TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                {!isMobile && <TableCell>{request.requester}</TableCell>}
                {!isMobile && <TableCell>{request.amount}</TableCell>}
                {!isMobile && <TableCell>{request.description}</TableCell>}
                {!isMobile && <TableCell>{request.approvedBy}</TableCell>}
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusChipColor(request.status)}
                    icon={<CircleIcon />}
                    maxWidth="xs"
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        '&:hover': {
                          backgroundColor: '#f2f2f2'
                        }
                      }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleStatusClick(request);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                No requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ), [paginatedRequests, sortDirection, isMobile, handleSort]);

  return (
    <Container maxWidth="lg">
  <FormControl variant="outlined" sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, justifyContent:'space-between', marginBottom:'30px'}}>
    <TextField
      variant="outlined"
      label="Search by name or claim ID"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ width: '250px', borderRadius: '8px', marginRight: isMobile ? '0' : 'auto', }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
    <Box sx={{ display:{xs:'none', md:'flex'}, justifyContent: 'flex-end', marginBottom: '8px', alignItems:'center' }}>
      <Typography fontSize={16} fontWeight={700} marginRight={2}>Sort by</Typography>
      {Object.keys(statusChips).map((status) => (
        <Chip
          key={status}
          label={`${statusChips[status].label} (${statusCounts[status] || 0})`}
          color={getStatusChipColor(status)}
          onClick={() => handleStatusFilter(status)}
          sx={{
            cursor: 'pointer',
            marginRight: '8px',
            border: statusFilter === status ? `2px solid ${theme.palette[statusChips[status].color].main}` : 'none',
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: '#f2f2f2'
            }
          }}
        />
      ))}
    </Box>
  </FormControl>

  {loading ? (
    <CircularProgress size={24} sx={{ marginTop: '30px' }} />
  ) : (
    MemoizedTable
  )}

  <TablePagination
    component="div"
    count={sortedRequests.length}
    page={page}
    onPageChange={handlePageChange}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleRowsPerPageChange}
    rowsPerPageOptions={[5, 10, 15]}
  />

  {/* Details Modal */}
  <Dialog
    open={detailsDialogOpen}
    onClose={handleCloseModal}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle>Request Details</DialogTitle>
    <DialogContent>
      <Typography variant="body1" gutterBottom>
        <strong>Claim ID: </strong>{`PW-${selectedRequest?.requestId}`}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Employee: </strong>{selectedRequest?.requester}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Amount:</strong> {selectedRequest?.amount}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Date: </strong>{formatDate(selectedRequest?.createdAt)}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Category:</strong> {selectedRequest?.category}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Status: </strong> {selectedRequest?.status}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} variant="contained">Close</Button>
    </DialogActions>
  </Dialog>

  {/* Edit Status Modal */}
  <Dialog
    open={editDialogOpen}
    onClose={handleCloseModal}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle>Edit Request Status</DialogTitle>
    <DialogContent>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={statusToEdit}
          onChange={(e) => setStatusToEdit(e.target.value)}
          label="Status"
        >
          {Object.keys(statusChips).map((status) => (
            <MenuItem key={status} value={status}>
              {statusChips[status].label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} variant="contained">Cancel</Button>
      <Button
        variant="contained"
        onClick={() => handleUpdateStatus(statusToEdit)}
      >
        Update
      </Button>
    </DialogActions>
  </Dialog>
</Container>
  );
};

export default AllUserClaimTable;
