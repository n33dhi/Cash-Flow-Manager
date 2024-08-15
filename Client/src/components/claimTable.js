import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Paper,
  TablePagination,
  useMediaQuery,
  FormControl,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Chip,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axiosConfig";
import { useParams } from "react-router-dom";

function ClaimTable() {
  const [claims, setClaims] = useState([]);
  const [totalClaims, setTotalClaims] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusMap, setStatusMap] = useState({});
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc"); // New state for sorting direction
  const [sortField, setSortField] = useState("requestId"); // New state for sorting field
  const { userId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get(`/cashMaster/claims/${userId}`);
        if (Array.isArray(response.data)) {
          let sortedClaims = response.data;
          if (sortField) {
            sortedClaims = [...sortedClaims].sort((a, b) => {
              if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
              if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
              return 0;
            });
          }
          setClaims(sortedClaims);
          setTotalClaims(sortedClaims.length);
          const initialStatusMap = sortedClaims.reduce((acc, claim) => {
            acc[claim._id] = claim.status;
            return acc;
          }, {});
          setStatusMap(initialStatusMap);
        } else {
          console.error("Data is not an array:", response.data.claims);
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    fetchClaims();
  }, [userId, page, rowsPerPage, sortField, sortDirection]);

  const handleStatusChange = async () => {
    try {
      await api.put(`/cashMaster/requests`, {
        id: selectedClaimId,
        status: selectedStatus,
      });
      setStatusMap((prev) => ({ ...prev, [selectedClaimId]: selectedStatus }));
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === selectedClaimId
            ? { ...claim, status: selectedStatus }
            : claim
        )
      );
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleOpenDialog = (claimId, currentStatus) => {
    setSelectedClaimId(claimId);
    setSelectedStatus(currentStatus);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
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
    <Box marginTop={3}>
      <Typography fontSize={20} fontWeight={700} marginBottom={3}>Claims</Typography>
      <TableContainer
        component={Paper}
        style={{ overflowX: "auto" }}
        sx={{ backgroundColor: "#fff" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "requestId"}
                  direction={sortField === "requestId" ? sortDirection : "asc"}
                  onClick={() => handleSort("requestId")}
                >
                  Claim ID
                </TableSortLabel>
              </TableCell>
              {!isMobile && <TableCell>Date</TableCell>}
              <TableCell>Description</TableCell>
              {!isMobile && <TableCell>Amount</TableCell>}
              {!isMobile && <TableCell>Category</TableCell>}
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.length > 0 ? (
              claims.map((claim) => (
                <TableRow key={claim.requestId}>
                  <TableCell>PW-{claim.requestId}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>{claim.description}</TableCell>
                  {!isMobile && <TableCell>{claim.amount}</TableCell>}
                  {!isMobile && <TableCell>{claim.category}</TableCell>}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Chip
                        label={statusMap[claim._id]}
                        color={getStatusChipColor(claim.status)}
                        sx={{ flexGrow: 1, height: 28, marginRight: 1 }} // FlexGrow for even space
                      />
                      <IconButton
                        onClick={() =>
                          handleOpenDialog(claim._id, statusMap[claim._id])
                        }
                        sx={{ padding: 0, height: 28 }} // Same height as Chip
                      >
                        {/* <EditIcon /> */}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 7 : 8}
                  style={{ textAlign: "center" }}
                >
                  No records found!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalClaims}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Declined">Declined</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
}

export default ClaimTable;
