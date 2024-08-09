import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosConfig';
import { Table, Container, CircularProgress, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, TablePagination, useTheme, useMediaQuery, IconButton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { useNavigate } from 'react-router-dom'; 

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cashMaster/users');
      const usersData = response.data.data;
      // console.log(usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchQuery) {
      setUsers(prevUsers =>
        prevUsers.filter(user => `PW-${user.userId}`.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      fetchData();
    }
  }, [searchQuery, fetchData]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleMoreDetails = (userId) => {
    console.log(userId);
    navigate(`/cashMaster/user/${userId}`); 
  };

  const paginatedUsers = useMemo(() => {
    return users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [users, page, rowsPerPage]);

  // console.log(users.email)
  const getRoleChipColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'employee':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const MemoizedTable = useMemo(() => (
    <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Username</TableCell>
            {!isMobile && <TableCell>Email</TableCell>}
            {!isMobile && <TableCell>Role</TableCell>}
            {!isMobile && <TableCell>Requests</TableCell>}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <TableRow key={user._id} onClick={() => handleRowClick(user)}>
                <TableCell>{`PW-${user.userId}`}</TableCell>
                <TableCell>{user.userName}</TableCell>
                { !isMobile && <TableCell>{user.email}</TableCell> }
                { !isMobile && <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleChipColor(user.role)}
                    icon={<CircleIcon />}
                    style={{ cursor: 'default', maxWidth:'120px' }}
                  />
                </TableCell> }
                {!isMobile && <TableCell>{user.requests ? user.requests.length : 0}</TableCell>}
                <TableCell>
                  <IconButton onClick={() => handleMoreDetails(user._id)} aria-label="more details">
                    <MoreVertIcon />
                  </IconButton>
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </TableContainer>
  ), [paginatedUsers, handleRowClick, page, isMobile, rowsPerPage]);

  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: isMobile ? 'flex-start' : 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '30px', gap: isMobile ? '14px' : '0' }}>
        <TextField
          label="Search by User ID"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '250px', borderRadius: '8px', marginRight: isMobile ? '0' : 'auto', }}
        />
      </div>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        MemoizedTable
      )}

      {selectedUser && (
        <Dialog open={true} onClose={handleCloseModal}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>User ID:</strong> {`PW-${selectedUser.userId}`}</Typography>
            <Typography variant="body1"><strong>Username:</strong> {selectedUser.username}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {selectedUser.email}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {selectedUser.role}</Typography>
            <Typography variant="body1"><strong>Total Amount Claimed:</strong> {selectedUser.totalAmount}</Typography>
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

export default UserTable;
