import { format, formatDistanceToNow } from 'date-fns';

/**
 * Generate a unique ID for notes
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format a date to a readable string
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy - HH:mm');
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Search notes by title or content
 * @param {Array} notes - Array of note objects
 * @param {string} searchTerm - Search query
 * @returns {Array} Filtered notes
 */
export const searchNotes = (notes, searchTerm) => {
  if (!searchTerm.trim()) return notes;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerSearchTerm) ||
      note.content.toLowerCase().includes(lowerSearchTerm) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
  );
};

/**
 * Filter notes by tag
 * @param {Array} notes - Array of note objects
 * @param {string} tagFilter - Tag to filter by
 * @returns {Array} Filtered notes
 */
export const filterNotesByTag = (notes, tagFilter) => {
  if (!tagFilter || tagFilter === 'all') return notes;
  return notes.filter((note) => note.tags && note.tags.includes(tagFilter));
};

/**
 * Sort notes (pinned notes first, then by date)
 * @param {Array} notes - Array of note objects
 * @returns {Array} Sorted notes
 */
export const sortNotes = (notes) => {
  return [...notes].sort((a, b) => {
    // Pinned notes first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then by last updated date (newest first)
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
};

/**
 * Export notes to JSON file
 * @param {Array} notes - Notes to export
 * @param {string} filename - Name of the file to download
 */
export const exportNotesToJSON = (notes, filename = 'notes-backup.json') => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import notes from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Array>} Promise resolving to array of notes
 */
export const importNotesFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const notes = JSON.parse(e.target.result);
        if (Array.isArray(notes)) {
          resolve(notes);
        } else {
          reject(new Error('Invalid notes format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get a random color from predefined colors
 * @param {Array} colors - Array of color hex codes
 * @returns {string} Random color
 */
export const getRandomColor = (colors) => {
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Validate note data
 * @param {Object} note - Note object to validate
 * @returns {Object} Validation result { valid: boolean, errors: Array }
 */
export const validateNote = (note) => {
  const errors = [];
  
  if (!note.title || note.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!note.content || note.content.trim() === '') {
    errors.push('Content is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate character count with visual feedback
 * @param {string} text - Text to count
 * @param {number} limit - Character limit
 * @returns {Object} { count, remaining, percentage, isNearLimit }
 */
export const getCharacterCount = (text, limit) => {
  const count = text ? text.length : 0;
  const remaining = limit - count;
  const percentage = (count / limit) * 100;
  const isNearLimit = percentage >= 80;
  
  return {
    count,
    remaining,
    percentage,
    isNearLimit,
  };
};