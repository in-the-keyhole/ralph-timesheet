import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a2e',
      light: '#2a2a4e',
    },
    error: {
      main: '#dc3545',
      dark: '#c82333',
    },
    success: {
      main: '#28a745',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#213547',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '1.8rem',
      lineHeight: 1.2,
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.4rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f8f9fa',
          color: '#495057',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8f9fa',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})

export default theme
