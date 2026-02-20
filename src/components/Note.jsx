/**
 * @file Note.jsx
 * @description Individual note card component with edit, delete, pin, and markdown support
 * @author Oyewole Emmanuel
 * @created 2024-01-30
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PushPin as PinIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as CopyIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNotes } from '../context/NotesContext';
import useToast from '../hooks/useToast';
import { formatRelativeTime, truncateText, copyToClipboard } from '../utils/helpers';
import { DEFAULT_TAGS, TOAST_MESSAGES } from '../utils/constants';

/**
 * Note - Individual note card component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.note - Note data object
 * @returns {JSX.Element} Note component
 */
const Note = ({ note }) => {
  const { deleteNote, togglePin, startEditing } = useNotes();
  const toast = useToast();

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  /**
   * Handle menu open
   * @param {Event} event - Click event
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handle menu close
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle edit click
   */
  const handleEdit = () => {
    startEditing(note.id);
    handleMenuClose();
    // Scroll to top to show the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle delete click - open confirmation dialog
   */
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Confirm delete
   */
  const handleDeleteConfirm = () => {
    deleteNote(note.id);
    setDeleteDialogOpen(false);
  };

  /**
   * Cancel delete
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  /**
   * Handle pin toggle
   */
  const handlePin = () => {
    togglePin(note.id);
    handleMenuClose();
  };

  /**
   * Handle copy to clipboard
   */
  const handleCopy = async () => {
    const textToCopy = `${note.title}\n\n${note.content}`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      toast.showSuccess(TOAST_MESSAGES.COPY_SUCCESS);
    } else {
      toast.showError('Failed to copy');
    }
    handleMenuClose();
  };

  /**
   * Handle markdown preview
   */
  const handlePreview = () => {
    setPreviewDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Get tag color
   * @param {string} tagId - Tag ID
   * @returns {string} Tag color
   */
  const getTagColor = (tagId) => {
    const tag = DEFAULT_TAGS.find((t) => t.id === tagId);
    return tag ? tag.color : '#999';
  };

  /**
   * Get tag label
   * @param {string} tagId - Tag ID
   * @returns {string} Tag label
   */
  const getTagLabel = (tagId) => {
    const tag = DEFAULT_TAGS.find((t) => t.id === tagId);
    return tag ? tag.label : tagId;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        layout
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: note.color,
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
          }}
        >
          {/* Pin indicator */}
          {note.pinned && (
            <PinIcon
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontSize: '1.2rem',
                color: 'primary.main',
                transform: 'rotate(45deg)',
              }}
            />
          )}

          <CardContent sx={{ flexGrow: 1, pb: 1 }}>
            {/* Title */}
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 1,
                pr: note.pinned ? 3 : 0,
              }}
            >
              {note.title}
            </Typography>

            {/* Content */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                mb: 1,
              }}
            >
              {truncateText(note.content, 200)}
            </Typography>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                {note.tags.map((tagId) => (
                  <Chip
                    key={tagId}
                    label={getTagLabel(tagId)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: getTagColor(tagId),
                      color: '#fff',
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Timestamp */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}
            >
              {formatRelativeTime(note.updatedAt)}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', pt: 0, px: 2, pb: 1 }}>
            {/* Edit button */}
            <Tooltip title="Edit">
              <IconButton size="small" onClick={handleEdit} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Box>
              {/* Pin button */}
              <Tooltip title={note.pinned ? 'Unpin' : 'Pin'}>
                <IconButton
                  size="small"
                  onClick={handlePin}
                  color={note.pinned ? 'primary' : 'default'}
                >
                  <PinIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* More options menu */}
              <Tooltip title="More options">
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardActions>
        </Card>
      </motion.div>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handlePreview}>
          <PreviewIcon fontSize="small" sx={{ mr: 1 }} />
          Preview Markdown
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <CopyIcon fontSize="small" sx={{ mr: 1 }} />
          Copy to Clipboard
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Note?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Markdown Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{note.title}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ '& h1, & h2, & h3': { mt: 2, mb: 1 }, '& p': { mb: 1 } }}>
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Note;