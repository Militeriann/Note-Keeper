import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

// Create Context
const ThemeContext = createContext();

/**
 * useTheme - Custom hook to access theme context
 * @returns {Object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 */
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

/**
 * ThemeProvider - Provider component for theme context
 * Wraps Material-UI ThemeProvider with custom theme logic
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const ThemeProvider = ({ children }) => {
  // Check system preference on first load
  const getSystemPreference = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Persist theme mode to localStorage
  const [mode, setMode] = useLocalStorage(STORAGE_KEYS.THEME, getSystemPreference());

  /**
   * Toggle between light and dark mode
   */
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  /**
   * Set specific theme mode
   * @param {string} newMode - 'light' or 'dark'
   */
  const setThemeMode = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode);
    }
  };

  // Create Material-UI theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#f5ba13' : '#ffd54f',
            light: mode === 'light' ? '#f7c947' : '#ffdf7a',
            dark: mode === 'light' ? '#c79400' : '#c9a300',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#1a1a1a',
            paper: mode === 'light' ? '#ffffff' : '#2d2d2d',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#e0e0e0',
            secondary: mode === 'light' ? '#666666' : '#b0b0b0',
          },
        },
        typography: {
          fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontFamily: '"McLaren", cursive',
          },
          h2: {
            fontFamily: '"McLaren", cursive',
          },
          h3: {
            fontFamily: '"McLaren", cursive',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          // Customize Material-UI components
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0 2px 8px rgba(0,0,0,0.1)' 
                  : '0 2px 8px rgba(0,0,0,0.3)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: mode === 'light' ? '#f5ba13' : '#ffd54f',
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  // Context value
  const value = {
    mode,
    toggleTheme,
    setThemeMode,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};