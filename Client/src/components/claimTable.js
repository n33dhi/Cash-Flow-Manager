import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
  TableSortLabel,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axiosConfig";
import { useParams } from "react-router-dom";

function ClaimTable() {
  const [claims, setClaims] = useState([]);
  const [totalClaims, setTotalClaims] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState("desc"); // Default to descending order
  const [sortField, setSortField] = useState("createdAt"); // Default sort by createdAt (date)
  const { userId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get(`/cashMaster/claims/${userId}`);
        if (Array.isArray(response.data)) {
          let sortedClaims = [...response.data].sort((a, b) => {
            // Default sorting by createdAt
            if (sortField === "createdAt") {
              return sortDirection === "asc"
                ? new Date(a[sortField]) - new Date(b[sortField])
                : new Date(b[sortField]) - new Date(a[sortField]);
            }
            // Sorting by requestId if sortField is set to "requestId"
            if (sortField === "requestId") {
              if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
              if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
          });
          setClaims(sortedClaims);
          setTotalClaims(sortedClaims.length);
        } else {
          console.error("Data is not an array:", response.data.claims);
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    fetchClaims();
  }, [userId, page, rowsPerPage, sortField, sortDirection]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
      <Typography fontSize={20} fontWeight={700} marginBottom={3}>
        Claims
      </Typography>
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
                  direction={sortDirection}
                  onClick={() => handleSort("requestId")}
                >
                  Claim ID
                </TableSortLabel>
              </TableCell>
              {!isMobile && (
                <TableCell>
                    Date
                </TableCell>
              )}
              <TableCell>Description</TableCell>
              {!isMobile && <TableCell>Amount</TableCell>}
              {!isMobile && <TableCell>Category</TableCell>}
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.length > 0 ? (
              claims.map((claim) => (
                <TableRow key={claim.requestId} sx={{ cursor: "pointer" }}>
                  <TableCell>PW-{claim.requestId}</TableCell>
                  {!isMobile && <TableCell>{formatDate(claim.createdAt)}</TableCell>}
                  <TableCell>{claim.description}</TableCell>
                  {!isMobile && <TableCell>{claim.amount}</TableCell>}
                  {!isMobile && <TableCell>{claim.category}</TableCell>}
                  <TableCell>
                    <Chip
                      label={claim.status}
                      color={getStatusChipColor(claim.status)}
                      sx={{ height: 28 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 6 : 7}
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
    </Box>
  );
}

export default ClaimTable;
