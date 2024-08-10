import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosConfig';
import {
  Table, Container, CircularProgress, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography, TextField, TablePagination, useTheme,
  useMediaQuery, IconButton, InputAdornment
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cashMaster/users');
      const usersData = response.data.data;
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
    navigate(`/cashMaster/user/${userId}`);
  };

  const paginatedUsers = useMemo(() => {
    return users.filter(user => !roleFilter || user.role === roleFilter)
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [users, page, rowsPerPage, roleFilter]);

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

  const handleRoleFilter = (role) => {
    setRoleFilter(prevRole => (prevRole === role ? '' : role));
  };

  const role = useSelector((state) => state.auth.id);
  const currentUserId = role; 

  const roleChips = {
    admin: {
      label: `Admin (${users.filter(user => user.role === 'admin').length})`,
      color: 'secondary',
    },
    employee: {
      label: `Employee (${users.filter(user => user.role === 'employee').length})`,
      color: 'user',
    }
  };

  const MemoizedTable = useMemo(() => (
    <TableContainer component={Paper} style={{ overflowX: 'auto', backgroundColor: '#fff' }}>
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
              <TableRow
                key={user._id}
                onClick={() => handleRowClick(user)}
                selected={user._id === currentUserId}
              >
                <TableCell>{`PWU-${user.userId}`}</TableCell>
                <TableCell>{user.userName}</TableCell>
                { !isMobile && <TableCell>{user.email}</TableCell> }
                { !isMobile && <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleChipColor(user.role)}
                    icon={<CircleIcon />}
                    style={{ cursor: 'default', maxWidth: '120px' }}
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
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '30px',
        gap: isMobile ? '14px' : '0',
      }}>
        <TextField
          label="Search by User ID"
          variant="outlined"
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
        <Typography marginRight={2} fontWeight={700}>Sort by</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {Object.keys(roleChips).map((role) => (
            <Chip
              key={role}
              label={roleChips[role].label}
              color={getRoleChipColor(role)}
              onClick={() => handleRoleFilter(role)}
              sx={{ cursor: 'pointer', backgroundColor: 'white', '&:hover': {
                backgroundColor: 'white', // Prevent hover effect
                boxShadow: getRoleChipColor(role), // Remove any shadow on hover
              }, border: roleFilter === role ? `2px solid ${theme.palette[roleChips[role].color].main}` : 'none',}}
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

      {selectedUser && (
        <Dialog open={true} onClose={handleCloseModal}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>User ID:</strong> {`PWU-${selectedUser.userId}`}</Typography>
            <Typography variant="body1"><strong>Username:</strong> {selectedUser.username}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {selectedUser.email}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {selectedUser.role}</Typography>
            {/* <Typography variant="body1"><strong>Total Amount Claimed:</strong> {selectedUser.totalAmount}</Typography> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default UserTable;
