import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, IconButton, TableHead, TableRow, Paper, CircularProgress, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Typography, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/Circle';
import api from '../api/axiosConfig';

const NewRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusToEdit, setStatusToEdit] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/cashMaster/newRequest');
      const requestData = response.data;
  
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
  
      const sortedFilteredRequests = filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      setRequests(sortedFilteredRequests);
      setSortedRequests(sortedFilteredRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const paginatedRequests = useMemo(() => {
    return (sortedRequests && sortedRequests.length > 0)
      ? sortedRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];
  }, [sortedRequests, page, rowsPerPage]);

  const handleStatusClick = (request) => {
    setSelectedRequest(request);
    setStatusToEdit(request.status);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    try {
      await api.put('/cashMaster/requests', {
        id: selectedRequest._id,
        status: statusToEdit
      });
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === selectedRequest._id
            ? { ...req, status: statusToEdit }
            : req
        )
      );
      setSortedRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === selectedRequest._id
            ? { ...req, status: statusToEdit }
            : req
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setEditDialogOpen(false);
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

  return (
    <Container maxWidth="lg">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper} style={{ overflowX: 'auto', backgroundColor: '#fff' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Claim ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography fontSize={{ xs: 16, md: 20 }} fontWeight={700} style={{ marginRight: '8px' }}>
                  Edit
                </Typography>
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </div>
            </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{`PW-${request.requestId}`}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>{request.requester}</TableCell>
                      <TableCell>{request.amount}</TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell>{request.approvedBy}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          onClick={() => handleStatusClick(request)}
                          color={getStatusChipColor(request.status)}
                          icon={<CircleIcon />}
                        //   maxWidth="xs"
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            '&:hover': {
                              backgroundColor: '#f2f2f2'
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                      No new requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={sortedRequests.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </TableContainer>

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
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Declined">Declined</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="contained">Cancel</Button>
              <Button
                variant="contained"
                onClick={handleUpdateStatus}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default NewRequestsTable;
