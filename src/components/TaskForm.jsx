import { useState, useRef, useEffect } from 'react';
import './TaskForm.css';

/**
 * TaskForm component - Form for adding new tasks with various options
 */
const TaskForm = ({ addTask, categories = [] }) => {
  // Form state
  const [formData, setFormData] = useState({
    text: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    notes: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Refs
  const textInputRef = useRef(null);
  const formRef = useRef(null);
  
  // Calculate tomorrow's date for the date picker minimum
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.text.trim()) {
      // Prepare category (use existing or new one)
      let taskCategory = formData.category;
      if (taskCategory === 'new' && newCategory.trim()) {
        taskCategory = newCategory.trim();
      }
      
      // Add the new task
      addTask({
        ...formData,
        category: taskCategory
      });
      
      // Reset form
      setFormData({
        text: '',
        priority: 'medium',
        dueDate: '',
        category: '',
        notes: ''
      });
      setNewCategory('');
      setIsExpanded(false);
      setShowAdvanced(false);
      
      // Focus back on the text input
      textInputRef.current?.focus();
    }
  };
  
  // Toggle expanded form
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Toggle advanced options
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter to submit the form
      if (e.ctrlKey && e.key === 'Enter') {
        if (formRef.current && formData.text.trim()) {
          formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData.text]);
  
  // Handle clicking outside to collapse form
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target) && isExpanded) {
        if (!formData.text.trim()) {
          setIsExpanded(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, formData.text]);
  
  return (
    <form 
      ref={formRef}
      className={`task-form ${isExpanded ? 'expanded' : ''}`} 
      onSubmit={handleSubmit}
    >
      <div className="input-row primary">
        <input
          ref={textInputRef}
          className="new-task"
          name="text"
          placeholder="Add a task... (Ctrl+Enter to save)"
          value={formData.text}
          onChange={handleChange}
          onFocus={() => setIsExpanded(true)}
          autoFocus
        />
        <button 
          type="button"
          className="toggle-options"
          onClick={toggleExpanded}
          aria-label="Toggle options"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="form-expanded">
          <div className="input-row secondary">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`priority-select priority-${formData.priority}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="task-due-date">Due Date</label>
              <input
                type="date"
                id="task-due-date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="category-select"
              >
                <option value="">None</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new">+ New Category</option>
              </select>
            </div>
            
            <button 
              type="button" 
              className="advanced-toggle"
              onClick={toggleAdvanced}
            >
              {showAdvanced ? 'Less Options' : 'More Options'}
            </button>
          </div>
          
          {formData.category === 'new' && (
            <div className="input-row">
              <div className="form-group full-width">
                <label htmlFor="new-category">New Category Name</label>
                <input
                  type="text"
                  id="new-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="new-category-input"
                />
              </div>
            </div>
          )}
          
          {showAdvanced && (
            <div className="input-row">
              <div className="form-group full-width">
                <label htmlFor="task-notes">Notes</label>
                <textarea
                  id="task-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional details or notes about this task..."
                  rows="2"
                  className="notes-input"
                ></textarea>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                setFormData({
                  text: '',
                  priority: 'medium',
                  dueDate: '',
                  category: '',
                  notes: ''
                });
                setNewCategory('');
                setIsExpanded(false);
                setShowAdvanced(false);
              }}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="add-task-btn"
              disabled={!formData.text.trim()}
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TaskForm;