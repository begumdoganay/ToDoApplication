import { useState } from 'react';
import './TaskStats.css';

/**
 * TaskStats component - Displays statistics about tasks and progress
 */
const TaskStats = ({ stats }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate completion percentage
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;
  
  // Toggle expanded stats
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <section className={`task-stats ${expanded ? 'expanded' : ''}`}>
      <div className="stats-summary" onClick={toggleExpanded}>
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
              title={`${completionPercentage}% Complete`}
            ></div>
          </div>
          <div className="progress-text">
            {completionPercentage}% Complete
          </div>
        </div>
        
        <div className="stats-pills">
          <div className="stat-pill" title="Total tasks">
            <span className="stat-icon">📋</span>
            <span className="stat-count">{stats.total}</span>
          </div>
          <div className="stat-pill active" title="Active tasks">
            <span className="stat-icon">⏳</span>
            <span className="stat-count">{stats.active}</span>
          </div>
          <div className="stat-pill completed" title="Completed tasks">
            <span className="stat-icon">✓</span>
            <span className="stat-count">{stats.completed}</span>
          </div>
          
          {stats.overdue > 0 && (
            <div className="stat-pill overdue" title="Overdue tasks">
              <span className="stat-icon">⚠️</span>
              <span className="stat-count">{stats.overdue}</span>
            </div>
          )}
          
          {(stats.dueToday > 0 || stats.dueSoon > 0) && (
            <div className="stat-pill due-soon" title="Tasks due today or soon">
              <span className="stat-icon">⏰</span>
              <span className="stat-count">{stats.dueToday + stats.dueSoon}</span>
            </div>
          )}
        </div>
        
        <button 
          className="expand-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
          title={expanded ? "Show less" : "Show more"}
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>
      
      {expanded && (
        <div className="stats-details">
          <div className="stats-row">
            <div className="stats-group">
              <h3>Task Status</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active</span>
                  <span className="stat-value">{stats.active}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{stats.completed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completion Rate</span>
                  <span className="stat-value">{completionPercentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="stats-group">
              <h3>Due Dates</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Overdue</span>
                  <span className="stat-value overdue">{stats.overdue}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Due Today</span>
                  <span className="stat-value due-today">{stats.dueToday}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Due Soon</span>
                  <span className="stat-value due-soon">{stats.dueSoon}</span>
                </div>
              </div>
            </div>
          </div>
          
          {stats.categories.length > 0 && (
            <div className="stats-row">
              <div className="stats-group full-width">
                <h3>Categories</h3>
                <div className="category-bars">
                  {stats.categories.map(([category, count]) => (
                    <div className="category-item" key={category}>
                      <div className="category-header">
                        <span className="category-name">{category}</span>
                        <span className="category-count">{count}</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-fill"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TaskStats;