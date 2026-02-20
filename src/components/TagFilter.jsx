import React from 'react';
import { Box, Chip, Container, Paper, Typography } from '@mui/material';
import { LocalOffer as TagIcon } from '@mui/icons-material';
import { useNotes } from '../context/NotesContext';
import { DEFAULT_TAGS } from '../utils/constants';

/**
 * TagFilter - Component for filtering notes by tags
 * 
 * @returns {JSX.Element} TagFilter component
 */
const TagFilter = () => {
  const { notes, selectedTag, setSelectedTag } = useNotes();

  /**
   * Count notes for each tag
   * @param {string} tagId - Tag ID to count
   * @returns {number} Number of notes with this tag
   */
  const getTagCount = (tagId) => {
    if (tagId === 'all') {
      return notes.length;
    }
    return notes.filter((note) => note.tags && note.tags.includes(tagId)).length;
  };

  /**
   * Handle tag selection
   * @param {string} tagId - Tag ID to select
   */
  const handleTagClick = (tagId) => {
    setSelectedTag(tagId);
  };

  // Don't show if no notes
  if (notes.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <TagIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Filter by tag
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* All notes chip */}
          <Chip
            label={`All (${getTagCount('all')})`}
            onClick={() => handleTagClick('all')}
            sx={{
              backgroundColor: selectedTag === 'all' ? 'primary.main' : 'transparent',
              color: selectedTag === 'all' ? 'white' : 'text.primary',
              border: selectedTag === 'all' ? 'none' : '1px solid',
              borderColor: 'divider',
              fontWeight: selectedTag === 'all' ? 600 : 400,
              '&:hover': {
                backgroundColor: selectedTag === 'all' ? 'primary.dark' : 'action.hover',
              },
            }}
          />

          {/* Individual tag chips */}
          {DEFAULT_TAGS.map((tag) => {
            const count = getTagCount(tag.id);
            
            // Don't show tags with 0 notes
            if (count === 0) return null;

            const isSelected = selectedTag === tag.id;

            return (
              <Chip
                key={tag.id}
                label={`${tag.label} (${count})`}
                onClick={() => handleTagClick(tag.id)}
                sx={{
                  backgroundColor: isSelected ? tag.color : 'transparent',
                  color: isSelected ? 'white' : 'text.primary',
                  border: `1px solid ${tag.color}`,
                  fontWeight: isSelected ? 600 : 400,
                  '&:hover': {
                    backgroundColor: isSelected ? tag.color : 'action.hover',
                    opacity: isSelected ? 0.9 : 1,
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Active filter indicator */}
        {selectedTag && selectedTag !== 'all' && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Filtering by:{' '}
              <strong>
                {DEFAULT_TAGS.find((t) => t.id === selectedTag)?.label}
              </strong>
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TagFilter;