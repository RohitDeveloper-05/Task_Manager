import React, { createContext, useReducer, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  tasks: [],
  loading: true,
  error: null,
};

// Action types
const GET_TASKS = "GET_TASKS";
const ADD_TASK = "ADD_TASK";
const UPDATE_TASK = "UPDATE_TASK";
const DELETE_TASK = "DELETE_TASK";
const TASKS_ERROR = "TASKS_ERROR";

// Reducer
const tasksReducer = (state, action) => {
  switch (action.type) {
    case GET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      };
    case ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false,
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false,
      };
    case TASKS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Context
const TasksContext = createContext();

// Provider Component
export const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Get Tasks
  const getTasks = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/?${queryParams}`
      );
      dispatch({
        type: GET_TASKS,
        payload: res.data.tasks,
      });
    } catch (err) {
      dispatch({
        type: TASKS_ERROR,
        payload: err.response?.data?.msg || "Error fetching tasks",
      });
    }
  };

  // Add Task
  const addTask = async taskData => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/`,
        taskData,
        config
      );
      dispatch({
        type: ADD_TASK,
        payload: res.data,
      });
      toast.success(` Task Created  Successfully `, {
        duration: 3000,
        position: "top-center",
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: TASKS_ERROR,
        payload: err.response?.data?.msg || "Error adding task",
      });
      throw err;
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/task/${id}`,
        taskData,
        config
      );
      dispatch({
        type: UPDATE_TASK,
        payload: res.data,
      });
      toast.success(` Task Updated Successfully `, {
        duration: 3000,
        position: "top-center",
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: TASKS_ERROR,
        payload: err.response?.data?.msg || "Error updating task",
      });
      throw err;
    }
  };

  // Delete Task
  const deleteTask = async id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/task/${id}`);
      dispatch({
        type: DELETE_TASK,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: TASKS_ERROR,
        payload: err.response?.data?.msg || "Error deleting task",
      });
      throw err;
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        getTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// Custom hook for using the tasks context
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
