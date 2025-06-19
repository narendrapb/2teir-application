import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7071/api';

  useEffect(() => {
    fetchTasks();
  }, []);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/tasks`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      showNotification(`Failed to fetch tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!task.trim()) {
      showNotification('Please enter a task.');
      return;
    }
    if (task.trim().length > 200) {
      showNotification('Task too long (max 200 characters).');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setTask('');
        await fetchTasks();
        showNotification('Task added successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to add task.');
      }
    } catch (error) {
      showNotification(`Failed to add task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        await fetchTasks();
        showNotification('Task deleted successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to delete task.');
      }
    } catch (error) {
      showNotification(`Failed to delete task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        await fetchTasks();
        showNotification('Task status updated!', 'success');
      } else {
        showNotification(data.message || 'Failed to update task.');
      }
    } catch (error) {
      showNotification(`Failed to update task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          To-Do List
        </h1>
        <p className="text-gray-600 mt-2">Stay organized, get things done!</p>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 relative">
        {/* Notification */}
        {notification.message && (
          <div className={`fixed top-4 right-4 p-4 rounded-md text-white animate-slide-in ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
          </div>
        )}

        {/* Input Form */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="New task input"
          />
          <button
            onClick={addTask}
            disabled={loading}
            className={`p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Add task"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              'Add'
            )}
          </button>
        </div>

        {/* Task List */}
        {loading && !notification.message && (
          <div className="flex justify-center mb-4">
            <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}
        {tasks.length === 0 && !loading ? (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                aria-label={`Task: ${item.task}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  aria-label={`Mark ${item.task} as ${item.completed ? 'incomplete' : 'complete'}`}
                />
                <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {item.task}
                </span>
                <span className="text-sm text-gray-500">{item.time}</span>
                <button
                  onClick={() => deleteTask(item.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-600 transition"
                  aria-label={`Delete ${item.task}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;