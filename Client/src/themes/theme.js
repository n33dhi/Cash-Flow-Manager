import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#32393d", // Replace with your actual primary color
    },
    secondary: {
      main: "#ff3434", 
    },
    background: {
      paper: "#f2f2f2", // Background for card, if needed
    },
    text: {
      primary: "#32393d",
    },
  },
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
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '16px',
          fontWeight: '700',
          '@media (min-width:600px)': {
            fontSize: '20px',
          },
        },
        body: {
          fontSize: '14px',
          fontWeight: '500',
          '@media (min-width:600px)': { 
            fontSize: '16px',
        },
      },
    }},
    MuiChip: {
      styleOverrides: {
        root: {
          display: 'flex',
          padding: '0px 5px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3px',
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: '700',
          '& .MuiChip-icon': {
            fontSize: '7px',
          },
        },
        colorPrimary: {
          backgroundColor: 'rgba(255, 146, 67, 0.20)',
          color: '#FF9243',
          '& .MuiChip-icon': {
            color: '#FF9243',
          },
        },
        colorSuccess: {
          backgroundColor: 'rgba(71, 255, 67, 0.20)',
          color: '#47FF43',
          '& .MuiChip-icon': {
            color: '#47FF43',
          },
        },
        colorError: {
          backgroundColor: 'rgba(255, 52, 52, 0.20)',
          color: '#FF3434',
          '& .MuiChip-icon': {
            color: '#FF3434',
          },
        },
        colorSecondary: {
          backgroundColor: 'rgba(151, 71, 255, 0.20)',
          color: '#9747FF',
          '& .MuiChip-icon': {
            color: '#9747FF',
          }
        }
      },
    },
  },
  // Add responsive container styles
  spacing: 8, 
  breakpoints: {
    values: {
      xs: 0,  
      sm: 600, 
      md: 900, 
      lg: 1200,
      xl: 1536 
    },
  },
});

export default Theme;
