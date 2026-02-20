/**
 * @file Footer.jsx
 * @description App footer with statistics and copyright information
 * @author Oyewole Emmanuel
 * @created 2024-01-30
 */

import React from 'react';
import { Box, Typography, Container, Divider, Link } from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import { useNotes } from '../context/NotesContext';
import { formatRelativeTime } from '../utils/helpers';

/**
 * Footer - App footer component
 * 
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
  const { notes } = useNotes();
  const currentYear = new Date().getFullYear();

  /**
   * Get last updated note
   * @returns {Object|null} Most recently updated note
   */
  const getLastUpdatedNote = () => {
    if (notes.length === 0) return null;
    return notes.reduce((latest, note) =>
      new Date(note.updatedAt) > new Date(latest.updatedAt) ? note : latest
    );
  };

  const lastUpdated = getLastUpdatedNote();

  /**
   * Get pinned notes count
   * @returns {number} Number of pinned notes
   */
  const getPinnedCount = () => {
    return notes.filter((note) => note.pinned).length;
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Stats Row */}
        {notes.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>{notes.length}</strong> {notes.length === 1 ? 'note' : 'notes'}
            </Typography>

            <Divider orientation="vertical" flexItem />

            {getPinnedCount() > 0 && (
              <>
                <Typography variant="body2" color="text.secondary">
                  <strong>{getPinnedCount()}</strong> pinned
                </Typography>
                <Divider orientation="vertical" flexItem />
              </>
            )}

            {lastUpdated && (
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatRelativeTime(lastUpdated.updatedAt)}
              </Typography>
            )}
          </Box>
        )}

        {/* Copyright Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Keeper.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with
          </Typography>
          <FavoriteIcon sx={{ fontSize: '1rem', color: 'error.main' }} />
          <Typography variant="body2" color="text.secondary">
            by{' '}
            <Link
              href="https://github.com/militeriann"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
            >
              Oyewole Emmanuel
            </Link>
          </Typography>
        </Box>

        {/* Tech Stack */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.disabled">
            Built with React • Material-UI • Context API • LocalStorage
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;