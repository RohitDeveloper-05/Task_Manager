// frontend/src/pages/TaskForm.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

const TaskForm = () => {
  const { addTask, updateTask, tasks } = useTasks();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const taskToEdit = tasks.find(task => task._id === id);
      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          category: taskToEdit.category,
          status: taskToEdit.status,
          priority: taskToEdit.priority,
          dueDate: taskToEdit.dueDate
            ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
            : "",
        });
      }
    }
  }, [id, tasks]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      };

      if (isEditing) {
        await updateTask(id, taskData);
      } else {
        await addTask(taskData);
      }

      navigate("/tasks");
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-primary'>
        {isEditing ? "Edit Task" : "Create New Task"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-custom rounded-lg p-8'
      >
        {/* {errors.general && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
            role='alert'
          >
            {errors.general}
          </div>
        )} */}

        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-text-light mb-2'
          >
            Title *
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
              ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            placeholder='Enter task title'
          />
          {errors.title && (
            <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
          )}
        </div>

        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-text-light mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows='4'
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
              ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            placeholder='Enter task description (optional)'
          ></textarea>
          {errors.description && (
            <p className='text-red-500 text-xs mt-1'>{errors.description}</p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Category
            </label>
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value='Work'>Work</option>
              <option value='Personal'>Personal</option>
              <option value='Shopping'>Shopping</option>
              <option value='Other'>Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Status
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value='Pending'>Pending</option>
              <option value='Completed'>Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='priority'
              className='block text-sm font-medium text-text-light mb-2'
            >
              Priority
            </label>
            <select
              id='priority'
              name='priority'
              value={formData.priority}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </select>
          </div>
        </div>

        <div className='mt-4'>
          <label
            htmlFor='dueDate'
            className='block text-sm font-medium text-text-light mb-2'
          >
            Due Date
          </label>
          <input
            type='date'
            id='dueDate'
            name='dueDate'
            value={formData.dueDate}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='mt-6 flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => navigate("/tasks")}
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition duration-300'
          >
            {isEditing ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
