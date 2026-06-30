import { createTheme } from "@mui/material/styles";

const theme = createTheme({

  palette: {

    mode: "light",

    primary: {
      main: "#1976D2",
    },

    secondary: {
      main: "#26A69A",
    },

    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },

    success: {
      main: "#2E7D32",
    },

    warning: {
      main: "#ED6C02",
    },

    error: {
      main: "#D32F2F",
    },

    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    }

  },

  typography: {

    fontFamily: "'Poppins', sans-serif",

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 600,
    },

    h4: {
      fontWeight: 600,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
    }

  },

  shape: {
    borderRadius: 16,
  },

  components: {

    MuiPaper: {

      styleOverrides: {

        root: {

          borderRadius: 20,

          boxShadow:
            "0px 8px 25px rgba(0,0,0,0.08)"

        }

      }

    },

    MuiCard: {

      styleOverrides: {

        root: {

          borderRadius: 20,

          boxShadow:
            "0px 8px 25px rgba(0,0,0,0.08)"

        }

      }

    },

    MuiButton: {

      styleOverrides: {

        root: {

          borderRadius: 12,

          padding: "10px 24px",

          fontWeight: 600

        }

      }

    },

    MuiTextField: {

      styleOverrides: {

        root: {

          "& .MuiOutlinedInput-root": {

            borderRadius: 12

          }

        }

      }

    }

  }

});

export default theme;