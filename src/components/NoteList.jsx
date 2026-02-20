import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Add as AddIcon, StickyNote2Outlined as NoteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Note from './Note';
import { useNotes } from '../context/NotesContext';

/**
 * NoteList - Component for displaying notes in a responsive grid
 * 
 * @returns {JSX.Element} NoteList component
 */
const NoteList = () => {
  const { filteredNotes, searchTerm, selectedTag } = useNotes();

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
   * Scroll to top to create new note
   */
  const scrollToCreate = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state when no notes
  if (filteredNotes.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NoteIcon
            sx={{
              fontSize: 120,
              color: 'text.disabled',
              mb: 2,
            }}
          />
          
          {searchTerm || selectedTag !== 'all' ? (
            // No results for search/filter
            <>
              <Typography variant="h5" gutterBottom color="text.secondary">
                No notes found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? `No notes match "${searchTerm}"`
                  : `No notes with the selected tag`}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            // No notes at all - Show personalized greeting
            <>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontSize: '3rem',
                  mb: 1 
                }}
              >
                {emoji}
              </Typography>
              <Typography 
                variant="h4" 
                gutterBottom 
                color="text.primary"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                {greeting}!
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ mb: 1, fontWeight: 400 }}
              >
                {message}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, mt: 2 }}>
                Create your first note to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={scrollToCreate}
                size="large"
              >
                Create Note
              </Button>
            </>
          )}
        </motion.div>
      </Container>
    );
  }

  // Display notes in grid
  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 8 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
          // Masonry-style layout using CSS Grid
          gridAutoRows: 'auto',
        }}
      >
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Note note={note} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Notes count */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </Typography>
      </Box>
    </Container>
  );
};

export default NoteList;