import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  LinearProgress,
} from "@mui/material";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import api from "../api/axiosConfig";

const BudgetCard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [budget, setBudget] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState("");

  const now = new Date();
  const isFirstDayOfMonth = now.getDate() === 1;

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await api.get("/cashMaster/getBudget");
        const { budget: fetchedBudget, remainingAmount } = response.data;
        setBudget(fetchedBudget);
        setRemainingBudget(remainingAmount);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchBudgetData();
  }, []);

  const handleSaveBudget = async () => {
    try {
      await api.post("/cashMaster/setBudget", { amount: newBudget });
      const response = await api.get("/cashMaster/getBudget");
      const { budget: updatedBudget, remainingAmount } = response.data;
      setBudget(updatedBudget);
      setRemainingBudget(remainingAmount);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  const canEditBudget =
    budget === null || remainingBudget < 1000 || isFirstDayOfMonth;

  const progressValue = budget
    ? ((budget - remainingBudget) / budget) * 100
    : 0;

  return (
    <Card
      sx={{
        width: 240,
        height: 100,
        borderRadius: 3,
        padding: 2,
        position: "relative",
        cursor: canEditBudget ? "pointer" : "default",
        background: '#fff'
      }}
      onClick={canEditBudget ? () => setOpenDialog(true) : undefined}
    >
      <CardContent sx={{ padding: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography fontSize={16} fontWeight={700} color={"gray"}>
                Budget Utilization
              </Typography>
              <Typography fontWeight={700} color={"#FF3434"} fontSize={20}>
                {budget !== null ? `₹${budget.toLocaleString()}` : "Set Budget"}
              </Typography>
            </Box>
            <Box>
              <Button
                sx={{
                  width: 41,
                  height: 41,
                  borderRadius: "10px",
                  backgroundColor: canEditBudget
                    ? "rgba(255, 52, 52, 0.20)"
                    : "rgba(0, 0, 0, 0.12)",
                  boxShadow: canEditBudget
                    ? "0px 4px 12px 0px rgba(255, 52, 52, 0.50)"
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 0,
                  padding: 0,
                  "&:hover": {
                    backgroundColor: canEditBudget
                      ? "rgba(255, 52, 52, 0.20)"
                      : "rgba(0, 0, 0, 0.12)",
                    boxShadow: canEditBudget
                      ? "0px 4px 12px 0px rgba(255, 52, 52, 0.50)"
                      : "none",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDialog(true);
                }}
                disabled={!canEditBudget}
              >
                <WalletRoundedIcon
                  sx={{
                    fontSize: 20,
                    color: canEditBudget ? "#FF3434" : "rgba(0, 0, 0, 0.26)",
                    "&:hover": {
                      color: canEditBudget ? "#FF3434" : "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                />
              </Button>
            </Box>
          </Box>
          <Box marginTop={1}>
            {budget !== null && (
              <Typography
                variant="body1"
                fontSize={12}
                sx={{ color: remainingBudget < 1000 ? "red" : "inherit" }}
              >
                Remaining:{" "}
                <Typography
                  marginLeft={1}
                  fontWeight={700}
                  component="span"
                  color={"#FF3434"}
                >
                  {`₹${
                    remainingBudget !== null
                      ? remainingBudget.toLocaleString()
                      : "..."
                  }`}
                </Typography>
              </Typography>
            )}
            <Box sx={{ marginTop: "2px", flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(90deg, green, orange, red)`,
                    boxShadow: `0px 0px 8px rgba(0, 128, 0, 0.5)`,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>

      <Dialog
        open={openDialog}
        onClose={(e) => {
          e.stopPropagation();
          setOpenDialog(false);
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Set Budget</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Budget Amount"
            variant="outlined"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            sx={{ marginTop: 2 }}
            type="number"
            onClick={(e) => e.stopPropagation()}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveBudget();
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BudgetCard;
