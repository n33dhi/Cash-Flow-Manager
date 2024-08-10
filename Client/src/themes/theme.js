import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#32393d",
    },
    secondary: {
      main: "#ff3434", 
    },
    background: {
      paper: "#f2f2f2",
    },
    text: {
      primary: "#32393d",
    },
    user: {
      main: '#9747FF',
    },
    user2: {
      main: '#FF9243'
    }
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
          backgroundColor: "#f9fafb", 
          fontSize: '14px',
          fontWeight: '700',
          '@media (min-width:600px)': {
            fontSize: '18px',
          },
        },
        body: {
          fontSize: '12px',
          fontWeight: '500',
          '@media (min-width:600px)': { 
            fontSize: '16px',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "12px", 
          overflow: "hidden", 
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f0f0f0", 
          },
        },
      },
    },
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
          },
        }
      },
    },
  },
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
