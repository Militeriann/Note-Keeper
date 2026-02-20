import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../context/ThemeContext';
import { NotesProvider } from '../context/NotesContext';
import Header from './Header';
import CreateArea from './CreateArea';
import TagFilter from './TagFilter';
import NoteList from './NoteList';
import Footer from './Footer';

/**
 * App - Main application component
 * 
 * Structure:
 * - ThemeProvider: Manages dark/light mode
 * - NotesProvider: Manages all notes state and operations
 * - Header: App bar with search and actions
 * - CreateArea: Form for creating/editing notes
 * - TagFilter: Filter notes by tags
 * - NoteList: Display all notes in grid
 * - Footer: Stats and copyright
 * - Toaster: Toast notifications
 * 
 * @returns {JSX.Element} App component
 */
const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <NotesProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          {/* Header with search and theme toggle */}
          <Header />

          {/* Main content area */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            {/* Note creation/editing form */}
            <CreateArea />

            {/* Tag filter chips */}
            <TagFilter />

            {/* Grid of notes */}
            <NoteList />
          </Box>

          {/* Footer with stats */}
          <Footer />

          {/* Toast notifications */}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#F44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Box>
      </NotesProvider>
    </ThemeProvider>
  );
};

export default App;