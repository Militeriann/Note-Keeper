/**
 * @file CreateArea.jsx
 * @description Enhanced note creation/editing form with character counter, tags, color picker
 * @author Oyewole Emmanuel
 * @created 2024-01-30
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Collapse,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Label as LabelIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useNotes } from '../context/NotesContext';
import { CHAR_LIMITS, DEFAULT_TAGS, NOTE_COLORS } from '../utils/constants';
import { getCharacterCount } from '../utils/helpers';

/**
 * CreateArea - Form component for creating and editing notes
 * 
 * @returns {JSX.Element} CreateArea component
 */
const CreateArea = () => {
  const { createNote, updateNote, editingNoteId, notes, stopEditing } = useNotes();

  // Form state
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: [],
    color: '#ffffff',
  });

  // UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Load note data if editing
  useEffect(() => {
    if (editingNoteId) {
      const noteToEdit = notes.find((n) => n.id === editingNoteId);
      if (noteToEdit) {
        setNote({
          title: noteToEdit.title,
          content: noteToEdit.content,
          tags: noteToEdit.tags || [],
          color: noteToEdit.color || '#ffffff',
        });
        setSelectedTags(noteToEdit.tags || []);
        setIsExpanded(true);
      }
    } else {
      // Reset form when not editing
      handleReset();
    }
  }, [editingNoteId, notes]);

  /**
   * Handle input changes
   * @param {Event} event - Input change event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Apply character limits
    if (name === 'title' && value.length > CHAR_LIMITS.TITLE) return;
    if (name === 'content' && value.length > CHAR_LIMITS.CONTENT) return;

    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate
    if (!note.title.trim() || !note.content.trim()) {
      return;
    }

    if (editingNoteId) {
      // Update existing note
      updateNote(editingNoteId, {
        title: note.title,
        content: note.content,
        tags: selectedTags,
        color: note.color,
      });
      stopEditing();
    } else {
      // Create new note
      createNote({
        ...note,
        tags: selectedTags,
      });
    }

    handleReset();
  };

  /**
   * Reset form to initial state
   */
  const handleReset = () => {
    setNote({
      title: '',
      content: '',
      tags: [],
      color: '#ffffff',
    });
    setSelectedTags([]);
    setIsExpanded(false);
  };

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    stopEditing();
    handleReset();
  };

  /**
   * Toggle tag selection
   * @param {string} tagId - Tag ID to toggle
   */
  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  /**
   * Handle color change
   * @param {string} color - Selected color
   */
  const handleColorChange = (color) => {
    setNote((prev) => ({ ...prev, color }));
  };

  /**
   * Expand form on focus
   */
  const handleExpand = () => {
    setIsExpanded(true);
  };

  // Character count info
  const titleCount = getCharacterCount(note.title, CHAR_LIMITS.TITLE);
  const contentCount = getCharacterCount(note.content, CHAR_LIMITS.CONTENT);

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 600,
        margin: '30px auto 20px',
        padding: 2,
        backgroundColor: note.color,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Title with character counter */}
      <Collapse in={isExpanded}>
        <Box sx={{ mb: 2 }}>
          <TextField
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '1.3rem', fontWeight: 500 },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={titleCount.percentage}
              sx={{
                flexGrow: 1,
                mr: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: titleCount.isNearLimit ? '#f44336' : '#4caf50',
                },
              }}
            />
            <Typography
              variant="caption"
              color={titleCount.isNearLimit ? 'error' : 'text.secondary'}
            >
              {titleCount.remaining}
            </Typography>
          </Box>
        </Box>
      </Collapse>

      {/* Content with character counter */}
      <TextField
        name="content"
        placeholder={isExpanded ? 'Take a note...' : 'Click to create a note...'}
        value={note.content}
        onChange={handleChange}
        onFocus={handleExpand}
        fullWidth
        multiline
        rows={isExpanded ? 4 : 1}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { fontSize: '1rem' },
        }}
      />

      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={contentCount.percentage}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: contentCount.isNearLimit ? '#f44336' : '#4caf50',
              },
            }}
          />
          <Typography
            variant="caption"
            color={contentCount.isNearLimit ? 'error' : 'text.secondary'}
            sx={{ float: 'right', mt: 0.5 }}
          >
            {contentCount.count} / {CHAR_LIMITS.CONTENT}
          </Typography>
        </Box>
      </Collapse>

      {/* Tags and Color Picker */}
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 2 }}>
          {/* Tags */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LabelIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Tags
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {DEFAULT_TAGS.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  onClick={() => toggleTag(tag.id)}
                  size="small"
                  sx={{
                    backgroundColor: selectedTags.includes(tag.id)
                      ? tag.color
                      : 'transparent',
                    color: selectedTags.includes(tag.id) ? '#fff' : 'text.primary',
                    border: `1px solid ${tag.color}`,
                    '&:hover': {
                      backgroundColor: tag.color,
                      color: '#fff',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Color Picker */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PaletteIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Color
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {NOTE_COLORS.map((color) => (
                <Tooltip key={color} title={color}>
                  <IconButton
                    size="small"
                    onClick={() => handleColorChange(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: color,
                      border: note.color === color ? '3px solid #1976d2' : '1px solid #ddd',
                      '&:hover': {
                        backgroundColor: color,
                        opacity: 0.8,
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {editingNoteId && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelEdit}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!note.title.trim() || !note.content.trim()}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {editingNoteId ? 'Update' : 'Add Note'}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CreateArea;