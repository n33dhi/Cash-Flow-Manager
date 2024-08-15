import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, useMediaQuery, IconButton, TableHead, TableRow, Paper, CircularProgress, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Typography, Chip } from '@mui/material';
import CircleIcon from "@mui/icons-material/Circle";
import { useTheme } from "@mui/material/styles";
import api from "../api/axiosConfig";

const NewRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [budgetId, setBudgetId] = useState(null);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusToEdit, setStatusToEdit] = useState("");

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedDetailsRequest, setSelectedDetailsRequest] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get("/cashMaster/newRequest");
      const requestData = response.data;

      const requesterIds = [
        ...new Set(requestData.map((request) => request.requester)),
      ];

      const usernameResponses = await Promise.all(
        requesterIds.map((userId) => api.get(`/cashMaster/user/${userId}`))
      );

      const usernameMap = usernameResponses.reduce((acc, res) => {
        if (res.data && res.data.data && res.data.data.userName) {
          const { _id, userName } = res.data.data;
          acc[_id] = userName;
        }
        return acc;
      }, {});

      const requestsWithUsernames = requestData.map((request) => ({
        ...request,
        requester: usernameMap[request.requester] || "Unknown",
      }));

      const filteredRequests = requestsWithUsernames.filter(
        (request) =>
          request.requester !== "Unknown" && request.status === "Pending"
      );

      const sortedFilteredRequests = filteredRequests.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRequests(sortedFilteredRequests);
      setSortedRequests(sortedFilteredRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  }, []);
  // console.log(requests)

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
    return sortedRequests && sortedRequests.length > 0
      ? sortedRequests.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : [];
  }, [sortedRequests, page, rowsPerPage]);

  const handleStatusClick = (request) => {
    setSelectedRequest(request);
    setStatusToEdit(request.status);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !budgetId) return;
  
    try {
      await api.put("/cashMaster/requests", { id: selectedRequest._id, status: statusToEdit });
  
      if (statusToEdit === 'Accepted') {
        // console.log(budgetId);
        await api.put(`/cashMaster/updateBudget/${budgetId}`);
      }
  
      setRequests((prevRequests) =>
        prevRequests
          .map((req) =>
            req._id === selectedRequest._id ? { ...req, status: statusToEdit } : req
          )
          .filter((req) => req.status === "Pending")
      );
      setSortedRequests(
        (prevRequests) =>
          prevRequests
            .map((req) =>
              req._id === selectedRequest._id
                ? { ...req, status: statusToEdit }
                : req
            )
            .filter((req) => req.status === "Pending")
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
      case "Pending":
        return "primary";
      case "Accepted":
        return "success";
      case "Declined":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{padding:0}}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", backgroundColor: "#fff" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {!isMobile && <TableCell>Claim ID</TableCell>}
                  {!isMobile && <TableCell>Date</TableCell>}
                  <TableCell>Employee</TableCell>
                  <TableCell>Amount</TableCell>
                  {!isMobile && <TableCell>Description</TableCell>}
                  {!isMobile && <TableCell>Approved By</TableCell>}
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        fontSize={{ xs: 16, md: 20 }}
                        fontWeight={700}
                        style={{ marginRight: "8px" }}
                      >
                        Click to Edit
                      </Typography>
                      <IconButton size="small">
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow
                      key={request._id}
                      onClick={() => {
                        setSelectedDetailsRequest(request);
                        setDetailsDialogOpen(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {!isMobile && (
                        <TableCell>{`PW-${request.requestId}`}</TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                      )}
                      <TableCell>{request.requester}</TableCell>
                      <TableCell>{request.amount}</TableCell>
                      {!isMobile && <TableCell>{request.description}</TableCell>}
                      {!isMobile && <TableCell>{request.approvedBy}</TableCell>}
                      <TableCell>
                        <Chip
                          label={request.status}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            "&:hover": {
                              backgroundColor: "#f2f2f2",
                            },
                          }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent row click event
                            handleStatusClick(request);
                          }}
                          color={getStatusChipColor(request.status)}
                          icon={<CircleIcon />}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 3 : 6} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No new records available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedRequests.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}

      {/* Edit Status Modal */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Request Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal" variant="outlined">
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
          <Button onClick={handleCloseModal} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Details Modal */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Claim ID:</strong>{" "}
            {`PW-${selectedDetailsRequest?.requestId}`}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong>{" "}
            {formatDate(selectedDetailsRequest?.createdAt)}
          </Typography>
          <Typography variant="body1">
            <strong>Employee:</strong> {selectedDetailsRequest?.requester}
          </Typography>
          <Typography variant="body1">
            <strong>Amount:</strong> {selectedDetailsRequest?.amount}
          </Typography>
          <Typography variant="body1">
            <strong>Category:</strong> {selectedDetailsRequest?.category}
          </Typography>
          <Typography variant="body1">
            <strong>Approved By:</strong> {selectedDetailsRequest?.approvedBy}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {selectedDetailsRequest?.status}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDetailsDialogOpen(false)}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NewRequestsTable;
