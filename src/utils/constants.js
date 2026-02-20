/**
 * Maximum character limits for note fields
 */
export const CHAR_LIMITS = {
  TITLE: 50,
  CONTENT: 1000,
};

/**
 * Predefined tags/categories for notes
 */
export const DEFAULT_TAGS = [
  { id: 'personal', label: 'Personal', color: '#2196F3' },
  { id: 'work', label: 'Work', color: '#4CAF50' },
  { id: 'ideas', label: 'Ideas', color: '#FF9800' },
  { id: 'todo', label: 'To-Do', color: '#F44336' },
  { id: 'important', label: 'Important', color: '#9C27B0' },
];

/**
 * Predefined colors for note cards
 */
export const NOTE_COLORS = [
  '#ffffff', // White
  '#ffebee', // Light Red
  '#e3f2fd', // Light Blue
  '#e8f5e9', // Light Green
  '#fff3e0', // Light Orange
  '#f3e5f5', // Light Purple
  '#fce4ec', // Light Pink
  '#e0f2f1', // Light Teal
];

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  NOTES: 'notekeeper_notes',
  THEME: 'notekeeper_theme',
  LAST_SAVE: 'notekeeper_last_save',
};

/**
 * Toast notification messages
 */
export const TOAST_MESSAGES = {
  NOTE_CREATED: '✅ Note created successfully!',
  NOTE_UPDATED: '✅ Note updated!',
  NOTE_DELETED: '🗑️ Note deleted',
  NOTE_PINNED: '📌 Note pinned',
  NOTE_UNPINNED: '📌 Note unpinned',
  NOTES_EXPORTED: '📥 Notes exported successfully!',
  NOTES_IMPORTED: '📤 Notes imported successfully!',
  COPY_SUCCESS: '📋 Copied to clipboard!',
  ERROR_GENERIC: '❌ Something went wrong',
  CHAR_LIMIT_REACHED: '⚠️ Character limit reached',
};

/**
 * Animation variants for Framer Motion
 */
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideIn: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
};

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  NEW_NOTE: 'ctrl+n',
  SAVE_NOTE: 'ctrl+s',
  SEARCH: 'ctrl+f',
  TOGGLE_THEME: 'ctrl+d',
};

/**
 * Debounce delay for search (in milliseconds)
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

/**
 * Grid breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 600,
  tablet: 960,
  desktop: 1280,
};