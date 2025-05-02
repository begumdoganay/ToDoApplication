# 📋 Task Tracker Pro | React + Vite

A powerful, feature-rich task management application built with React and Vite. This application provides a modern, responsive interface for tracking and organizing your daily tasks with advanced features for ultimate productivity.


## 🌟 Key Features

### Task Management
- **Comprehensive Task Information**: Add tasks with text, priority, due dates, categories, and notes
- **Multiple View Modes**: List view, Board view (Kanban-style), and Calendar view
- **Advanced Filtering**: Filter tasks by status, priority, category, and more
- **Sorting Options**: Sort by due date, priority, alphabetical, or creation date
- **Dark/Light Mode**: Switch between themes for comfortable use day and night
- **Bulk Actions**: Complete all tasks, clear completed tasks with one click
- **Task Duplication**: Easily duplicate existing tasks
- **Detailed Task View**: Expand tasks to see all related information
- **Drag & Drop**: Reorganize tasks in board view with intuitive drag and drop

### User Experience
- **Responsive Design**: Works flawlessly on all devices from mobile to desktop
- **Keyboard Shortcuts**: Efficient task management with keyboard commands
- **Animations**: Smooth transitions and visual feedback
- **Progress Tracking**: Visual progress bars and statistics
- **Search**: Quickly find tasks with the search function
- **Data Persistence**: All tasks saved in localStorage

### Performance & Code Quality
- **React Hooks**: Modern React practices with functional components
- **CSS Variables**: Dynamic theming with CSS variables
- **Modular Components**: Well-organized, reusable component structure
- **Optimized Rendering**: Efficient rendering with React's best practices
- **Accessibility**: Built with a11y in mind

## 🛠️ Technical Stack

- **React**: Frontend UI library (v19.0.0)
- **Vite**: Next-generation frontend build tool
- **CSS3**: Custom styling with CSS variables and modules
- **LocalStorage**: Browser-based data persistence
- **React Hooks**: State management and side effects

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-tracker-pro.git
```

2. Navigate to the project directory
```bash
cd task-tracker-pro
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

## 📂 Project Structure

```
src/
├── components/
│   ├── TaskTracker.jsx       # Main app container & state management
│   ├── TaskHeader.jsx        # App header with search & view controls
│   ├── TaskStats.jsx         # Task statistics & progress display
│   ├── TaskForm.jsx          # Form for adding new tasks
│   ├── TaskFilter.jsx        # Filtering & sorting options
│   ├── TaskList.jsx          # Renders tasks in different view modes
│   └── TaskItem.jsx          # Individual task component
├── styles/
│   ├── TaskHeader.css        # Component-specific styles
│   ├── TaskStats.css
│   ├── TaskForm.css
│   ├── TaskFilter.css
│   ├── TaskList.css
│   └── TaskItem.css
├── App.jsx                   # Root application component
├── App.css                   # App-level styles
├── index.css                 # Global styles & CSS variables
└── main.jsx                  # Application entry point
```

## 🖥️ Usage Guide

### Adding Tasks
1. Enter task text in the input field at the top
2. Click the dropdown arrow to show additional options
3. Set priority, due date, category, and optional notes
4. Click "Add Task" or press Ctrl+Enter to save

### Managing Tasks
- Click the checkbox to mark a task as complete
- Click on a task to view its details
- Use the edit button or double-click to edit a task
- Use the options menu (⋮) for more actions
- Drag and drop tasks in board view to change category or priority

### Filtering & Sorting
- Use the filter buttons to show specific subsets of tasks
- Choose a sorting method from the dropdown menu
- Search for specific tasks using the search bar

### View Modes
- List View: Classic to-do list style
- Board View: Kanban-style columns organized by category or priority
- Calendar View: Tasks organized by due date

### Keyboard Shortcuts
- `Ctrl + /`: Focus search bar
- `Ctrl + Enter`: Save new task or edits
- `Esc`: Cancel editing or close details
- `Alt + T`: Create new task
- `Alt + D`: Toggle dark/light mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Design inspired by modern productivity tools like Todoist, Trello, and TickTick
- Icons provided by [Font Awesome](https://fontawesome.com/)
- Color schemes based on Material Design guidelines