'use client'
import { colors, createTheme, responsiveFontSizes } from '@mui/material';

// const darkSlateGrey = "rgb(38, 100, 100)"
// const darkSeaGreen = 'rgb(143,188,143)'
// Step 1: Base theme to access breakpoints
const baseTheme = createTheme({
  spacing: 8,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.teal[600], // Professional blue

    },
    secondary: {
      main: '#ff4081', // Modern pink accent
      dark: '#c60055',
      light: '#ff79b0',
    },
    background: {
      default: '#1B262C',
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 64,
    },
  },
  shape: {
    borderRadius: 8, // Material Design default
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold'
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
        disableGutters: true
      },
      styleOverrides: {
        root: {
          // padding: 8
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(1, 19, 29, 0.81)",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)"
        }
      }
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: 8,
          boxShadow: `
            0px 4px 6px -1px rgba(0, 0, 0, 0.1),
            0px 2px 4px -1px rgba(0, 0, 0, 0.06),
            0px 10px 20px -10px rgba(0, 0, 0, 0.2)
          `,
          // transform: "translateY(0px) scale(1)",
          transition: "transform 0.3s  ease-in-out, box-shadow 0.3s ease-in-out",
          position: "relative",
          zIndex: 1,
          "&:hover": {
            transform: "translateY(-5px) scale(1.02)",
            boxShadow: `
              0px 8px 12px -2px rgba(0, 247, 255, 0.4),
              0px 4px 8px -2px rgba(0, 247, 255, 0.3),
              0px 20px 30px -10px rgba(0, 204, 255, 0.3)
            `,
          },
        }
      }
    }
  },
});

// Step 2: Use baseTheme's breakpoints in the real theme
let theme = createTheme(baseTheme, {
  typography: {
    button: {
      textTransform: 'none', // Android-like buttons
    },
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      // fontWeight: 700,
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      // fontWeight: 600,
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2.25rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '1rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.1rem',
      },
    },
  }

});

// Optional: Make typography responsive
theme = responsiveFontSizes(theme);

export default theme;
