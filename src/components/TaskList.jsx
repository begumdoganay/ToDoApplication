import { useState, useRef, useEffect } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

/**
 * TaskList Component - Renders the list of tasks based on current view mode
 */
const TaskList = ({ 
  tasks, 
  toggleTask, 
  deleteTask, 
  editTask, 
  duplicateTask,
  viewMode = 'list' 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const listRef = useRef(null);
  
  // Handle empty state
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No tasks to display</h3>
        <p>Try changing your filters or adding a new task</p>
      </div>
    );
  }
  
  // Group tasks by date for calendar view
  const groupTasksByDate = () => {
    const groupedTasks = {};
    
    // Create group for tasks with no due date
    groupedTasks['no-date'] = tasks.filter(task => !task.dueDate);
    
    // Group the rest by due date
    tasks.filter(task => task.dueDate).forEach(task => {
      const dateKey = task.dueDate;
      if (!groupedTasks[dateKey]) {
        groupedTasks[dateKey] = [];
      }
      groupedTasks[dateKey].push(task);
    });
    
    // Sort date groups
    return Object.entries(groupedTasks)
      .sort(([dateA], [dateB]) => {
        if (dateA === 'no-date') return 1; // No date goes at the end
        if (dateB === 'no-date') return -1;
        return new Date(dateA) - new Date(dateB);
      });
  };
  
  // Group tasks by category or priority for board view
  const groupTasksForBoard = () => {
    // Check if we have categories to group by
    const hasCategories = tasks.some(task => task.category);
    
    if (hasCategories) {
      // Group by category
      const groupedTasks = {
        'uncategorized': tasks.filter(task => !task.category)
      };
      
      tasks.filter(task => task.category).forEach(task => {
        if (!groupedTasks[task.category]) {
          groupedTasks[task.category] = [];
        }
        groupedTasks[task.category].push(task);
      });
      
      return {
        groupBy: 'category',
        groups: Object.entries(groupedTasks)
      };
    } else {
      // Group by priority
      const groupedTasks = {
        'high': tasks.filter(task => task.priority === 'high'),
        'medium': tasks.filter(task => task.priority === 'medium'),
        'low': tasks.filter(task => task.priority === 'low')
      };
      
      return {
        groupBy: 'priority',
        groups: Object.entries(groupedTasks)
      };
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if date is today
  const isToday = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    return date.getTime() === today.getTime();
  };
  
  // Check if date is in the past
  const isPast = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    return date < today;
  };
  
  // Drag and drop handlers (for board view)
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };
  
  const handleDragOver = (e, groupId) => {
    e.preventDefault();
    setDropTarget(groupId);
  };
  
  const handleDrop = (groupId) => {
    if (draggedTask) {
      // Update task with new category or priority
      const updatedData = {};
      
      const boardGroups = groupTasksForBoard();
      if (boardGroups.groupBy === 'category') {
        updatedData.category = groupId === 'uncategorized' ? '' : groupId;
      } else {
        updatedData.priority = groupId;
      }
      
      editTask(draggedTask.id, updatedData);
      setDraggedTask(null);
      setDropTarget(null);
    }
  };
  
  // Render different views based on viewMode
  if (viewMode === 'calendar') {
    const groupedTasks = groupTasksByDate();
    
    return (
      <div className="task-list-calendar">
        {groupedTasks.map(([dateKey, dateTasks]) => (
          <div 
            key={dateKey} 
            className={`calendar-group ${
              dateKey === 'no-date' ? 'no-date' : 
              isToday(dateKey) ? 'today' : 
              isPast(dateKey) ? 'past' : ''
            }`}
          >
            <div className="calendar-date">
              {dateKey === 'no-date' ? (
                <span>No Due Date</span>
              ) : (
                <>
                  <span className="date-text">{formatDate(dateKey)}</span>
                  {isToday(dateKey) && <span className="today-badge">Today</span>}
                </>
              )}
            </div>
            
            <ul className="task-list">
              {dateTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  duplicateTask={duplicateTask}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  } else if (viewMode === 'board') {
    const { groupBy, groups } = groupTasksForBoard();
    
    return (
      <div className="task-list-board">
        {groups.map(([groupId, groupTasks]) => (
          <div 
            key={groupId}
            className={`board-column ${groupId}`}
            onDragOver={(e) => handleDragOver(e, groupId)}
            onDrop={() => handleDrop(groupId)}
          >
            <div className="board-header">
              <h3>{groupId === 'uncategorized' ? 'Uncategorized' : groupId}</h3>
              <span className="task-count">{groupTasks.length}</span>
            </div>
            
            <ul 
              className={`task-list board-tasks ${dropTarget === groupId ? 'drop-target' : ''}`}
            >
              {groupTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  duplicateTask={duplicateTask}
                  onDragStart={() => handleDragStart(task)}
                  boardView={true}
                />
              ))}
              
              {groupTasks.length === 0 && (
                <div className="empty-column">
                  <p>No tasks</p>
                </div>
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  } else {
    // Default list view
    return (
      <ul ref={listRef} className="task-list">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}
            duplicateTask={duplicateTask}
          />
        ))}
      </ul>
    );
  }
};

export default TaskList;