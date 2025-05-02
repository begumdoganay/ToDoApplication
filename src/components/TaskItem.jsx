// Import React hooks
import { useState, useRef, useEffect } from 'react';
// Import CSS for this component
import './TaskItem.css';

/**
 * TaskItem Component - Renders an individual task item
 */
const TaskItem = ({ 
  task, 
  toggleTask, 
  deleteTask, 
  editTask, 
  duplicateTask,
  onDragStart,
  boardView = false
}) => {
  // STATE DEFINITIONS
  // Editing mode state
  const [isEditing, setIsEditing] = useState(false);
  // Form data state
  const [formData, setFormData] = useState({
    text: task.text,
    priority: task.priority,
    dueDate: task.dueDate || '',
    category: task.category || '',
    notes: task.notes || ''
  });
  // Menu state
  const [showMenu, setShowMenu] = useState(false);
  // Task details expansion state
  const [showDetails, setShowDetails] = useState(false);
  
  // Refs
  const menuRef = useRef(null);
  const itemRef = useRef(null);
  const inputRef = useRef(null);
  
  // Handle changes to the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // FORM HANDLING
  // Handle edit form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.text.trim()) {
      // Update the task
      editTask(task.id, {
        text: formData.text,
        priority: formData.priority,
        dueDate: formData.dueDate,
        category: formData.category,
        notes: formData.notes
      });
      
      // Exit editing mode
      setIsEditing(false);
    }
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    // Reset form data
    setFormData({
      text: task.text,
      priority: task.priority,
      dueDate: task.dueDate || '',
      category: task.category || '',
      notes: task.notes || ''
    });
    
    // Exit editing mode
    setIsEditing(false);
  };
  
  // Toggle the task details
  const toggleDetails = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };
  
  // Toggle the context menu
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format datetime for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  
  // Calculate days until due
  const getDueDateStatus = () => {
    if (!task.dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'due-today';
    if (diffDays <= 3) return 'due-soon';
    return '';
  };
  
  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);
  
  // Calculate task metadata
  const getTaskMetadata = () => {
    const metadata = [];
    
    if (task.completedAt) {
      metadata.push({
        label: 'Completed',
        value: formatDateTime(task.completedAt),
        icon: '✓'
      });
    }
    
    if (task.createdAt) {
      metadata.push({
        label: 'Created',
        value: formatDateTime(task.createdAt),
        icon: '🕒'
      });
    }
    
    if (task.lastModified) {
      metadata.push({
        label: 'Modified',
        value: formatDateTime(task.lastModified),
        icon: '✏️'
      });
    }
    
    return metadata;
  };
  
  // Handle drag events for board view
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart();
      
      // Add drag effect
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id.toString());
      
      // Add a drag image
      const dragImage = document.createElement('div');
      dragImage.textContent = task.text;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      
      // Remove the drag image after drag ends
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  };
  
  // RENDER
  return (
    <li 
      ref={itemRef}
      className={`
        task-item
        ${task.completed ? 'completed' : ''} 
        ${isEditing ? 'editing' : ''} 
        priority-${task.priority} 
        ${getDueDateStatus()}
        ${showDetails ? 'expanded' : ''}
        ${boardView ? 'board-item' : ''}
      `}
      draggable={boardView}
      onDragStart={handleDragStart}
    >
      {/* VIEW MODE */}
      <div className="view">
        {/* CHECKBOX WRAPPER */}
        <div className="checkbox-wrapper">
          {/* Completed status checkbox */}
          <input
            type="checkbox"
            className="toggle"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          {/* Custom checkbox design */}
          <div className="custom-checkbox" />
        </div>

        {/* Task content */}
        <div 
          className="task-content" 
          onClick={toggleDetails}
        >
          <div className="task-text">{task.text}</div>
          
          <div className="task-meta">
            {task.category && (
              <span className="category-badge">
                {task.category}
              </span>
            )}
            
            {task.priority !== 'medium' && (
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            )}
            
            {task.dueDate && (
              <span className={`due-date ${getDueDateStatus()}`}>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="task-actions">
          <button 
            className="edit-btn action-btn" 
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            <span className="icon">✎</span>
          </button>
          
          <button 
            className="menu-btn action-btn" 
            onClick={toggleMenu}
            aria-label="Task options"
            title="Options"
          >
            <span className="icon">⋮</span>
          </button>
          
          {/* Context menu */}
          {showMenu && (
            <div ref={menuRef} className="context-menu">
              <button 
                className="menu-item" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
              >
                <span className="menu-icon">✎</span>
                <span className="menu-text">Edit Task</span>
              </button>
              
              <button 
                className="menu-item" 
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateTask(task.id);
                  setShowMenu(false);
                }}
              >
                <span className="menu-icon">📋</span>
                <span className="menu-text">Duplicate</span>
              </button>
              
              <button 
                className="menu-item delete" 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                  setShowMenu(false);
                }}
              >
                <span className="menu-icon">🗑️</span>
                <span className="menu-text">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* TASK DETAILS */}
      {showDetails && !isEditing && (
        <div className="task-details">
          {task.notes && (
            <div className="task-notes">
              <h4>Notes</h4>
              <p>{task.notes}</p>
            </div>
          )}
          
          <div className="task-metadata">
            {getTaskMetadata().map((item, index) => (
              <div key={index} className="metadata-item">
                <span className="metadata-icon">{item.icon}</span>
                <span className="metadata-label">{item.label}:</span>
                <span className="metadata-value">{item.value}</span>
              </div>
            ))}
          </div>
          
          <div className="detail-actions">
            <button 
              className="detail-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              Edit
            </button>
            <button 
              className="detail-btn" 
              onClick={(e) => {
                e.stopPropagation();
                duplicateTask(task.id);
              }}
            >
              Duplicate
            </button>
            <button 
              className="detail-btn delete" 
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* EDITING MODE */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="edit-field">
            <label htmlFor={`edit-text-${task.id}`}>Task</label>
            <input
              ref={inputRef}
              id={`edit-text-${task.id}`}
              className="edit-text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="What needs to be done?"
            />
          </div>
          
          <div className="edit-row">
            <div className="edit-field">
              <label htmlFor={`edit-priority-${task.id}`}>Priority</label>
              <select 
                id={`edit-priority-${task.id}`}
                className={`edit-priority priority-${formData.priority}`}
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="edit-field">
              <label htmlFor={`edit-date-${task.id}`}>Due Date</label>
              <input
                id={`edit-date-${task.id}`}
                type="date"
                className="edit-date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="edit-field">
              <label htmlFor={`edit-category-${task.id}`}>Category</label>
              <input
                id={`edit-category-${task.id}`}
                type="text"
                className="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Work, Personal, Shopping"
              />
            </div>
          </div>
          
          <div className="edit-field">
            <label htmlFor={`edit-notes-${task.id}`}>Notes</label>
            <textarea
              id={`edit-notes-${task.id}`}
              className="edit-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional details here..."
              rows="3"
            ></textarea>
          </div>
          
          <div className="edit-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={!formData.text.trim()}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </li>
  );
};

export default TaskItem;// Import React hooks
import { useState } from 'react';
// Import CSS for this component
import './TaskItem.css';

// Task Item Component
const TaskItem = ({ task, toggleTask, deleteTask, editTask }) => {
  // STATE DEFINITIONS
  // Editing mode state
  const [isEditing, setIsEditing] = useState(false);
  // Edited text state
  const [editText, setEditText] = useState(task.text);
  // Edited priority state
  const [editPriority, setEditPriority] = useState(task.priority);
  // Edited due date state
  const [editDueDate, setEditDueDate] = useState(task.dueDate);

  // FORM HANDLING
  // Handle edit form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (editText.trim()) { // Check for empty text
      editTask(task.id, editText, editPriority, editDueDate); // Update the task
      setIsEditing(false); // Exit editing mode
    }
  };

  // Calculate days until due
  const getDueDateStatus = () => {
    if (!task.dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'due-today';
    if (diffDays <= 3) return 'due-soon';
    return '';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // RENDER
  return (
    <li className={`
      ${task.completed ? 'completed' : ''} 
      ${isEditing ? 'editing' : ''} 
      priority-${task.priority} 
      ${getDueDateStatus()}
    `}>
      {/* VIEW MODE */}
      <div className="view">
        {/* CHECKBOX WRAPPER */}
        <div className="checkbox-wrapper">
          {/* Completed status checkbox */}
          <input
            type="checkbox"
            className="toggle"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          {/* Custom checkbox design */}
          <div className="custom-checkbox" />
        </div>

        {/* Task content */}
        <div className="task-content" onDoubleClick={() => setIsEditing(true)}>
          <div className="task-text">{task.text}</div>
          <div className="task-meta">
            {task.priority !== 'medium' && (
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className={`due-date ${getDueDateStatus()}`}>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button className="destroy" onClick={() => deleteTask(task.id)} />
      </div>

      {/* EDITING MODE */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            className="edit-text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          
          <div className="edit-options">
            <select 
              className="edit-priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <input
              type="date"
              className="edit-date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
            
            <button type="submit" className="save-button">Save</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setEditText(task.text);
                setEditPriority(task.priority);
                setEditDueDate(task.dueDate);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
};

export default TaskItem;