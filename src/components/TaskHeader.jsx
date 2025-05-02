import { useState, useEffect, useRef } from 'react';
import './TaskHeader.css';

/**
 * TaskHeader component - Provides the main header area with app title, 
 * search functionality, and view switching options
 */
const TaskHeader = ({ 
  title, 
  stats, 
  viewMode, 
  setViewMode, 
  searchTerm, 
  setSearchTerm 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('taskTrackerTheme');
    return savedTheme || 'light';
  });
  const searchInputRef = useRef(null);

  // Toggle expanded header (for mobile)
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('taskTrackerTheme', newTheme);
  };

  // Apply theme to the document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Focus search on keyboard shortcut (Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <header className={`task-header ${expanded ? 'expanded' : ''}`}>
      <div className="header-main">
        <div className="header-left">
          <h1 className="app-title">{title}</h1>
          
          {/* Mobile menu toggle */}
          <button 
            className="menu-toggle" 
            onClick={toggleExpanded}
            aria-label="Toggle menu"
          >
            <span className="menu-icon">{expanded ? '×' : '☰'}</span>
          </button>
        </div>

        <div className="header-center">
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search tasks... (Ctrl+/)"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="header-right">
          <div className="view-selector">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <span className="view-icon">≡</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
              aria-label="Board view"
              title="Board view"
            >
              <span className="view-icon">◫</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
              aria-label="Calendar view"
              title="Calendar view"
            >
              <span className="view-icon">📅</span>
            </button>
          </div>
          
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="theme-icon">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable section for mobile */}
      {expanded && (
        <div className="header-expanded">
          <div className="mobile-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="mobile-view-selector">
            <button 
              className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => { 
                setViewMode('list');
                setExpanded(false);
              }}
            >
              <span className="view-icon">≡</span>
              List View
            </button>
            <button 
              className={`view-option ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('board');
                setExpanded(false);
              }}
            >
              <span className="view-icon">◫</span>
              Board View
            </button>
            <button 
              className={`view-option ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('calendar');
                setExpanded(false);
              }}
            >
              <span className="view-icon">📅</span>
              Calendar View
            </button>
          </div>

          <div className="mobile-theme-toggle">
            <button 
              className="theme-option" 
              onClick={() => {
                toggleTheme();
                setExpanded(false);
              }}
            >
              <span className="theme-icon">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TaskHeader;