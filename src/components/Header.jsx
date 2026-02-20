import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  alpha,
  styled,
  Tooltip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Search as SearchIcon,
  FileDownload,
  FileUpload,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { useNotes } from '../context/NotesContext';
import useToast from '../hooks/useToast';
import { exportNotesToJSON, importNotesFromJSON } from '../utils/helpers';
import { TOAST_MESSAGES } from '../utils/constants';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

/**
 * Header - App header component with search and theme toggle
 * 
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { notes, searchTerm, setSearchTerm, importNotes } = useNotes();
  const toast = useToast();

  /**
   * Get greeting based on current time
   * @returns {Object} Object with emoji and greeting message
   */
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        emoji: '🌅',
        greeting: 'Good morning',
        message: 'Start your day organized!'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        emoji: '☀️',
        greeting: 'Good afternoon',
        message: 'Keep up the momentum!'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        emoji: '🌆',
        greeting: 'Good evening',
        message: 'Wrap up your day!'
      };
    } else {
      return {
        emoji: '🌙',
        greeting: 'Good night',
        message: 'Late night thoughts?'
      };
    }
  };

  const { emoji, greeting, message } = getTimeBasedGreeting();

  /**
   * Handle search input change
   * @param {Event} event - Input change event
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Handle export notes
   */
  const handleExport = () => {
    if (notes.length === 0) {
      toast.showWarning('No notes to export');
      return;
    }
    
    try {
      exportNotesToJSON(notes, `keeper-notes-${new Date().toISOString().split('T')[0]}.json`);
      toast.showSuccess(TOAST_MESSAGES.NOTES_EXPORTED);
    } catch (error) {
      toast.showError('Failed to export notes');
    }
  };

  /**
   * Handle import notes
   */
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const importedNotes = await importNotesFromJSON(file);
      
      if (importedNotes.length === 0) {
        toast.showWarning('No notes found in file');
        return;
      }

      // Ask if user wants to replace or merge
      const replace = window.confirm(
        `Found ${importedNotes.length} notes. Replace existing notes? (Cancel to merge)`
      );

      if (replace) {
        importNotes(importedNotes);
      } else {
        // Merge with existing notes
        importNotes([...notes, ...importedNotes]);
      }
    } catch (error) {
      toast.showError('Failed to import notes. Please check the file format.');
    }

    // Clear file input
    event.target.value = '';
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {/* Logo/Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            flexGrow: { xs: 1, sm: 0 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 200,
            mr: 3,
          }}
        >
          📝 Keeper
        </Typography>

        {/* Time-based Greeting - Desktop Only */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            mr: 3,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(244, 196, 48, 0.1)',
          }}
        >
          <Typography sx={{ fontSize: '1.5rem' }}>{emoji}</Typography>
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: '0.9rem',
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              {greeting}!
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                lineHeight: 1,
              }}
            >
              {message}
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <Search sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1, maxWidth: 500 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search notes..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Search>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Export Button */}
          <Tooltip title="Export notes">
            <IconButton color="inherit" onClick={handleExport}>
              <FileDownload />
            </IconButton>
          </Tooltip>

          {/* Import Button */}
          <Tooltip title="Import notes">
            <IconButton color="inherit" component="label">
              <FileUpload />
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImport}
              />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Mobile Search Bar */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, px: 2, pb: 2 }}>
        <Search sx={{ width: '100%' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
          />
        </Search>
      </Box>
    </AppBar>
  );
};

export default Header;