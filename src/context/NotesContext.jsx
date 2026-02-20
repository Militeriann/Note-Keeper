import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useToast from '../hooks/useToast';
import { generateId, sortNotes, searchNotes, filterNotesByTag } from '../utils/helpers';
import { STORAGE_KEYS, TOAST_MESSAGES } from '../utils/constants';

// Create Context
const NotesContext = createContext();

/**
 * useNotes - Custom hook to access notes context
 * @returns {Object} Notes context value
 * @throws {Error} If used outside NotesProvider
 */
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};

/**
 * NotesProvider - Provider component for notes context
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const NotesProvider = ({ children }) => {
  // Persist notes to localStorage
  const [notes, setNotes] = useLocalStorage(STORAGE_KEYS.NOTES, []);
  
  // Local state for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [editingNoteId, setEditingNoteId] = useState(null);
  
  // Filtered and sorted notes
  const [filteredNotes, setFilteredNotes] = useState([]);
  
  // Toast notifications
  const toast = useToast();

  /**
   * Apply filters and sorting to notes
   */
  useEffect(() => {
    let result = [...notes];
    
    // Apply search filter
    if (searchTerm) {
      result = searchNotes(result, searchTerm);
    }
    
    // Apply tag filter
    if (selectedTag && selectedTag !== 'all') {
      result = filterNotesByTag(result, selectedTag);
    }
    
    // Sort notes (pinned first, then by date)
    result = sortNotes(result);
    
    setFilteredNotes(result);
  }, [notes, searchTerm, selectedTag]);

  /**
   * Create a new note
   * @param {Object} noteData - Note data (title, content, tags, etc.)
   */
  const createNote = (noteData) => {
    const newNote = {
      id: generateId(),
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags || [],
      color: noteData.color || '#ffffff',
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes((prevNotes) => [...prevNotes, newNote]);
    toast.showSuccess(TOAST_MESSAGES.NOTE_CREATED);
    return newNote;
  };

  /**
   * Update an existing note
   * @param {string} id - Note ID
   * @param {Object} updates - Fields to update
   */
  const updateNote = (id, updates) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
    toast.showSuccess(TOAST_MESSAGES.NOTE_UPDATED);
  };

  /**
   * Delete a note
   * @param {string} id - Note ID to delete
   */
  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    toast.showInfo(TOAST_MESSAGES.NOTE_DELETED);
    
    // Clear editing state if deleting the note being edited
    if (editingNoteId === id) {
      setEditingNoteId(null);
    }
  };

  /**
   * Toggle pin status of a note
   * @param {string} id - Note ID
   */
  const togglePin = (id) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === id ? { ...n, pinned: !n.pinned } : n
        )
      );
      toast.showInfo(
        note.pinned ? TOAST_MESSAGES.NOTE_UNPINNED : TOAST_MESSAGES.NOTE_PINNED
      );
    }
  };

  /**
   * Add a tag to a note
   * @param {string} noteId - Note ID
   * @param {string} tag - Tag to add
   */
  const addTag = (noteId, tag) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId && !note.tags.includes(tag)
          ? { ...note, tags: [...note.tags, tag], updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  /**
   * Remove a tag from a note
   * @param {string} noteId - Note ID
   * @param {string} tag - Tag to remove
   */
  const removeTag = (noteId, tag) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? { ...note, tags: note.tags.filter((t) => t !== tag), updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  /**
   * Change note color
   * @param {string} noteId - Note ID
   * @param {string} color - New color hex code
   */
  const changeNoteColor = (noteId, color) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, color } : note
      )
    );
  };

  /**
   * Clear all notes
   */
  const clearAllNotes = () => {
    if (window.confirm('Are you sure you want to delete all notes? This cannot be undone.')) {
      setNotes([]);
      toast.showInfo('All notes deleted');
    }
  };

  /**
   * Import notes from array
   * @param {Array} importedNotes - Notes to import
   */
  const importNotes = (importedNotes) => {
    setNotes(importedNotes);
    toast.showSuccess(TOAST_MESSAGES.NOTES_IMPORTED);
  };

  /**
   * Start editing a note
   * @param {string} noteId - Note ID to edit
   */
  const startEditing = (noteId) => {
    setEditingNoteId(noteId);
  };

  /**
   * Stop editing
   */
  const stopEditing = () => {
    setEditingNoteId(null);
  };

  // Context value
  const value = {
    // State
    notes,
    filteredNotes,
    searchTerm,
    selectedTag,
    editingNoteId,
    
    // Actions
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    addTag,
    removeTag,
    changeNoteColor,
    clearAllNotes,
    importNotes,
    startEditing,
    stopEditing,
    
    // Setters for filters
    setSearchTerm,
    setSelectedTag,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};