import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const addTask = async () => {
    if (!task.trim()) {
      alert('Please enter a task.');
      return;
    }
    try {
      await fetch(`${BACKEND_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/tasks`);
      const data = await response.json();
      setTasks(data.tasks);
      setShowTasks(true);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">To-Do List</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter new task"
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition"
          >
            Add Task
          </button>
        </div>
        <button
          onClick={fetchTasks}
          className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition mb-4"
        >
          Show Tasks
        </button>
        {showTasks && (
          <ul className="space-y-2">
            {tasks.map((item, idx) => (
              <li
                key={idx}
                className="p-2 bg-gray-50 rounded-md flex justify-between items-center"
              >
                <span>{item.task}</span>
                <span className="text-sm text-gray-500">{item.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;