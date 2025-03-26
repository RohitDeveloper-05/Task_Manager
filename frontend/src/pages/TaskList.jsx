// frontend/src/pages/TaskList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { TrashIcon, EditIcon, CheckIcon } from "lucide-react";

const TaskList = () => {
  const { tasks, getTasks, deleteTask, updateTask, loading } = useTasks();
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    getTasks(filters);
  }, [filters]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteTask = async id => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
  };

  const handleToggleStatus = async task => {
    try {
      await updateTask(task._id, {
        status: task.status === "Completed" ? "Pending" : "Completed",
      });
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const renderTaskCard = task => (
    <div
      key={task._id}
      className={`bg-white shadow-custom rounded-lg p-4 mb-4 flex justify-between items-center 
        ${task.status === "Completed" ? "opacity-60" : ""}`}
    >
      <div className='flex-grow'>
        <div className='flex items-center space-x-2'>
          <h3
            className={`text-lg font-semibold ${
              task.status === "Completed" ? "line-through" : ""
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs 
            ${
              task.priority === "High"
                ? "bg-red-100 text-red-800"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className='text-text-light mt-1'>{task.description}</p>
        )}
        <div className='mt-2 text-sm text-text-light'>
          <span>Category: {task.category}</span>
          {task.dueDate && (
            <span className='ml-4'>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <button
          onClick={() => handleToggleStatus(task)}
          className={`p-2 rounded-full 
            ${
              task.status === "Completed"
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          title={
            task.status === "Completed"
              ? "Mark as Pending"
              : "Mark as Completed"
          }
        >
          <CheckIcon size={20} />
        </button>
        <Link
          to={`/tasks/edit/${task._id}`}
          className='p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200'
          title='Edit Task'
        >
          <EditIcon size={20} />
        </Link>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className='p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200'
          title='Delete Task'
        >
          <TrashIcon size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-primary'>My Tasks</h1>
        <Link
          to='/tasks/new'
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300'
        >
          Create New Task
        </Link>
      </div>

      {/* Filters */}
      <div className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <select
          name='category'
          value={filters.category}
          onChange={handleFilterChange}
          className='w-full p-2 border rounded-md'
        >
          <option value=''>All Categories</option>
          <option value='Work'>Work</option>
          <option value='Personal'>Personal</option>
          <option value='Shopping'>Shopping</option>
          <option value='Other'>Other</option>
        </select>

        <select
          name='status'
          value={filters.status}
          onChange={handleFilterChange}
          className='w-full p-2 border rounded-md'
        >
          <option value=''>All Statuses</option>
          <option value='Pending'>Pending</option>
          <option value='Completed'>Completed</option>
        </select>

        <input
          type='text'
          name='search'
          value={filters.search}
          onChange={handleFilterChange}
          placeholder='Search tasks...'
          className='w-full p-2 border rounded-md'
        />
      </div>

      {/* Task List */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className='text-center text-text-light'>
          <p>No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div>{tasks.map(renderTaskCard)}</div>
      )}
    </div>
  );
};

export default TaskList;
