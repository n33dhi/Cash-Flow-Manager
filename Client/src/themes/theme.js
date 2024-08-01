import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "5px",
          backgroundColor: "#FF3434",
          textTransform: 'none',
          boxShadow: "0px 4px 12px 0px rgba(255, 52, 52, 0.50)",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#FF3434",
          },
        },
      },
    },
  },
});

export default Theme;
