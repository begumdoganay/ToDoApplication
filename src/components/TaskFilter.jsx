import { useState } from 'react';
import './TaskFilter.css';

/**
 * TaskFilter component - Provides filtering and sorting options for tasks
 */
const TaskFilter = ({ 
  statusFilter, 
  priorityFilter, 
  categoryFilter,
  sortBy,
  categories = [],
  setStatusFilter, 
  setPriorityFilter,
  setCategoryFilter,
  setSortBy
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // STATUS FILTER OPTIONS
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: '📋' },
    { value: 'active', label: 'Active', icon: '⏳' },
    { value: 'completed', label: 'Completed', icon: '✓' },
    { value: 'due-today', label: 'Due Today', icon: '📅' },
    { value: 'overdue', label: 'Overdue', icon: '⚠️' }
  ];

  // PRIORITY FILTER OPTIONS
  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: '✦' },
    { value: 'high', label: 'High Priority', icon: '❗' },
    { value: 'medium', label: 'Medium Priority', icon: '❕' },
    { value: 'low', label: 'Low Priority', icon: '•' }
  ];
  
  // SORT OPTIONS
  const sortOptions = [
    { value: 'dueDate', label: 'Due Date', icon: '📅' },
    { value: 'priority', label: 'Priority', icon: '❗' },
    { value: 'alphabetical', label: 'Alphabetical', icon: 'A-Z' },
    { value: 'created', label: 'Creation Date', icon: '⏱' }
  ];
  
  // Toggle expanded filters on mobile
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`filter-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-header">
        <h3>Filters & Sorting</h3>
        <button
          className="filter-toggle"
          onClick={toggleExpanded}
          aria-label="Toggle filters"
        >
          {isExpanded ? '▲ Hide' : '▼ Show'}
        </button>
      </div>
      
      <div className="filter-content">
        <div className="filter-section">
          <div className="filter-label">Status</div>
          <div className="filter-group status-filters">
            {statusOptions.map(({ value, label, icon }) => (
              <button
                key={value}
                className={`filter-btn ${statusFilter === value ? 'selected' : ''} ${value}`}
                onClick={() => setStatusFilter(value)}
                title={label}
              >
                <span className="filter-icon">{icon}</span>
                <span className="filter-text">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-label">Priority</div>
          <div className="filter-group priority-filters">
            {priorityOptions.map(({ value, label, icon }) => (
              <button
                key={value}
                className={`filter-btn ${priorityFilter === value ? 'selected' : ''} ${value !== 'all' ? value : ''}`}
                onClick={() => setPriorityFilter(value)}
                title={label}
              >
                <span className="filter-icon">{icon}</span>
                <span className="filter-text">{label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {categories.length > 0 && (
          <div className="filter-section">
            <div className="filter-label">Category</div>
            <div className="filter-group category-filters">
              <button
                className={`filter-btn ${categoryFilter === 'all' ? 'selected' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                <span className="filter-icon">📂</span>
                <span className="filter-text">All Categories</span>
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${categoryFilter === category ? 'selected' : ''} category`}
                  onClick={() => setCategoryFilter(category)}
                >
                  <span className="filter-icon">📁</span>
                  <span className="filter-text">{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="filter-section">
          <div className="filter-label">Sort By</div>
          <div className="filter-group sort-options">
            {sortOptions.map(({ value, label, icon }) => (
              <button
                key={value}
                className={`filter-btn ${sortBy === value ? 'selected' : ''}`}
                onClick={() => setSortBy(value)}
                title={label}
              >
                <span className="filter-icon">{icon}</span>
                <span className="filter-text">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;